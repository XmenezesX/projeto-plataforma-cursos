import { request } from "./api";
import type { Modulo } from "../model/Modulo";
import type { ModuloDto } from "../dto/ModuloDto";
import { CursoService } from "./CursoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class ModuloService {
  static async getAll(): Promise<ModuloDto[]> {
    const [modulos, cursos] = await Promise.all([
      request<Modulo[]>("/modulos"),
      CursoService.getAll()
    ]);
    return modulos.map(m => ({
      ...m,
      CursoTitulo: cursos.find(c => c.ID_Curso === m.ID_Curso)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<Modulo> {
    return request<Modulo>(`/modulos/${id}`);
  }

  static async create(modulo: Omit<Modulo, "id" | "ID_Modulo">): Promise<Modulo> {
    ModuloService.validate(modulo);
    const res = await request<Modulo>("/modulos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modulo),
    });
    return request<Modulo>(`/modulos/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Modulo: res.id
      }),
    });
  }

  static async update(id: string, modulo: Partial<Modulo>): Promise<Modulo> {
    ModuloService.validate(modulo);
    return request<Modulo>(`/modulos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modulo),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/modulos/${id}`, {
      method: "DELETE",
    });
  }

  static validate(modulo: Partial<Modulo>): void {
    if (StringIsNullOrWhiteSpace(modulo.Titulo)) {
      throw new Error("O título do módulo é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(modulo.ID_Curso)) {
      throw new Error("O ID do curso é inválido.");
    }
    if (modulo.Ordem !== undefined && modulo.Ordem <= 0) {
      throw new Error("O campo Ordem deve ser um número positivo.");
    }
  }
}
