import { request } from "./api";
import type { Avaliacao } from "../model/Avaliacao";
import type { AvaliacaoDto } from "../dto/AvaliacaoDto";
import { UsuarioService } from "./UsuarioService";
import { CursoService } from "./CursoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class AvaliacaoService {
  static async getAll(): Promise<AvaliacaoDto[]> {
    const [avaliacoes, usuarios, cursos] = await Promise.all([
      request<Avaliacao[]>("/avaliacoes"),
      UsuarioService.getAll(),
      CursoService.getAll()
    ]);
    return avaliacoes.map(a => ({
      ...a,
      UsuarioNome: usuarios.find(u => u.ID_Usuario === a.ID_Usuario)?.NomeCompleto || "Não encontrado",
      CursoTitulo: cursos.find(c => c.ID_Curso === a.ID_Curso)?.Titulo || "Não encontrado"
    }));
  }

  static async getById(id: string): Promise<Avaliacao> {
    return request<Avaliacao>(`/avaliacoes/${id}`);
  }

  static async create(avaliacao: Omit<Avaliacao, "id" | "ID_Avaliacao">): Promise<Avaliacao> {
    AvaliacaoService.validate(avaliacao);
    const res = await request<Avaliacao>("/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avaliacao),
    });
    return request<Avaliacao>(`/avaliacoes/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Avaliacao: res.id
      }),
    });
  }

  static async update(id: string, avaliacao: Partial<Avaliacao>): Promise<Avaliacao> {
    AvaliacaoService.validate(avaliacao);
    return request<Avaliacao>(`/avaliacoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avaliacao),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/avaliacoes/${id}`, {
      method: "DELETE",
    });
  }

  static validate(avaliacao: Partial<Avaliacao>): void {
    if (StringIsNullOrWhiteSpace(avaliacao.ID_Usuario)) {
      throw new Error("O ID do usuário é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(avaliacao.ID_Curso)) {
      throw new Error("O ID do curso é obrigatório.");
    }
    if (avaliacao.Nota === undefined || avaliacao.Nota < 1 || avaliacao.Nota > 5) {
      throw new Error("A nota deve ser um valor entre 1 e 5.");
    }
  }
}
