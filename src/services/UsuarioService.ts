import { request } from "./api";
import type { Usuario } from "../model/Usuario";
import { StringIsNullOrWhiteSpace, StringToBase64 } from "../utils/string-utils";

export class UsuarioService {
  static async getAll(): Promise<Usuario[]> {
    return request<Usuario[]>("/usuarios");
  }

  static async getById(id: string): Promise<Usuario> {
    return request<Usuario>(`/usuarios/${id}`);
  }

  static async create(usuario: Omit<Usuario, "id" | "ID_Usuario">): Promise<Usuario> {
    UsuarioService.validate(usuario);
    usuario.SenhaHash = StringToBase64(usuario.SenhaHash);
    const res = await request<Usuario>("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    return request<Usuario>(`/usuarios/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...res,
        ID_Usuario: res.id
      }),
    });
  }

  static async update(id: string, usuario: Partial<Usuario>): Promise<Usuario> {
    UsuarioService.validate(usuario);
    return request<Usuario>(`/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
  }

  static async delete(id: string): Promise<void> {
    return request<void>(`/usuarios/${id}`, {
      method: "DELETE",
    });
  }

  static validate(usuario: Partial<Usuario>): void {
    if (StringIsNullOrWhiteSpace(usuario.NomeCompleto) || usuario.NomeCompleto!.trim().length < 3) {
      throw new Error("O nome completo deve conter pelo menos 3 caracteres.");
    }
    if (StringIsNullOrWhiteSpace(usuario.Email) || !usuario.Email!.includes("@")) {
      throw new Error("O e-mail fornecido é inválido.");
    }
    if (StringIsNullOrWhiteSpace(usuario.SenhaHash) || usuario.SenhaHash!.trim().length < 6) {
      throw new Error("A senha deve conter pelo menos 6 caracteres.");
    }
  }
}
