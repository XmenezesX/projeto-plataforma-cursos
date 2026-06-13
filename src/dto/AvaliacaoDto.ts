import type { Avaliacao } from "../model/Avaliacao";

export interface AvaliacaoDto extends Avaliacao {
  UsuarioNome: string;
  CursoTitulo: string;
}
