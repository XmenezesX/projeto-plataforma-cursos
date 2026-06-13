import { request } from "./api";
import type { Matricula } from "../model/Matricula";
import type { MatriculaDto } from "../dto/MatriculaDto";
import { UsuarioService } from "./UsuarioService";
import { CursoService } from "./CursoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class MatriculaService {
  static async getAll(): Promise<MatriculaDto[]> {
    const [matriculas, usuarios, cursos] = await Promise.all([
      request<Matricula[]>("/matriculas"),
      UsuarioService.getAll(),
      CursoService.getAll()
    ]);
    return matriculas.map(m => ({
      ...m,
      UsuarioNome: usuarios.find(u => u.ID_Usuario === m.ID_Usuario)?.NomeCompleto || "Não encontrado",
      CursoTitulo: cursos.find(c => c.ID_Curso === m.ID_Curso)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<Matricula> {
    return request<Matricula>(`/matriculas/${id}`);
  }

  static async create(matricula: Omit<Matricula, "id" | "ID_Matricula">): Promise<Matricula> {
    MatriculaService.validate(matricula);
    const res = await request<Matricula>("/matriculas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matricula),
    });
    return request<Matricula>(`/matriculas/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Matricula: res.id
      }),
    });
  }

  static async update(id: string, matricula: Partial<Matricula>): Promise<Matricula> {
    MatriculaService.validate(matricula);
    return request<Matricula>(`/matriculas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matricula),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/matriculas/${id}`, {
      method: "DELETE",
    });
  }

  static validate(matricula: Partial<Matricula>): void {
    if (StringIsNullOrWhiteSpace(matricula.ID_Usuario)) {
      throw new Error("O ID do usuário é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(matricula.ID_Curso)) {
      throw new Error("O ID do curso é obrigatório.");
    }
  }
}
