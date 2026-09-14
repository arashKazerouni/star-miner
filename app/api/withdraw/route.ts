import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  assertDestinationCanReceiveFarm,
  submitFarmWithdrawal,
} from "@/lib/stellar/farm-withdrawal";

const STELLAR_PUBLIC_KEY = /^G[A-Z2-7]{55}$/;

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to process withdrawal";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!process.env.STELLAR_DISTRIBUTION_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { error: "Withdrawals are temporarily unavailable" },
      { status: 503 },
    );
  }

  let walletAddress = "";
  try {
    const body = await request.json();
    walletAddress = String(body?.walletAddress ?? "").trim().toUpperCase();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!STELLAR_PUBLIC_KEY.test(walletAddress)) {
    return NextResponse.json(
      { error: "Enter a valid Stellar public wallet address" },
      { status: 400 },
    );
  }

  let withdrawalId: number | null = null;

  try {
    await assertDestinationCanReceiveFarm(walletAddress, "0.0000001");

    const { data: requested, error: requestError } = await supabase.rpc(
      "request_withdrawal",
      { wallet_address_input: walletAddress },
    );

    if (requestError || !requested) {
      throw new Error(requestError?.message ?? "Unable to create withdrawal request");
    }

    const withdrawal = Array.isArray(requested) ? requested[0] : requested;
    withdrawalId = Number(withdrawal.id);

    const { data: processing, error: processingError } = await supabase.rpc(
      "mark_withdrawal_processing",
      { withdrawal_id_input: withdrawalId },
    );

    if (processingError || !processing) {
      throw new Error(processingError?.message ?? "Unable to start withdrawal processing");
    }

    const processingWithdrawal = Array.isArray(processing)
      ? processing[0]
      : processing;

    const txHash = await submitFarmWithdrawal({
      withdrawalId,
      destination: processingWithdrawal.wallet_address,
      amount: String(processingWithdrawal.amount),
    });

    const { data: completed, error: completeError } = await supabase.rpc(
      "complete_withdrawal",
      {
        withdrawal_id_input: withdrawalId,
        tx_hash_input: txHash,
      },
    );

    if (completeError || !completed) {
      throw new Error(completeError?.message ?? "Payment submitted but status could not be finalized");
    }

    const result = Array.isArray(completed) ? completed[0] : completed;
    return NextResponse.json({
      success: true,
      withdrawal: result,
      txHash,
    });
  } catch (error) {
    if (withdrawalId) {
      try {
        const { findExistingWithdrawalTransaction } = await import(
          "@/lib/stellar/farm-withdrawal"
        );
        const existingHash = await findExistingWithdrawalTransaction(withdrawalId);

        if (existingHash) {
          const { data: completed } = await supabase.rpc("complete_withdrawal", {
            withdrawal_id_input: withdrawalId,
            tx_hash_input: existingHash,
          });

          if (completed) {
            const result = Array.isArray(completed) ? completed[0] : completed;
            return NextResponse.json({
              success: true,
              withdrawal: result,
              txHash: existingHash,
            });
          }
        }

        await supabase.rpc("fail_withdrawal", {
          withdrawal_id_input: withdrawalId,
          error_message_input: errorMessage(error),
        });
      } catch {
        // Leave the withdrawal in processing if reconciliation itself fails.
        // A later request can safely reconcile by the WD:<id> transaction memo.
      }
    }

    const message = errorMessage(error);
    const status = /temporarily|configuration|secret/i.test(message) ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
