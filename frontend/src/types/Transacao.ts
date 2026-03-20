import type { Categoria } from "./Categoria";
import type { Pessoa } from "./Pessoa";

export type TipoTransacao = "Despesa" | "Receita";

export interface Transacao 
{
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  categoria?: Categoria; 
  pessoaId: number;
  pessoa?: Pessoa;
}