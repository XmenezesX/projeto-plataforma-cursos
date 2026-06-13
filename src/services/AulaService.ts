import { request } from "./api";
import type { Aula } from "../model/Aula";
import type { AulaDto } from "../dto/AulaDto";
import { ModuloService } from "./ModuloService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class AulaService {
  static async getAll(): Promise<AulaDto[]> {
    const [aulas, modulos] = await Promise.all([
      request<Aula[]>("/aulas"),
      ModuloService.getAll()
    ]);

    return aulas.map(a => ({
      ...a,
      ModuloTitulo: modulos.find(m => m.ID_Modulo === a.ID_Modulo)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<Aula> {
    return request<Aula>(`/aulas/${id}`);
  }

  static async create(aula: Omit<Aula, "id" | "ID_Aula">): Promise<Aula> {
    AulaService.validate(aula);
    const res = await request<Aula>("/aulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
    return request<Aula>(`/aulas/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Aula: res.id
      }),
    });
  }

  static async update(id: string, aula: Partial<Aula>): Promise<Aula> {
    AulaService.validate(aula);
    return request<Aula>(`/aulas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/aulas/${id}`, {
      method: "DELETE",
    });
  }

  static validate(aula: Partial<Aula>): void {
    if (StringIsNullOrWhiteSpace(aula.Titulo)) {
      throw new Error("O título da aula é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(aula.ID_Modulo)) {
      throw new Error("O ID do módulo é inválido.");
    }
    if (aula.DuracaoMinutos !== undefined && aula.DuracaoMinutos <= 0) {
      throw new Error("A duração da aula deve ser maior que zero.");
    }
  }
}
