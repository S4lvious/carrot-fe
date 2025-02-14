import { Cliente } from './cliente.model';
import { DettaglioOrdine } from './dettaglio-ordine.model';

export interface Ordine {
  id?: number;
  cliente: Cliente;
  dataOrdine: string; // LocalDateTime in Java → string in TS (ISO format)
  totale: number; // BigDecimal in Java → number in TS
  fatturato: boolean;
  stato: string;
  dettagliOrdine: DettaglioOrdine[];
}
