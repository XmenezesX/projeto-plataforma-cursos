import { request } from "./api";
import type { Assinatura } from "../model/Assinatura";
import type { AssinaturaDto } from "../dto/AssinaturaDto";
import { UsuarioService } from "./UsuarioService";
import { PlanoService } from "./PlanoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class AssinaturaService {
  static async getAll(): Promise<AssinaturaDto[]> {
    const [assinaturas, usuarios, planos] = await Promise.all([
      request<Assinatura[]>("/assinaturas"),
      UsuarioService.getAll(),
      PlanoService.getAll()
    ]);

    return assinaturas.map(a => ({
      ...a,
      UsuarioNome: usuarios.find(u => u.ID_Usuario === a.ID_Usuario)?.NomeCompleto || "N/A",
      PlanoNome: planos.find(p => p.ID_Plano === a.ID_Plano)?.Nome || "N/A"
    }));
  }

  static async getById(id: string): Promise<Assinatura> {
    return request<Assinatura>(`/assinaturas/${id}`);
  }

  static async create(assinatura: Omit<Assinatura, "id" | "ID_Assinatura">): Promise<Assinatura> {
    AssinaturaService.validate(assinatura);
    const res = await request<Assinatura>("/assinaturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assinatura),
    });
    return request<Assinatura>(`/assinaturas/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Assinatura: res.id
      }),
    });
  }

  static async update(id: string, assinatura: Partial<Assinatura>): Promise<Assinatura> {
    AssinaturaService.validate(assinatura);
    return request<Assinatura>(`/assinaturas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assinatura),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/assinaturas/${id}`, {
      method: "DELETE",

    });
  }

  static validate(assinatura: Partial<Assinatura>): void {
    if (StringIsNullOrWhiteSpace(assinatura.ID_Usuario)) {
      throw new Error("O ID do usuário é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(assinatura.ID_Plano)) {
      throw new Error("O ID do plano é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(assinatura.DataInicio)) {
      throw new Error("A data de início da assinatura é obrigatória.");
    }
    if (StringIsNullOrWhiteSpace(assinatura.DataFim)) {
      throw new Error("A data de término da assinatura é obrigatória.");
    }
  }
}
