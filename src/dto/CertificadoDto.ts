import type { Certificado } from "../model/Certificado";

export interface CertificadoDto extends Certificado {
  UsuarioNome: string;
  CursoTitulo: string;
  TrilhaTitulo?: string;
}
