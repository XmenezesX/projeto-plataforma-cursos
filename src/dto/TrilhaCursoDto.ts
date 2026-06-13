import type { TrilhaCurso } from "../model/TrilhaCurso";

export interface TrilhaCursoDto extends TrilhaCurso {
  TrilhaTitulo: string;
  CursoTitulo: string;
}
