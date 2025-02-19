import { Component, Input } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { CtInputComponent } from "../input/input.component";
import { DialogFooterActions } from '../../models/utils.type';
import { Cliente } from '../../models/cliente.model';
import { ClientiService } from '../../services/clienti.service';
import { ComponentDialog } from '../../models/component-dialog';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'app-clienti-add-dialog',
    standalone: true,
    imports: [BmDialogComponent, PanelModule, InputTextModule, CtInputComponent],
    templateUrl: 'clienti-add-dialog.component.html',
    styles: []
})
export class ClientiAddDialogComponent extends ComponentDialog {

    @Input() data: Cliente; // se stiamo modificando un cliente esistente

    edit: boolean;

    // Campi esistenti
    nome: string;
    cognome: string;
    email: string;
    telefono: string;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    partitaIva: string;
    codiceFiscale: string;
    ragioneSociale: string;

    // Nuovi campi
    codiceSDI: string;
    pec: string;
    nazione: string;

    get isSaveDisabled(): boolean {
        /*
         * Se è presente la ragione sociale, allora è valido solo se non ci sono nome e cognome.
         * Altrimenti, se non c'è ragione sociale, richiediamo entrambi: nome e cognome.
         */
        if (this.ragioneSociale) {
          return Boolean(this.nome || this.cognome); 
        } else {
          return (!this.nome || !this.cognome);
        }
    }

    get footerActions(): DialogFooterActions {
        return {
            primary: {
                disabled: this.isSaveDisabled,
                label: 'Salva',
                command: () => { 
                    if (this.edit) {
                        // UPDATE
                        this.clienteService.updateClient({ 
                            id: this.data.id,
                            nome: this.nome,
                            cognome: this.cognome,
                            email: this.email,
                            telefono: this.telefono,
                            indirizzo: this.indirizzo,
                            cap: this.cap,
                            provincia: this.provincia,
                            citta: this.citta,
                            partitaIva: this.partitaIva === '' ? null : this.partitaIva,
                            codiceFiscale: this.codiceFiscale,
                            ragioneSociale: this.ragioneSociale,
                            isAzienda: this.data.isAzienda,

                            // Nuovi campi
                            codiceSDI: this.codiceSDI,
                            pec: this.pec,
                            nazione: this.nazione
                        }).subscribe(() => {
                            this.close();
                        });
                    } else {
                        // CREATE
                        this.clienteService.createClient({
                            nome: this.nome,
                            cognome: this.cognome,
                            email: this.email,
                            telefono: this.telefono,
                            indirizzo: this.indirizzo,
                            cap: this.cap,
                            provincia: this.provincia,
                            citta: this.citta,
                            partitaIva: this.partitaIva === '' ? null : this.partitaIva,
                            codiceFiscale: this.codiceFiscale,
                            ragioneSociale: this.ragioneSociale,
                            isAzienda: this.ragioneSociale ? true : false,

                            // Nuovi campi
                            codiceSDI: this.codiceSDI,
                            pec: this.pec,
                            nazione: this.nazione
                        }).subscribe(() => {
                            this.close();
                        });
                    }
                }
            },
            secondary: {
                label: 'Annulla',
                command: () => {
                    this.close();
                }
            }
        };
    }

    constructor(
      private  clienteService: ClientiService
    ) {
        super();
    }

    ngOnInit(){
        if (this.data) {
            this.edit = true;
            this.nome = this.data?.nome ?? '';
            this.cognome = this.data?.cognome ?? '';
            this.email = this.data?.email ?? '';
            this.telefono = this.data?.telefono ?? '';
            this.indirizzo = this.data?.indirizzo ?? '';
            this.cap = this.data?.cap ?? '';
            this.provincia = this.data?.provincia ?? '';
            this.citta = this.data?.citta ?? '';
            this.partitaIva = this.data?.partitaIva ?? '';
            this.codiceFiscale = this.data?.codiceFiscale ?? '';
            this.ragioneSociale = this.data?.ragioneSociale ?? '';

            // Inizializza i nuovi campi
            this.codiceSDI = this.data?.codiceSDI ?? '';
            this.pec = this.data?.pec ?? '';
            this.nazione = this.data?.nazione ?? '';

        } else {
            this.edit = false;
            this.nome = '';
            this.cognome = '';
            this.email = '';
            this.telefono = '';
            this.indirizzo = '';
            this.cap = '';
            this.provincia = '';
            this.citta = '';
            this.partitaIva = '';
            this.codiceFiscale = '';
            this.ragioneSociale = '';

            // Nuovi campi
            this.codiceSDI = '';
            this.pec = '';
            this.nazione = '';
        }
    }
}
