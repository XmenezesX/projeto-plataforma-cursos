import { request } from "./api";
import type { Trilha } from "../model/Trilha";
import type { TrilhaDto } from "../dto/TrilhaDto";
import { CategoriaService } from "./CategoriaService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class TrilhaService {
  static async getAll(): Promise<TrilhaDto[]> {
    const [trilhas, categorias] = await Promise.all([
      request<Trilha[]>("/trilhas"),
      CategoriaService.getAll()
    ]);
    return trilhas.map(t => ({
      ...t,
      CategoriaNome: categorias.find(c => c.ID_Categoria === t.ID_Categoria)?.Nome || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<Trilha> {
    return request<Trilha>(`/trilhas/${id}`);
  }

  static async create(trilha: Omit<Trilha, "id" | "ID_Trilha">): Promise<Trilha> {
    TrilhaService.validate(trilha);
    const res = await request<Trilha>("/trilhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trilha),
    });
    return request<Trilha>(`/trilhas/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Trilha: res.id
      }),
    });
  }

  static async update(id: string, trilha: Partial<Trilha>): Promise<Trilha> {
    TrilhaService.validate(trilha);
    return request<Trilha>(`/trilhas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trilha),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/trilhas/${id}`, {
      method: "DELETE",
    });
  }

  static validate(trilha: Partial<Trilha>): void {
    if (StringIsNullOrWhiteSpace(trilha.Titulo)) {
      throw new Error("O título da trilha é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(trilha.ID_Categoria)) {
      throw new Error("O ID da categoria é inválido.");
    }
  }
}
