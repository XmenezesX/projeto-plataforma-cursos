import type { Assinatura } from "../model/Assinatura";

export interface AssinaturaDto extends Assinatura {
  UsuarioNome: string;
  PlanoNome: string;
}
