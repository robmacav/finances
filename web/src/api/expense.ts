import type { Expense } from '../../types/Expense';

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch('https://finances-atwj.onrender.com/v1/expenses');

  console.log("Iniciando...");

  if (!response.ok) {
    console.log("deu ruim");

    throw new Error('Erro ao buscar despesas');
  }

  return await response.json();
}
