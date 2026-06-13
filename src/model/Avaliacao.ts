export interface Avaliacao {
  id: string;
  ID_Avaliacao: string;
  ID_Usuario: string;
  ID_Curso: string;
  Nota: number;
  Comentario: string | null;
  DataAvaliacao: string;
}
