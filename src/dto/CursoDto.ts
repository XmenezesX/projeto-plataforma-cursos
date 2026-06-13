import type { Curso } from "../model/Curso";

export interface CursoDto extends Curso {
  InstrutorNome: string;
  CategoriaNome: string;
}
