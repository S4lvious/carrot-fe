export interface User {
    id: number;
    nome: string;
    cognome?: string; // Opzionale (solo per professionisti)
    ragioneSociale?: string; // Opzionale (solo per aziende)
    codiceFiscale: string;
    partitaIva?: string; // Opzionale (solo per aziende)
    indirizzo: string;
    cap: string;
    citta: string;
    provincia: string;
    pec?: string; // Opzionale (per fatturazione elettronica)
    codiceDestinatario?: string; // Opzionale (per XML SDI)
    telefono?: string;
    email?: string;
    iban?: string; // Opzionale (per pagamenti)
    isAzienda: boolean; // Campo calcolato
  }
  