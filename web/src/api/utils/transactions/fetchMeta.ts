import { apiUrl } from "@/lib/api";

export async function fetchMeta() {
  const response = await fetch(
    `${apiUrl}/utils/transactions/meta`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar dados de receitas e despesas');
  }

  const data = await response.json();

  return data;
}
