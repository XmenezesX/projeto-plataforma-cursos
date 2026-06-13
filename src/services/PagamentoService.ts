import { request } from "./api";
import type { Pagamento } from "../model/Pagamento";
import type { PagamentoDto } from "../dto/PagamentoDto";
import { AssinaturaService } from "./AssinaturaService";
import { UsuarioService } from "./UsuarioService";
import { PlanoService } from "./PlanoService";
import { StringIsNullOrWhiteSpace } from "../utils/string-utils";

export class PagamentoService {
  static async getAll(): Promise<PagamentoDto[]> {
    const [pagamentos, assinaturas, usuarios, planos] = await Promise.all([
      request<Pagamento[]>("/pagamentos"),
      AssinaturaService.getAll(),
      UsuarioService.getAll(),
      PlanoService.getAll()
    ]);
    return pagamentos.map(p => {
      const assinatura = assinaturas.find(a => a.ID_Assinatura === p.ID_Assinatura);
      let usuarioNome: string | undefined;
      let planoNome: string | undefined;
      if (assinatura) {
        usuarioNome = usuarios.find(u => u.ID_Usuario === assinatura.ID_Usuario)?.NomeCompleto;
        planoNome = planos.find(pl => pl.ID_Plano === assinatura.ID_Plano)?.Nome;
      }
      return {
        ...p,
        UsuarioNome: usuarioNome || (assinatura ? assinatura.ID_Usuario : p.ID_Assinatura),
        PlanoNome: planoNome || (assinatura ? assinatura.ID_Plano : p.ID_Assinatura)
      };
    });
  }

  static async getById(id: string): Promise<Pagamento> {
    return request<Pagamento>(`/pagamentos/${id}`);
  }

  static async create(pagamento: Omit<Pagamento, "id" | "ID_Pagamento">): Promise<Pagamento> {
    PagamentoService.validate(pagamento);
    const res = await request<Pagamento>("/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagamento),
    });
    return request<Pagamento>(`/pagamentos/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Pagamento: res.id
      }),
    });
  }

  static async update(id: string, pagamento: Partial<Pagamento>): Promise<Pagamento> {
    PagamentoService.validate(pagamento);
    return request<Pagamento>(`/pagamentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagamento),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/pagamentos/${id}`, {
      method: "DELETE",
    });
  }

  static validate(pagamento: Partial<Pagamento>): void {
    if (StringIsNullOrWhiteSpace(pagamento.ID_Assinatura)) {
      throw new Error("O ID da assinatura é obrigatório.");
    }
    if (pagamento.ValorPago === undefined || pagamento.ValorPago <= 0) {
      throw new Error("O valor pago deve ser maior que zero.");
    }
    if (StringIsNullOrWhiteSpace(pagamento.DataPagamento)) {
      throw new Error("A data de pagamento é obrigatória.");
    }
    if (StringIsNullOrWhiteSpace(pagamento.MetodoPagamento)) {
      throw new Error("O método de pagamento é obrigatório.");
    }
    if (StringIsNullOrWhiteSpace(pagamento.Id_Transacao_Gateway)) {
      throw new Error("O ID da transação no gateway é obrigatório.");
    }
  }
}
