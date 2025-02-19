import { Ordine } from './ordine.model';

// ----------------------------------
// Oggetti embeddable (se vuoi gestirli come interfacce separate)
// ----------------------------------

export interface DatiBollo {
  bolloVirtuale: boolean;     // true -> "SI", false -> "NO"
  importoBollo: number;       // es. 2.00
}

export interface DatiCassaPrevidenziale {
  tipoCassa: string;          // es. "TC02"
  alCassa: string;            // es. "4.00"
  importoContributoCassa: number;
  imponibileCassa: number;
  aliquotaIVACassa: number;   // es. 22
  natura: string;             // es. "N1"
  ritenuta: boolean;          // true -> "SI", false -> "NO"
}

export interface DocumentoRiferimento {
  idDocumento: string;
  data: string;                        // LocalDate → string "YYYY-MM-DD"
  codiceCommessaConvenzione: string;
  codiceCUP: string;
  codiceCIG: string;
}

export interface DettaglioPagamento {
  beneficiario: string;
  modalitaPagamento?: string;           // "MP01", "MP05", ecc.
  dataScadenzaPagamento?: string;       // LocalDate → string
  iban: string;
  importoPagamento: number;
  istitutoFinanziario: string;
}

export interface DatiPagamento {
  condizioniPagamento: string;         // "TP01", "TP02", "TP03"
  dettaglioPagamento: DettaglioPagamento;
}

// ----------------------------------
// Interfaccia Fattura Principale
// ----------------------------------

export interface Fattura {
  id: number;
  ordine: Ordine;              // Riferimento all'ordine collegato

  // Campi principali
  numeroFattura: string;
  dataEmissione: string;       // LocalDate → string "YYYY-MM-DD"
  totaleNetto: number;
  totaleIVA: number;
  totaleLordo: number;
  totaleDovuto: number;

  applicareRitenuta: boolean;
  ritenutaAcconto: number;     // percentuale (es. 20)
  importoRitenuta: number;     // importo effettivo calcolato

  inviataAdE: boolean;
  stato: string;
  dataScadenza: string;        // LocalDate → string "YYYY-MM-DD"

  // Dati dell'utente emittente
  nomeEmittente: string;
  indirizzoEmittente: string;
  capEmittente: string;
  cittaEmittente: string;
  provinciaEmittente: string;
  partitaIVAEmittente: string;
  codiceFiscaleEmittente?: string;

  // Dati del Cliente al momento della fattura
  nomeCliente: string;
  indirizzoCliente: string;
  capCliente: string;
  cittaCliente: string;
  provinciaCliente: string;
  partitaIVACliente?: string;
  codiceFiscaleCliente?: string;

  // Campi aggiuntivi per il destinatario
  codiceSDIDestinatario?: string;
  pecDestinatario?: string;
  denominazioneDestinatario?: string;
  nazioneDestinatario?: string; // es. "IT"

  // Dati del documento
  tipoDocumento: string;       // es. "FATT", "NDC"
  causale?: string;
  causalePagamento?: string;

  // Dati Embeddable
  datiBollo?: DatiBollo;
  datiCassaPrevidenziale?: DatiCassaPrevidenziale;

  datiOrdineAcquisto?: DocumentoRiferimento;
  datiContratto?: DocumentoRiferimento;
  datiConvenzione?: DocumentoRiferimento;
  datiRicezione?: DocumentoRiferimento;
  datiFattureCollegate?: DocumentoRiferimento;

  datiPagamento?: DatiPagamento;
}

// ----------------------------------
// Interfaccia fatturaDaOrdine (se serve ancora)
// ----------------------------------
export interface fatturaDaOrdine {
  ordine: Ordine;
  applicareRitenuta: boolean;
  ritenutaAcconto: number;
  scadenza: Date;
  stato: string;
  inserisciMovimento: boolean;
}
