import { Ordine } from "./ordine.model";
import { Prodotto } from "./prodotto.model";

export interface DettaglioOrdine {
  id: number;
  ordine: Ordine;
  prodotto: Prodotto;
  quantita: number;
  prezzoUnitario: number; // BigDecimal in Java → number in TS
}
