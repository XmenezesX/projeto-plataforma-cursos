import type { ProgressoAula } from "../model/ProgressoAula";

export interface ProgressoAulaDto extends ProgressoAula {
  UsuarioNome: string;
  AulaTitulo: string;
}
