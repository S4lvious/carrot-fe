import { Categoria } from './categoria.model';
import { MetodoPagamento } from './metodopagamento.model';
import { Fattura } from './fattura.model';
import { TipoMovimento } from './tipo-movimento.model';
import { User } from './user.model';
import { Ordine } from './ordine.model';

export interface PrimaNota {
    id?: number;
    dataOperazione: Date; // ISO string (es. "2024-02-16")
    nome: string;
    categoria: Categoria;
    metodoPagamento: MetodoPagamento;
    importo: number;
    tipoMovimento: TipoMovimento; // 'ENTRATA' | 'USCITA'
    fattura?: Fattura; // Se presente, è un'entrata legata a una fattura
    incaricoId?: number; // Se l'operazione è legata a un incarico
}
