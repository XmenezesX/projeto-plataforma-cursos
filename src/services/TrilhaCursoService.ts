import { request } from "./api";
import type { TrilhaCurso } from "../model/TrilhaCurso";
import type { TrilhaCursoDto } from "../dto/TrilhaCursoDto";
import { TrilhaService } from "./TrilhaService";
import { CursoService } from "./CursoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class TrilhaCursoService {
  static async getAll(): Promise<TrilhaCursoDto[]> {
    const [trilhasCursos, trilhas, cursos] = await Promise.all([
      request<TrilhaCurso[]>("/trilhas_cursos"),
      TrilhaService.getAll(),
      CursoService.getAll()
    ]);
    return trilhasCursos.map(tc => ({
      ...tc,
      TrilhaTitulo: trilhas.find(t => t.ID_Trilha === tc.ID_Trilha)?.Titulo || "Não encontrado",
      CursoTitulo: cursos.find(c => c.ID_Curso === tc.ID_Curso)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<TrilhaCurso> {
    return request<TrilhaCurso>(`/trilhas_cursos/${id}`);
  }

  static async create(trilhaCurso: Omit<TrilhaCurso, "id">): Promise<TrilhaCurso> {
    TrilhaCursoService.validate(trilhaCurso);
    return request<TrilhaCurso>("/trilhas_cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trilhaCurso),
    });
  }

  static async update(id: string, trilhaCurso: Partial<TrilhaCurso>): Promise<TrilhaCurso> {
    TrilhaCursoService.validate(trilhaCurso);
    return request<TrilhaCurso>(`/trilhas_cursos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trilhaCurso),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/trilhas_cursos/${id}`, {
      method: "DELETE",
    });
  }

  static validate(trilhaCurso: Partial<TrilhaCurso>): void {
    if (StringIsNullOrWhiteSpace(trilhaCurso.ID_Trilha)) {
      throw new Error("O ID da trilha é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(trilhaCurso.ID_Curso)) {
      throw new Error("O ID do curso é obrigatório.");
    }
    if (trilhaCurso.Ordem === undefined || trilhaCurso.Ordem <= 0) {
      throw new Error("O campo Ordem deve ser maior que zero.");
    }
  }
}
