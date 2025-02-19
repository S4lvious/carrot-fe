import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CrudTableComponent } from '../../components/crud-table/crud-table.component';
import { ComponentLoaderService } from '../../services/loader.service';
import { CrudTableConfig } from '../../models/crud-table.model';
import { Prodotto } from '../../models/prodotto.model';
import { mergeMap, of } from 'rxjs';
import { ProdottiAddDialogComponent } from '../../components/prodotti-add-dialog/prodotti-add-dialog';
import { ProdottiService } from '../../services/prodotti.service';

@Component({
  selector: 'app-prodotti',
  imports: [CrudTableComponent],
  templateUrl: './prodotti.component.html'
})
export class ProdottiComponent  {

  public prodotti: Prodotto[] = [];

  public config: CrudTableConfig = {
    title: 'Prodotti',
    addButtonText: 'Aggiungi prodotto',
    columns: [
      { field: 'id', header: 'ID', filter: true, type: 'text'},
      { field: 'nome', header: 'Nome', filter: true, type: 'text' },
      { field: 'descrizione', header: 'Descrizione', filter: true, type: 'text' },
      { field: 'prezzo', header: 'Prezzo', filter: true, type: 'text' },
      { field: 'categoria.nome', header: 'Categoria', filter: true, type: 'text' },
      { field: 'aliquotaIVA', header: 'Aliquota IVA', filter: true, type: 'text' },
      { field: 'quantita', header: 'Quantità', filter: true, type: 'text' },
      { field: 'esauribile', header: 'Esauribile', filter: true, type: 'boolean' },

      // Nuovi campi per la fatturazione elettronica
      { field: 'codiceTipo', header: 'Codice Tipo', filter: true, type: 'text' },
      { field: 'codiceValore', header: 'Codice Valore', filter: true, type: 'text' },
      { field: 'unitaMisura', header: 'U.Misura', filter: true, type: 'text' },
      { field: 'natura', header: 'Natura IVA', filter: true, type: 'text' },
      { field: 'esigibilitaIVA', header: 'Esig. IVA', filter: true, type: 'text' },
    ],
    actionButtons: [
      { name: 'edit', label: 'Modifica', icon: 'pi pi-pencil', class: 'p-button-success' },
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' },
    ],
    actions: {
      add: (item) =>
        this._loaderService
          .load(ProdottiAddDialogComponent, item)
          .then(() =>
            this._prodottiService.getProducts().subscribe((prodotti) => this.prodotti = prodotti)
          ),
      edit: (item) =>
        this._loaderService
          .load(ProdottiAddDialogComponent, item)
          .then(() =>
            this._prodottiService.getProducts().subscribe((prodotti) => this.prodotti = prodotti)
          ),
      delete: (item) =>
        this._loaderService
          .confirm({
            title: 'Vuoi davvero eliminare il prodotto?',
            primary: 'Conferma',
            secondary: 'Annulla',
          })
          .pipe(
            mergeMap((result: any) => {
              if (result?.confirmed) {
                return this._prodottiService.deleteProduct(item.id).pipe(
                  mergeMap(() => this._prodottiService.getProducts())
                );
              } else {
                return of(null);
              }
            })
          )
          .subscribe((prodotti) => {
            if (prodotti) {
              this.prodotti = prodotti;
            }
          }),
    },
  };

  constructor(
    private _loaderService: ComponentLoaderService,
    private _prodottiService: ProdottiService
  ) {}

  ngOnInit() {
    this._prodottiService.getProducts().subscribe((prod) => (this.prodotti = prod));
  }
}
