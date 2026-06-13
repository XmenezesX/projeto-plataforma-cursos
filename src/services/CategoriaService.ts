import { request } from "./api";
import type { Categoria } from "../model/Categoria";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class CategoriaService {
  static async getAll(): Promise<Categoria[]> {
    return request<Categoria[]>("/categorias");
  }

  static async getById(id: string): Promise<Categoria> {
    return request<Categoria>(`/categorias/${id}`);
  }

  static async create(categoria: Omit<Categoria, "id" | "ID_Categoria">): Promise<Categoria> {
    CategoriaService.validate(categoria);
    const res = await request<Categoria>("/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    });
    return request<Categoria>(`/categorias/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Categoria: res.id
      }),
    });
  }

  static async update(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    CategoriaService.validate(categoria);
    return request<Categoria>(`/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/categorias/${id}`, {
      method: "DELETE",
    });
  }

  static validate(categoria: Partial<Categoria>): void {
    if (StringIsNullOrWhiteSpace(categoria.Nome)) {
      throw new Error("O nome da categoria é obrigatório.");
    }
  }
}
