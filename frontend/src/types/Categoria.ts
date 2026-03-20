// Referencia ao .net
export type FinalidadeCategoria = "Despesa" | "Receita" | "Ambas";

export interface Categoria 
{
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
}