import type { Matricula } from "../model/Matricula";

export interface MatriculaDto extends Matricula {
  UsuarioNome: string;
  CursoTitulo: string;
}
