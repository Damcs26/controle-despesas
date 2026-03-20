import axios from "axios";
import type { Categoria } from "../types/Categoria";

const API_URL = "https://localhost:7045/api/Categoria";

// GET- Busca todas as categorias
export const getAll = async (): Promise<Categoria[]> => 
{
  const response = await axios.get(API_URL);
  return response.data;
};

// GET- Busca uma categoria pelo id
export const getById = async (id: number): Promise<Categoria> => 
{
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Adicionar nova categoria
export const create = async (categoria: Omit<Categoria, "id">): Promise<Categoria> => 
{
  const response = await axios.post(API_URL, categoria);
  return response.data;
};

// Editar uma categoria existente
export const update = async (id: number, categoria: Omit<Categoria, "id">): Promise<Categoria> => 
{
  const response = await axios.put(`${API_URL}/${id}`, categoria);
  return response.data;
};

// Busca os totais de receitas, despesas e saldo por categoria
export const getTotais = async (): Promise<any> => 
{
  const response = await axios.get(`${API_URL}/totais`);
  return response.data;
};

// Excluir uma categoria por id
export const remove = async (id: number): Promise<void> => 
{
  await axios.delete(`${API_URL}/${id}`);
};