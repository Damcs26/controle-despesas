import { useEffect, useState } from "react";
import * as pessoaService from "../services/pessoaService";

interface PessoaTotais 
{
  id: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

interface ResumoGeral 
{
  pessoas: PessoaTotais[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

export default function TotaisPessoaPage() 
{
  const [resumo, setResumo] = useState<ResumoGeral | null>(null);

  useEffect(() => 
    {
    carregarTotais();
  }, []);

  async function carregarTotais() 
  {
    const dados = await pessoaService.getTotais();
    setResumo(dados);
  }

  function corSaldo(saldo: number) 
  {
    return saldo >= 0 ? "green" : "red";
  }

  if (!resumo) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1>Totais por Pessoa</h1>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Total Receitas</th>
            <th>Total Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {resumo.pessoas.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td style={{ color: "green" }}>R$ {p.totalReceitas.toFixed(2)}</td>
              <td style={{ color: "red" }}>R$ {p.totalDespesas.toFixed(2)}</td>
              <td style={{ color: corSaldo(p.saldo), fontWeight: "bold" }}>
                R$ {p.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr style={{ background: "#4a90d9", color: "white", fontWeight: "bold" }}>
            <td>TOTAL GERAL</td>
            <td>R$ {resumo.totalGeralReceitas.toFixed(2)}</td>
            <td>R$ {resumo.totalGeralDespesas.toFixed(2)}</td>
            <td>R$ {resumo.saldoLiquido.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}