export type TipoConteudoAula = 'Vídeo' | 'Texto' | 'Quiz';

export interface Aula {
  id: string;
  ID_Aula: string;
  ID_Modulo: string;
  Titulo: string;
  TipoConteudo: TipoConteudoAula;
  URL_Conteudo: string;
  DuracaoMinutos: number;
  Ordem: number;
}
