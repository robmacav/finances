import { apiUrl } from "@/lib/api";

export type CreateTransactionPayload = {
  summary: string;
  value: number;
  date: string;
  category_id: string | FormDataEntryValue | null;
  details?: string | FormDataEntryValue | null;
  kind: string | FormDataEntryValue | null; 
  status_id: string | FormDataEntryValue | null;
  user_id: string;
};

export async function createTransaction(payload: CreateTransactionPayload): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return response;
}

export type CreateMultiplesTransactionsPayload = {
  summary: string;
  value: number;
  date: string;
  category_id: string | null;
  status_id: string;
  user_id: string;
};

export async function createMultipleTransactions(transactions: CreateMultiplesTransactionsPayload[]): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactions })
  });

  return response;
}
