import type { Pagamento } from "../model/Pagamento";

export interface PagamentoDto extends Pagamento {
  UsuarioNome: string;
  PlanoNome: string;
}
