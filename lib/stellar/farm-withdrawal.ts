import {
  Asset,
  BASE_FEE,
  Claimant,
  Horizon,
  Keypair,
  Memo,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { getWithdrawalSettlementMode } from "../withdrawal-settlement-mode.mjs";

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

function normalizeInteger(value: string) {
  const normalized = value.replace(/^0+/, "");
  return normalized || "0";
}

function compareIntegers(left: string, right: string) {
  const a = normalizeInteger(left);
  const b = normalizeInteger(right);

  if (a.length !== b.length) {
    return a.length > b.length ? 1 : -1;
  }

  return a === b ? 0 : a > b ? 1 : -1;
}

function addIntegers(left: string, right: string) {
  let a = left.length - 1;
  let b = right.length - 1;
  let carry = 0;
  let result = "";

  while (a >= 0 || b >= 0 || carry > 0) {
    const sum =
      (a >= 0 ? left.charCodeAt(a--) - 48 : 0) +
      (b >= 0 ? right.charCodeAt(b--) - 48 : 0) +
      carry;
    result = String(sum % 10) + result;
    carry = Math.floor(sum / 10);
  }

  return normalizeInteger(result);
}

function toStroops(value: string | number) {
  const normalized = String(value).trim();
  if (!/^\d+(?:\.\d{1,7})?$/.test(normalized)) {
    throw new Error("Invalid Stellar amount");
  }

  const [whole, fraction = ""] = normalized.split(".");
  return normalizeInteger(`${whole}${fraction.padEnd(7, "0")}`);
}

function findFarmBalance(account: { balances: Horizon.ServerApi.AccountRecord["balances"] }) {
  for (const balance of account.balances) {
    if (
      (balance.asset_type === "credit_alphanum4" || balance.asset_type === "credit_alphanum12") &&
      balance.asset_code === FARM_CODE &&
      balance.asset_issuer === FARM_ISSUER
    ) {
      return balance;
    }
  }

  return undefined;
}

async function loadDestinationFarmBalance(destination: string) {
  try {
    const account = await server.loadAccount(destination);
    return findFarmBalance(account);
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return undefined;
    throw error;
  }
}

export async function assertDestinationCanReceiveFarm(destination: string, amount: string) {
  if (!StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error("Invalid Stellar wallet address");
  }

  const balance = await loadDestinationFarmBalance(destination);
  if (!balance) return;

  if (balance.is_authorized === false) {
    throw new Error("Destination wallet's FARM trustline is not authorized");
  }

  const amountStroops = toStroops(amount);
  const currentStroops = toStroops(balance.balance);
  const limitStroops = balance.limit ? toStroops(balance.limit) : "0";
  const resultingStroops = addIntegers(currentStroops, amountStroops);

  if (compareIntegers(resultingStroops, limitStroops) > 0) {
    throw new Error("Destination wallet's FARM trustline limit is too low");
  }
}

function getClaimableBalanceId(transaction: Horizon.ServerApi.TransactionRecord) {
  try {
    const parsed = TransactionBuilder.fromXdr(transaction.envelope_xdr, Networks.PUBLIC);
    const operation = parsed.operations()[0];
    if (operation?.type !== "createClaimableBalance") return null;
    return parsed.getClaimableBalanceId(0);
  } catch {
    return null;
  }
}

export async function findExistingWithdrawalSettlement(withdrawalId: number) {
  const distribution = getDistributionKeypair();
  const memo = `WD:${withdrawalId}`;
  const response = await server
    .transactions()
    .forAccount(distribution.publicKey())
    .order("desc")
    .limit(50)
    .call();

  const transaction = response.records.find((record) => record.memo === memo);
  if (!transaction) return null;

  return {
    txHash: transaction.hash,
    claimableBalanceId: getClaimableBalanceId(transaction),
  };
}

export async function findExistingWithdrawalTransaction(withdrawalId: number) {
  return (await findExistingWithdrawalSettlement(withdrawalId))?.txHash ?? null;
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
  const existing = await findExistingWithdrawalSettlement(withdrawalId);
  if (existing) return existing;

  if (!StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error("Invalid Stellar wallet address");
  }

  const destinationFarmBalance = await loadDestinationFarmBalance(destination);
  const settlementMode = getWithdrawalSettlementMode(Boolean(destinationFarmBalance));

  if (destinationFarmBalance?.is_authorized === false) {
    throw new Error("Destination wallet's FARM trustline is not authorized");
  }

  if (destinationFarmBalance) {
    const amountStroops = toStroops(amount);
    const currentStroops = toStroops(destinationFarmBalance.balance);
    const limitStroops = destinationFarmBalance.limit
      ? toStroops(destinationFarmBalance.limit)
      : "0";
    const resultingStroops = addIntegers(currentStroops, amountStroops);

    if (compareIntegers(resultingStroops, limitStroops) > 0) {
      throw new Error("Destination wallet's FARM trustline limit is too low");
    }
  }

  const distribution = getDistributionKeypair();
  const sourceAccount = await server.loadAccount(distribution.publicKey());
  const sourceFarmBalance = findFarmBalance(sourceAccount);

  if (!sourceFarmBalance) {
    throw new Error("Distribution account does not hold FARM");
  }

  if (compareIntegers(toStroops(sourceFarmBalance.balance), toStroops(amount)) < 0) {
    throw new Error("Distribution account does not have enough FARM");
  }

  const operation =
    settlementMode === "payment"
      ? Operation.payment({
          destination,
          asset: farmAsset,
          amount,
        })
      : Operation.createClaimableBalance({
          asset: farmAsset,
          amount,
          claimants: [new Claimant(destination, Claimant.predicateUnconditional())],
        });

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC,
  })
    .addOperation(operation)
    .addMemo(Memo.text(`WD:${withdrawalId}`))
    .setTimeout(60)
    .build();

  const claimableBalanceId =
    settlementMode === "claimable_balance" ? transaction.getClaimableBalanceId(0) : null;

  transaction.sign(distribution);
  const response = await server.submitTransaction(transaction);

  return {
    txHash: response.hash,
    claimableBalanceId,
  };
}
