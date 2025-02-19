import { Component } from '@angular/core';
import { mergeMap, of } from 'rxjs';
import { CrudTableComponent } from '../../../components/crud-table/crud-table.component';
import { ComponentLoaderService } from '../../../services/loader.service';
import { OrdiniService } from '../../../services/ordine.service';
import { Ordine } from '../../../models/ordine.model';
import { CrudTableConfig } from '../../../models/crud-table.model';
import { OrdiniAddDialogComponent } from '../../../components/ordine-add-dialog/ordine-add-dialog.component';
import { FatturaAddByOrdine } from '../../../components/fattura-add-by-ordine/fattura-add-by-ordine.component';

@Component({
  selector: 'app-ordini',
  imports: [CrudTableComponent],
  templateUrl: './ordini.component.html',
})
export class OrdiniComponent {

  constructor(
    private _loaderService: ComponentLoaderService,
    private _ordiniService: OrdiniService
  ) { }

  ngOnInit() {
    this._ordiniService.getProducts().subscribe((ord: any) => this.ordini = ord);
  }

  public ordini: Ordine[] = [];
  public config: CrudTableConfig = {
    title: 'Ordini',
    addButtonText: 'Aggiungi Ordine',
    columns: [
      { field: 'numeroOrdine', header: 'Numero ordine' ,filter: true, type: 'text'},
      // Mostriamo il nome del cliente sfruttando la proprietà annidata 'cliente.nome'
      { field: 'cliente.nome', header: 'Cliente Nome',filter: true, type: 'text' },
      { field: 'cliente.cognome', header: 'Cliente Cognome',filter: true, type: 'text' },
      { field: 'cliente.ragioneSociale', header: 'Cliente Ragione Sociale',filter: true, type: 'text' },
      { field: 'cliente.id', header: 'Cliente ID',filter: true, type: 'text' },


      { field: 'dataOrdine', header: 'Data Ordine',filter: true, type: 'text' },
      { field: 'totale', header: 'Totale',filter: true, type: 'text' },
      { field: 'fatturato', header: 'Fatturato',filter: true, type: 'boolean' },
      { field: 'stato', header: 'Stato' ,filter: true, type: 'custom', props:["In corso", "Completo"]},
    ],
    actionButtons: [
      { name: 'edit', label: 'Modifica', icon: 'pi pi-pencil', class: 'p-button-success' },
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' },
      { name: 'create', label: 'Crea fattura', icon: 'pi pi-euro', class: 'p-button-danger' },

    ],
    actions: {
      // Apertura del dialog per l'aggiunta di un nuovo ordine
      add: (item) =>
        this._loaderService
          .load(OrdiniAddDialogComponent, item)
          .then(() =>
            this._ordiniService.getProducts().subscribe((ordini) => (this.ordini = ordini))
          ),
          create: (item) =>
            this._loaderService
              .load(FatturaAddByOrdine, item)
              .then(() =>
                this._ordiniService.getProducts().subscribe((ordini) => (this.ordini = ordini))
              ),
          // Apertura del dialog in modalità modifica
      edit: (item) =>
        this._loaderService
          .load(OrdiniAddDialogComponent, item)
          .then(() =>
            this._ordiniService.getProducts().subscribe((ordini) => (this.ordini = ordini))
          ),
      // Azione di eliminazione con conferma
      delete: (item) =>
        this._loaderService
          .confirm({
            title: 'Vuoi davvero eliminare l\'ordine?',
            primary: 'Conferma',
            secondary: 'Annulla',
          })
          .pipe(
            mergeMap((result: any) => {
              if (result?.confirmed) {
                // Elimina l'ordine e poi ricarica la lista degli ordini
                return this._ordiniService.deleteProduct(item.id).pipe(
                  mergeMap(() => this._ordiniService.getProducts())
                );
              } else {
                // Se annullato, ritorna un Observable che emette null
                return of(null);
              }
            })
          )
          .subscribe((ordini) => {
            if (ordini) {
              this.ordini = ordini;
            }
          }),
    },
  };
}
