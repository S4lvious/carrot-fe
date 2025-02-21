import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CrudTableComponent } from '../../../components/crud-table/crud-table.component';
import { CrudTableConfig } from '../../../models/crud-table.model';
import { ClientiService } from '../../../services/clienti.service';
import { Cliente } from '../../../models/cliente.model';
import { ComponentLoaderService } from '../../../services/loader.service';
import { ClientiAddDialogComponent } from '../../../components/clienti-add-dialog/clienti-add-dialog.component';
import { mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-clienti',
  imports: [CrudTableComponent],
  templateUrl: './clienti.component.html',
  styleUrls: ['./clienti.component.css'],
})
export class ClientiComponent  {

  public clients: Cliente[] = [];

  public config: CrudTableConfig = {
    title: 'Clienti',
    addButtonText: 'Aggiungi cliente',
    columns: [
      { field: 'id', header: 'ID', filter: true, type: 'text'},
      { field: 'nome', header: 'Nome', filter: true, type: 'text' },
      { field: 'cognome', header: 'Cognome', filter: true, type: 'text' },
      { field: 'email', header: 'Email', filter: true, type: 'text' },
      { field: 'telefono', header: 'Telefono', filter: true, type: 'text' },
      { field: 'indirizzo', header: 'Indirizzo', filter: true, type: 'text' },
      { field: 'citta', header: 'Città', filter: true, type: 'text' },
      { field: 'cap', header: 'CAP', filter: true, type: 'text' },
      { field: 'provincia', header: 'Provincia', filter: true, type: 'text' },
      { field: 'partitaIva', header: 'Partita IVA', filter: true, type: 'text' },
      { field: 'codiceFiscale', header: 'Codice Fiscale', filter: true, type: 'text' },
      { field: 'ragioneSociale', header: 'Ragione Sociale', filter: true, type: 'text' },
      { field: 'dataUltimoOrdine', header: 'Ultimo ordine', filter: true, type: 'date' },
      { field: 'isAzienda', header: 'Azienda', filter: true, type: 'boolean' },

      // Nuovi campi
      { field: 'codiceSDI', header: 'Codice SDI', filter: true, type: 'text' },
      { field: 'pec', header: 'PEC', filter: true, type: 'text' },
      { field: 'nazione', header: 'Nazione', filter: true, type: 'text' },
    ],
    actionButtons: [
      { name: 'edit', label: 'Modifica', icon: 'pi pi-pencil', class: 'p-button-success' },
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' },
    ],
    actions: {
      add: (item) => 
        this._loaderService.load(ClientiAddDialogComponent, item)
          .then(() => this._clientiService.getClients().subscribe((clienti) => this.clients = clienti)),
      edit: (item) => 
        this._loaderService.load(ClientiAddDialogComponent, item)
          .then(() => this._clientiService.getClients().subscribe((clienti) => this.clients = clienti)),
      delete: (item) =>
        this._loaderService.confirm({
          title: 'Vuoi davvero eliminare il cliente?',
          primary: 'Conferma',
          secondary: 'Annulla'
        }).pipe(
          mergeMap((result: any) => {
            if (result?.confirmed) {
              return this._clientiService.deleteClient(item.id).pipe(
                mergeMap(() => this._clientiService.getClients())
              );
            } else {
              return of(null);
            }
          })
        ).subscribe((clients) => {
          if (clients) {
            this.clients = clients;
          }
        })
    },
  };

  constructor(
    private _clientiService: ClientiService,
    private _loaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this._clientiService.getClients().subscribe((clients) => {
      this.clients = clients;
      console.log(clients);
    });
  }
}
