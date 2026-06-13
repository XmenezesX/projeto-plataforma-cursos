import { request } from "./api";
import type { Certificado } from "../model/Certificado";
import type { CertificadoDto } from "../dto/CertificadoDto";
import { UsuarioService } from "./UsuarioService";
import { CursoService } from "./CursoService";
import { TrilhaService } from "./TrilhaService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class CertificadoService {
  static async getAll(): Promise<CertificadoDto[]> {
    const [certificados, usuarios, cursos, trilhas] = await Promise.all([
      request<Certificado[]>("/certificados"),
      UsuarioService.getAll(),
      CursoService.getAll(),
      TrilhaService.getAll()
    ]);
    return certificados.map(c => ({
      ...c,
      UsuarioNome: usuarios.find(u => u.ID_Usuario === c.ID_Usuario)?.NomeCompleto || "Não encontrado",
      CursoTitulo: cursos.find(cu => cu.ID_Curso === c.ID_Curso)?.Titulo || "Não encontrado",
      TrilhaTitulo: c.ID_Trilha ? (trilhas.find(t => t.ID_Trilha === c.ID_Trilha)?.Titulo) : undefined
    }));
  }

  static async getById(id: string): Promise<Certificado> {
    return request<Certificado>(`/certificados/${id}`);
  }

  static async create(certificado: Omit<Certificado, "id" | "ID_Certificado">): Promise<Certificado> {
    CertificadoService.validate(certificado);
    const res = await request<Certificado>("/certificados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certificado),
    });
    return request<Certificado>(`/certificados/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Certificado: res.id
      }),
    });
  }

  static async update(id: string, certificado: Partial<Certificado>): Promise<Certificado> {
    CertificadoService.validate(certificado);
    return request<Certificado>(`/certificados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certificado),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/certificados/${id}`, {
      method: "DELETE",
    });
  }

  static validate(certificado: Partial<Certificado>): void {
    if (StringIsNullOrWhiteSpace(certificado.ID_Usuario)) {
      throw new Error("O ID do usuário é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(certificado.ID_Curso)) {
      throw new Error("O ID do curso é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(certificado.CodigoVerificacao)) {
      throw new Error("O código de verificação é obrigatório.");
    }
  }
}
