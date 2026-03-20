import { useEffect, useState } from "react";
import * as categoriaService from "../services/categoriaService";

// Interface espelho do ResumoGeralCategoriaDto do C#
interface CategoriaTotais {
  id: number;
  descricao: string;
  finalidade: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

interface ResumoGeralCategoria {
  categorias: CategoriaTotais[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

export default function TotaisCategoriaPage() {
  const [resumo, setResumo] = useState<ResumoGeralCategoria | null>(null);

  useEffect(() => {
    carregarTotais();
  }, []);

  async function carregarTotais() {
    const dados = await categoriaService.getTotais();
    setResumo(dados);
  }

  function corSaldo(saldo: number) {
    return saldo >= 0 ? "green" : "red";
  }

  if (!resumo) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1>Totais por Categoria</h1>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Finalidade</th>
            <th>Total Receitas</th>
            <th>Total Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {resumo.categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.descricao}</td>
              <td>{c.finalidade}</td>
              <td style={{ color: "green" }}>R$ {c.totalReceitas.toFixed(2)}</td>
              <td style={{ color: "red" }}>R$ {c.totalDespesas.toFixed(2)}</td>
              <td style={{ color: corSaldo(c.saldo), fontWeight: "bold" }}>
                R$ {c.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

        {/* Linha de totais gerais no rodapé da tabela */}
        <tfoot>
          <tr style={{ background: "#4a90d9", color: "white", fontWeight: "bold" }}>
            <td colSpan={2}>TOTAL GERAL</td>
            <td>R$ {resumo.totalGeralReceitas.toFixed(2)}</td>
            <td>R$ {resumo.totalGeralDespesas.toFixed(2)}</td>
            <td>R$ {resumo.saldoLiquido.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}