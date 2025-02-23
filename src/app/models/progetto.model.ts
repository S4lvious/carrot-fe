import { Task } from "./task.model";

export interface Progetto {
    id?: number;
    ordineId?: number; // Un Progetto appartiene a un Ordine
    partecipanti: number[]; // Array di ID degli utenti partecipanti
    nome: string;
    descrizione?: string;
    dataCreazione?: Date; // LocalDateTime in formato string
    tasks?: Task[]; // Array di Task associati
    positionX?: number;
    positionY?: number;
  }


  
  