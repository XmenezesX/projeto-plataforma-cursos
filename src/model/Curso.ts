export type NivelCurso = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Curso {
  id: string;
  ID_Curso: string;
  Titulo: string;
  Descricao: string;
  ID_Instrutor: string;
  ID_Categoria: string;
  Nivel: NivelCurso;
  DataPublicacao: string;
  TotalAulas: number;
  TotalHoras: number;
}
