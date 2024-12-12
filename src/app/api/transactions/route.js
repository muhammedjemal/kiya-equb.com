import { NextResponse } from "next/server";
import { Transaction } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export async function POST(req) {
  const { incomeOrPayment, reasonOfTransaction, amount, phoneNumber } =
    await req.json();
  if (!incomeOrPayment || !reasonOfTransaction || !amount) {
    return NextResponse.json(
      { error: "Sorry, missing fields" },
      { status: 500 }
    );
  }
  await connectToDb();

  try {
    const newTransaction = new Transaction({
      incomeOrPayment,
      reasonOfTransaction,
      amount,
      phoneNumber,
    });

    await newTransaction.save();
    return NextResponse.json({
      message: "Transaction created",
      transaction: newTransaction,
    });
  } catch (error) {
    return NextResponse.json({ error: "Sorry, err" }, { status: 500 });
  }
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url); // Extract query parameters
  const id = searchParams.get("id"); // Get "id" from query params

  if (!id) {
    return NextResponse.json({ error: "Sorry, missing id" }, { status: 400 });
  }

  await connectToDb();

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Transaction deleted",
      transaction: deletedTransaction,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while deleting the transaction" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------//
export async function GET(req) {
  await connectToDb();

  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Sorry, err occured" }, { status: 500 });
  }
}
