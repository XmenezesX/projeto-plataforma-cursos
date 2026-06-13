import { request } from "./api";
import type { Plano } from "../model/Plano";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class PlanoService {
  static async getAll(): Promise<Plano[]> {
    return request<Plano[]>("/planos");
  }

  static async getById(id: string): Promise<Plano> {
    return request<Plano>(`/planos/${id}`);
  }

  static async create(plano: Omit<Plano, "id" | "ID_Plano">): Promise<Plano> {
    PlanoService.validate(plano);
    const res = await request<Plano>("/planos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plano),
    });
    return request<Plano>(`/planos/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Plano: res.id
      }),
    });
  }

  static async update(id: string, plano: Partial<Plano>): Promise<Plano> {
    PlanoService.validate(plano);
    return request<Plano>(`/planos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plano),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/planos/${id}`, {
      method: "DELETE",
    });
  }

  static validate(plano: Partial<Plano>): void {
    if (StringIsNullOrWhiteSpace(plano.Nome)) {
      throw new Error("O nome do plano é obrigatório.");
    }
    if (plano.Preco === undefined || plano.Preco < 0) {
      throw new Error("O preço do plano não pode ser negativo.");
    }
    if (plano.DuracaoMeses === undefined || plano.DuracaoMeses <= 0) {
      throw new Error("A duração do plano em meses deve ser maior que zero.");
    }
  }
}
