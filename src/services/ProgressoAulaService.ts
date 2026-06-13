import { request } from "./api";
import type { ProgressoAula } from "../model/ProgressoAula";
import type { ProgressoAulaDto } from "../dto/ProgressoAulaDto";
import { UsuarioService } from "./UsuarioService";
import { AulaService } from "./AulaService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class ProgressoAulaService {
  static async getAll(): Promise<ProgressoAulaDto[]> {
    const [progressos, usuarios, aulas] = await Promise.all([
      request<ProgressoAula[]>("/progresso_aulas"),
      UsuarioService.getAll(),
      AulaService.getAll()
    ]);
    return progressos.map(p => ({
      ...p,
      UsuarioNome: usuarios.find(u => u.ID_Usuario === p.ID_Usuario)?.NomeCompleto || "Não encontrado",
      AulaTitulo: aulas.find(a => a.ID_Aula === p.ID_Aula)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<ProgressoAula> {
    return request<ProgressoAula>(`/progresso_aulas/${id}`);
  }

  static async create(progresso: Omit<ProgressoAula, "id">): Promise<ProgressoAula> {
    ProgressoAulaService.validate(progresso);
    return request<ProgressoAula>("/progresso_aulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progresso),
    });
  }

  static async update(id: string, progresso: Partial<ProgressoAula>): Promise<ProgressoAula> {
    ProgressoAulaService.validate(progresso);
    return request<ProgressoAula>(`/progresso_aulas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progresso),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/progresso_aulas/${id}`, {
      method: "DELETE",
    });
  }

  static validate(progresso: Partial<ProgressoAula>): void {
    if (StringIsNullOrWhiteSpace(progresso.ID_Usuario)) {
      throw new Error("O ID do usuário é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(progresso.ID_Aula)) {
      throw new Error("O ID da aula é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(progresso.Status)) {
      throw new Error("O status é obrigatório.");
    }
  }
}
