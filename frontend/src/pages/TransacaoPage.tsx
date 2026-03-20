import { useEffect, useState } from "react";
import type { Transacao, TipoTransacao } from "../types/Transacao";
import type { Categoria } from "../types/Categoria";
import type { Pessoa } from "../types/Pessoa";
import * as transacaoService from "../services/transacaoService";
import * as categoriaService from "../services/categoriaService";
import * as pessoaService from "../services/pessoaService";

export default function TransacaoPage() 
{
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [pessoaId, setPessoaId] = useState<number>(0);

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro">("sucesso");

  useEffect(() => 
  {
    carregarDados();
  }, []);

  async function carregarDados() 
  {
    const [transacoesData, categoriasData, pessoasData] = await Promise.all([
      transacaoService.getAll(),
      categoriaService.getAll(),
      pessoaService.getAll(),
    ]);

    setTransacoes(transacoesData);
    setCategorias(categoriasData);
    setPessoas(pessoasData);
  }

  async function handleSubmit() 
  {
    if (!descricao.trim()) 
    {
      setTipoMensagem("erro");
      setMensagem("Preencha a descrição.");
      return;
    }

    if (!valor || Number(valor) <= 0) 
    {
      setTipoMensagem("erro");
      setMensagem("Informe um valor maior que zero.");
      return;
    }

    if (categoriaId === 0) 
    {
      setTipoMensagem("erro");
      setMensagem("Selecione uma categoria.");
      return;
    }

    if (pessoaId === 0) 
    {
      setTipoMensagem("erro");
      setMensagem("Selecione uma pessoa.");
      return;
    }

    try 
    {
      if (editandoId !== null) 
      {
        // Se tem id, é uma edição
        await transacaoService.update(editandoId, {
          descricao,
          valor: Number(valor),
          tipo,
          categoriaId,
          pessoaId,
        });
        setTipoMensagem("sucesso");
        setMensagem("Transação atualizada com sucesso!");
      } 
      else 
      {
        // Se não tem id, é um cadastro novo
        await transacaoService.create(
        {
          descricao,
          valor: Number(valor),
          tipo,
          categoriaId,
          pessoaId,
        });
        setTipoMensagem("sucesso");
        setMensagem("Transação cadastrada com sucesso!");
      }

      limparFormulario();
      carregarDados();
    } 
    catch (error: any) 
    {
      setTipoMensagem("erro");
      // Exibe a mensagem de erro da API — regras de negócio como menor de idade etc
      setMensagem(error.response?.data || "Erro ao salvar transação.");
    }
  }

  async function handleDeletar(id: number) 
  {
    if (!confirm("Deseja deletar esta transação?")) return;

    try 
    {
      await transacaoService.remove(id);
      setTipoMensagem("sucesso");
      setMensagem("Transação deletada com sucesso!");
      carregarDados();
    } 
    catch 
    {
      setTipoMensagem("erro");
      setMensagem("Erro ao deletar transação.");
    }
  }

  function handleEditar(transacao: Transacao) 
  {
    setEditandoId(transacao.id);
    setDescricao(transacao.descricao);
    setValor(String(transacao.valor));
    setTipo(transacao.tipo);
    setCategoriaId(transacao.categoriaId);
    setPessoaId(transacao.pessoaId);
    setMensagem("");
  }

  function limparFormulario() 
  {
    setEditandoId(null);
    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setCategoriaId(0);
    setPessoaId(0);
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1>Transações</h1>

      <div style={{ background: "white", padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: "0 1px 4px #ccc" }}>
        <h2>{editandoId ? "Editar Transação" : "Nova Transação"}</h2>

        <div style={{ marginBottom: 12 }}>
          <label>Descrição</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Almoço"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Valor</label>
          <input
            type="number"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 35.50"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoTransacao)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
          >
            <option value={0}>Selecione...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.descricao} ({cat.finalidade})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Pessoa</label>
          <select
            value={pessoaId}
            onChange={(e) => setPessoaId(Number(e.target.value))}
          >
            <option value={0}>Selecione...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {mensagem && (
          <p style={{ marginBottom: 12, color: tipoMensagem === "sucesso" ? "green" : "red" }}>
            {mensagem}
          </p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmit}
            style={{ background: "#4a90d9", color: "white" }}
          >
            {editandoId ? "Salvar Edição" : "Cadastrar"}
          </button>

          {editandoId && (
            <button onClick={limparFormulario} style={{ background: "#aaa", color: "white" }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Pessoa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.descricao}</td>
              <td>R$ {t.valor.toFixed(2)}</td>
              <td>{t.tipo}</td>
              <td>{t.categoria?.descricao}</td>
              <td>{t.pessoa?.nome}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEditar(t)}
                  style={{ background: "#f0a500", color: "white" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(t.id)}
                  style={{ background: "#e74c3c", color: "white" }}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}