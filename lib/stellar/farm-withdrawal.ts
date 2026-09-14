import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export const FARM_CODE = "FARM";
export const FARM_ISSUER = "GBF7ZMNV4L2PFQRHJEMQLH7FEYMIP4ZSUKQ42ZOCYL5MI5P234C2NMNB";
export const HORIZON_URL = "https://horizon.stellar.org";

const server = new Horizon.Server(HORIZON_URL);
const farmAsset = new Asset(FARM_CODE, FARM_ISSUER);

function getDistributionKeypair() {
  const secret = process.env.STELLAR_DISTRIBUTION_SECRET_KEY?.trim();
  if (!secret) {
    throw new Error("STELLAR_DISTRIBUTION_SECRET_KEY is not configured");
  }

  return Keypair.fromSecret(secret);
}

function toStroops(value: string | number) {
  const normalized = String(value).trim();
  if (!/^\d+(?:\.\d{1,7})?$/.test(normalized)) {
    throw new Error("Invalid Stellar amount");
  }

  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * 10_000_000n + BigInt(fraction.padEnd(7, "0"));
}

function findFarmBalance(account: Horizon.ServerApi.AccountRecord) {
  return account.balances.find(
    (balance) =>
      balance.asset_type !== "native" &&
      balance.asset_code === FARM_CODE &&
      balance.asset_issuer === FARM_ISSUER,
  );
}

export async function assertDestinationCanReceiveFarm(destination: string, amount: string) {
  if (!StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error("Invalid Stellar wallet address");
  }

  const account = await server.loadAccount(destination);
  const balance = findFarmBalance(account);

  if (!balance) {
    throw new Error("Destination wallet does not have a FARM trustline");
  }

  if (balance.is_authorized === false) {
    throw new Error("Destination wallet's FARM trustline is not authorized");
  }

  const amountStroops = toStroops(amount);
  const currentStroops = toStroops(balance.balance);
  const limitStroops = balance.limit ? toStroops(balance.limit) : 0n;

  if (currentStroops + amountStroops > limitStroops) {
    throw new Error("Destination wallet's FARM trustline limit is too low");
  }
}

export async function findExistingWithdrawalTransaction(withdrawalId: number) {
  const distribution = getDistributionKeypair();
  const memo = `WD:${withdrawalId}`;
  const response = await server
    .transactions()
    .forAccount(distribution.publicKey())
    .order("desc")
    .limit(50)
    .call();

  return response.records.find((transaction) => transaction.memo === memo)?.hash ?? null;
}

export async function submitFarmWithdrawal({
  withdrawalId,
  destination,
  amount,
}: {
  withdrawalId: number;
  destination: string;
  amount: string;
}) {
  const existingHash = await findExistingWithdrawalTransaction(withdrawalId);
  if (existingHash) {
    return existingHash;
  }

  await assertDestinationCanReceiveFarm(destination, amount);

  const distribution = getDistributionKeypair();
  const sourceAccount = await server.loadAccount(distribution.publicKey());
  const sourceFarmBalance = findFarmBalance(sourceAccount);

  if (!sourceFarmBalance) {
    throw new Error("Distribution account does not hold FARM");
  }

  if (toStroops(sourceFarmBalance.balance) < toStroops(amount)) {
    throw new Error("Distribution account does not have enough FARM");
  }

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: farmAsset,
        amount,
      }),
    )
    .addMemo(Memo.text(`WD:${withdrawalId}`))
    .setTimeout(60)
    .build();

  transaction.sign(distribution);
  const response = await server.submitTransaction(transaction);
  return response.hash;
}
