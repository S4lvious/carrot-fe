export interface Operazione {
    id: number;
    entita: string;
    tipo: string;
    descrizione: string;
    dataOperazione: string; // LocalDateTime → string in formato ISO (YYYY-MM-DDTHH:mm:ss)
  }
  