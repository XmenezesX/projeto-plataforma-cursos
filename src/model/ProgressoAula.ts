export type StatusProgresso = 'Concluído' | 'Pendente' | 'Iniciado';

export interface ProgressoAula {
  id: string;
  ID_Usuario: string;
  ID_Aula: string;
  DataConclusao: string;
  Status: StatusProgresso;
}
