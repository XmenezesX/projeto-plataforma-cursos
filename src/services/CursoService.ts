import { request } from "./api";
import type { Curso } from "../model/Curso";
import type { CursoDto } from "../dto/CursoDto";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";
import { CategoriaService } from "./CategoriaService";
import { UsuarioService } from "./UsuarioService";

export class CursoService {
  static async getAll(): Promise<CursoDto[]> {
    const [cursos, usuarios, categorias] = await Promise.all([
      request<Curso[]>("/cursos"),
      UsuarioService.getAll(),
      CategoriaService.getAll()
    ]);

    return cursos.map(c => ({
      ...c,
      InstrutorNome: usuarios.find(u => u.ID_Usuario === c.ID_Instrutor)?.NomeCompleto || "N/A",
      CategoriaNome: categorias.find(cat => cat.ID_Categoria === c.ID_Categoria)?.Nome || "Nao encontrado"
    }));
  }

  static async getById(id: string): Promise<Curso> {
    return request<Curso>(`/cursos/${id}`);
  }

  static async create(curso: Omit<Curso, "id" | "ID_Curso">): Promise<Curso> {
    CursoService.validate(curso);
    const res = await request<Curso>("/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso),
    });
    return request<Curso>(`/cursos/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Curso: res.id
      }),
    });
  }

  static async update(id: string, curso: Partial<Curso>): Promise<Curso> {
    CursoService.validate(curso);
    return request<Curso>(`/cursos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/cursos/${id}`, {
      method: "DELETE",
    });
  }

  static validate(curso: Partial<Curso>): void {
    if (StringIsNullOrWhiteSpace(curso.Titulo)) {
      throw new Error("O título do curso é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(curso.ID_Instrutor)) {
      throw new Error("O ID do instrutor é inválido.");
    }
    if (StringIsNullOrWhiteSpace(curso.ID_Categoria)) {
      throw new Error("O ID da categoria é inválido.");
    }
    if (curso.TotalHoras !== undefined && curso.TotalHoras < 0) {
      throw new Error("O total de horas do curso não pode ser negativo.");
    }
  }
}
