import axios from "axios";
import type { Pessoa } from "../types/Pessoa";

const API_URL = "https://localhost:7045/api/Pessoa";

export const getAll = async (): Promise<Pessoa[]> => 
{
  const response = await axios.get(API_URL);
  return response.data;
};

export const getById = async (id: number): Promise<Pessoa> => 
{
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const create = async (pessoa: Omit<Pessoa, "id" | "aviso">): Promise<Pessoa> => 
{
  const response = await axios.post(API_URL, pessoa);
  return response.data;
};

export const update = async (id: number, pessoa: Omit<Pessoa, "id" | "aviso">): Promise<Pessoa> => 
{
  const response = await axios.put(`${API_URL}/${id}`, pessoa);
  return response.data;
};

export const getTotais = async (): Promise<any> => 
{
  const response = await axios.get(`${API_URL}/totais`);
  return response.data;
};

export const remove = async (id: number): Promise<void> => 
{
  await axios.delete(`${API_URL}/${id}`);
};