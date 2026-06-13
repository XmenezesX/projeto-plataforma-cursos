import type { Trilha } from "../model/Trilha";

export interface TrilhaDto extends Trilha {
  CategoriaNome: string;
}
