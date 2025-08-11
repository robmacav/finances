import { apiUrl } from "@/lib/api";

export type FormDataResponse = {
  kind: {
    id: number;
    summary: string;
    value: string;
  }[];
  statuses: {
    id: number;
    summary: string;
  }[];
  categories: {
    id: number;
    summary: string;
    color: string;
  }[];
};

export async function formDataFetch(): Promise<FormDataResponse> {
  const response = await fetch(`${apiUrl}/utils/transactions/form-data`);

  if (!response.ok) {
    throw new Error("Erro ao buscar dados do formulário.");
  }

  const data = (await response.json()) as FormDataResponse;

  return data;
}


