import axios from "axios";
import type { Transacao } from "../types/Transacao";

const API_URL = "https://localhost:7045/api/Transacao";

export const getAll = async (): Promise<Transacao[]> => 
{
  const response = await axios.get(API_URL);
  return response.data;
};

export const getById = async (id: number): Promise<Transacao> => 
{
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const create = async (transacao: Omit<Transacao, "id" | "categoria" | "pessoa">): Promise<Transacao> => 
{
  const response = await axios.post(API_URL, transacao);
  return response.data;
};

export const update = async (id: number, transacao: Omit<Transacao, "id" | "categoria" | "pessoa">): Promise<Transacao> =>
{
  const response = await axios.put(`${API_URL}/${id}`, transacao);
  return response.data;
};

export const remove = async (id: number): Promise<void> => 
{
  await axios.delete(`${API_URL}/${id}`);
};