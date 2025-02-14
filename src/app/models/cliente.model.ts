export interface Cliente {
    id: number;
    ragioneSociale?: string;
    nome?: string;
    cognome?: string;
    email: string;
    telefono: string;
    codiceFiscale?: string;
    partitaIva?: string | null;
    indirizzo: string;
    citta: string;
    provincia: string;
    cap: string;
    note?: string;
    dataUltimoOrdine?: string; // LocalDate in Java → string in TS
    isAzienda: boolean;
  }
  