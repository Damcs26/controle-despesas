import { useEffect, useState } from "react";
import type { Pessoa } from "../types/Pessoa";
import * as pessoaService from "../services/pessoaService";

export default function PessoaPage() 
{
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "aviso">("sucesso");

  useEffect(() => 
  {
    carregarPessoas();
  }, []);

  async function carregarPessoas() 
  {
    const dados = await pessoaService.getAll();
    setPessoas(dados);
  }

  async function handleSubmit() 
  {
    if (!nome.trim()) 
      {
      setTipoMensagem("erro");
      setMensagem("Preencha o nome.");
      return;
    }

    if (!dataNascimento) 
    {
      setTipoMensagem("erro");
      setMensagem("Preencha a data de nascimento.");
      return;
    }

    try 
    {
      if (editandoId !== null) 
      {
        await pessoaService.update(editandoId, { nome, dataNascimento });
        setTipoMensagem("sucesso");
        setMensagem("Pessoa atualizada com sucesso!");
      } 
      else 
      {
        const criada = await pessoaService.create({ nome, dataNascimento });

        // Exibe o aviso se a pessoa for menor de 18 anos
        if (criada.aviso) {
          setTipoMensagem("aviso");
          setMensagem(criada.aviso);
        } else {
          setTipoMensagem("sucesso");
          setMensagem("Pessoa cadastrada com sucesso!");
        }
      }

      limparFormulario();
      carregarPessoas();
    } 
    catch (error: any) 
    {
      setTipoMensagem("erro");
      setMensagem(error.response?.data || "Erro ao salvar pessoa.");
    }
  }

  async function handleDeletar(id: number) 
  {
    if (!confirm("Deseja deletar esta pessoa? Todas as transações dela serão apagadas.")) return;

    try 
    {
      await pessoaService.remove(id);
      setTipoMensagem("sucesso");
      setMensagem("Pessoa deletada com sucesso!");
      carregarPessoas();
    } 
    catch 
    {
      setTipoMensagem("erro");
      setMensagem("Erro ao deletar pessoa.");
    }
  }

  function handleEditar(pessoa: Pessoa) 
  {
    setEditandoId(pessoa.id);
    setNome(pessoa.nome);
    setDataNascimento(pessoa.dataNascimento);
    setMensagem("");
  }

  function limparFormulario() 
  {
    setEditandoId(null);
    setNome("");
    setDataNascimento("");
  }

  function corMensagem() 
  {
    if (tipoMensagem === "sucesso") return "green";
    if (tipoMensagem === "aviso") return "orange";
    return "red";
  }

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <h1>Pessoas</h1>

      <div style={{ background: "white", padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: "0 1px 4px #ccc" }}>
        <h2>{editandoId ? "Editar Pessoa" : "Nova Pessoa"}</h2>

        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Silva"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Data de Nascimento</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
        </div>

        {mensagem && (
          <p style={{ marginBottom: 12, color: corMensagem() }}>
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
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.id}</td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.dataNascimento}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEditar(pessoa)}
                  style={{ background: "#f0a500", color: "white" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(pessoa.id)}
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