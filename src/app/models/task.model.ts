export interface Task {
    id?: number;
    progettoId: number; // Un Task appartiene a un Progetto
    assegnatoA: number[]; // Array di ID degli utenti assegnati
    titolo: string;
    descrizione?: string;
    dataCreazione: Date; // LocalDateTime in formato string
    dataScadenza?: Date; // LocalDateTime in formato string
    stato: StatoTask; // Stato del task
  }
  
  export enum StatoTask {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETATO = 'COMPLETATO'
  }
  