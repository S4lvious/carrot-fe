import { Categoria } from './categoria.model';

export interface Prodotto {
  id: number;
  nome: string;
  descrizione?: string; // Può essere opzionale
  prezzo: number; // BigDecimal → number in TS
  categoria: Categoria;
  aliquotaIVA: number; // BigDecimal → number in TS
  quantita: number;
  esauribile: boolean;
  codiceTipo?: string
}
