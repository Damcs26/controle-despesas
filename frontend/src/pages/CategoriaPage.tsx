import { useEffect, useState } from "react";
import type { Categoria, FinalidadeCategoria } from "../types/Categoria";
import * as categoriaService from "../services/categoriaService";

export default function CategoriaPage() {
  // Listagem das categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Controladores dos campos
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>("Despesa");

  // Guardando o id da categoria
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Mensagem de erro ou sucesso para o usuário
  const [mensagem, setMensagem] = useState("");

  // Carrega as categorias assim que a pagina abre
  useEffect(() => 
  {
    carregarCategorias();
  }, []);

  async function carregarCategorias() 
  {
    const dados = await categoriaService.getAll();
    setCategorias(dados);
  }

  async function handleSubmit() 
  {
    if (!descricao.trim()) 
    {
      setMensagem("Preencha a descrição.");
      return;
    }

    try {
      if (editandoId !== null) 
      {
        // Verifca se tem id, se sim, edita
        await categoriaService.update(editandoId, { descricao, finalidade });
        setMensagem("Categoria atualizada com sucesso!");
      } else {
        // Se não tem id, cria um novo
        await categoriaService.create({ descricao, finalidade });
        setMensagem("Categoria cadastrada com sucesso!");
      }

      // Limpa e recarrega a lista
      limparFormulario();
      carregarCategorias();
    } 
      catch (error: any) 
    {
      setMensagem(error.response?.data || "Erro ao salvar categoria.");
    }
  }

  async function handleDeletar(id: number) 
  {
    if (!confirm("Deseja deletar esta categoria?")) return;

    try 
    {
      await categoriaService.remove(id);
      setMensagem("Categoria deletada com sucesso!");
      carregarCategorias();
    } 
    catch 
    {
      setMensagem("Erro ao deletar categoria.");
    }
  }

  function handleEditar(categoria: Categoria) 
  {
    // Preenche o formulário com os dados da categoria selecionada
    setEditandoId(categoria.id);
    setDescricao(categoria.descricao);
    setFinalidade(categoria.finalidade);
    setMensagem("");
  }

  function limparFormulario() 
  {
    setEditandoId(null);
    setDescricao("");
    setFinalidade("Despesa");
    setMensagem("");
  }
//Html
  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <h1>Categorias</h1>

      <div style={{ background: "white", padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: "0 1px 4px #ccc" }}>
        <h2>{editandoId ? "Editar Categoria" : "Nova Categoria"}</h2>

        <div style={{ marginBottom: 12 }}>
          <label>Descrição</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Alimentação"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Finalidade</label>
          <select
            value={finalidade}
            onChange={(e) => setFinalidade(e.target.value as FinalidadeCategoria)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas</option>
          </select>
        </div>

        {mensagem && (
          <p style={{ marginBottom: 12, color: mensagem.includes("sucesso") ? "green" : "red" }}>
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
            <th>Finalidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.descricao}</td>
              <td>{cat.finalidade}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEditar(cat)}
                  style={{ background: "#f0a500", color: "white" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(cat.id)}
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