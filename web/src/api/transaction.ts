import { apiUrl } from "@/lib/api";

export type CreateTransactionPayload = {
  summary: string;
  value: number;
  date: Date | null;
  category_id: FormDataEntryValue | null;
  details: FormDataEntryValue | null;
  kind: FormDataEntryValue | null;
  status_id: FormDataEntryValue | null;
  user_id: string;
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": import.meta.env.VITE_API_TOKEN
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
  kind: string | null;
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

export type EditTransactionPayload = {
  id: string | number;
  kind: FormDataEntryValue | null;
  summary: FormDataEntryValue | null;
  value: number;
  date: string;
  category_id: FormDataEntryValue | null;
  details: FormDataEntryValue | null;
  status_id: FormDataEntryValue | null;
  user_id: string;
}

export async function editTransaction(payload: EditTransactionPayload): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions/${payload.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return response;
}

export type EditMultiplesTransactionsPayload = {
  ids: [];
  data: {
    summary: string;
    kind: FormDataEntryValue | null;
    value: number;
    date: Date | null;
    category_id: FormDataEntryValue | null;
    status_id: FormDataEntryValue | null;
    user_id: string;
  }
};

export async function editMultipleTransactions(payload: EditMultiplesTransactionsPayload[]): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions/batch_update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return response;
}

export type DeleteTransactionPayload = {
  id: string;
};

export async function deleteTransaction(payload: DeleteTransactionPayload): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions/${payload.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return response;
}

export type DeleteMultiplesTransactionPayload = {
  ids: [];
};

export async function deleteMultiplesTransactions(payload: DeleteMultiplesTransactionPayload): Promise<Response> {
  const response = await fetch(`${apiUrl}/transactions/batch_destroy`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return response;
}