import { Ordine } from './ordine.model';

export interface Fattura {
  id: number;
  ordine: Ordine;
  numeroFattura: string; // Es: "2024-001"
  dataEmissione: string; // LocalDate → string in formato YYYY-MM-DD
  totaleNetto: number;
  totaleIVA: number;
  totaleLordo: number;
  totaleDovuto: number;
  applicareRitenuta: boolean;
  ritenutaAcconto: number;
  inviataAdE: boolean;
  stato: string;
  dataScadenza: string; // LocalDate → string in formato YYYY-MM-DD

  // **Dati dell'utente emittente**
  nomeEmittente: string;
  indirizzoEmittente: string;
  capEmittente: string;
  cittaEmittente: string;
  provinciaEmittente: string;
  partitaIVAEmittente: string;
  codiceFiscaleEmittente?: string; // Opzionale

  // **Dati del Cliente al momento della fattura**
  nomeCliente: string;
  indirizzoCliente: string;
  capCliente: string;
  cittaCliente: string;
  provinciaCliente: string;
  partitaIVACliente: string;
  codiceFiscaleCliente?: string; // Opzionale
}

export interface fatturaDaOrdine {
  ordine: Ordine,
  applicareRitenuta: boolean,
  ritenutaAcconto: number,
  scadenza: Date,
  stato: String
}
