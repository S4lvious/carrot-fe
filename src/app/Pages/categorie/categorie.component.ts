import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CrudTableComponent } from '../../components/crud-table/crud-table.component';
import { ComponentLoaderService } from '../../services/loader.service';
import { CrudTableConfig } from '../../models/crud-table.model';
import { Prodotto } from '../../models/prodotto.model';
import { mergeMap, of } from 'rxjs';
import { ProdottiAddDialogComponent } from '../../components/prodotti-add-dialog/prodotti-add-dialog';
import { ProdottiService } from '../../services/prodotti.service';
import { CategorieService } from '../../services/categoria.service';
import { CategorieAddDialogComponent } from '../../components/categoria-add-dialog/categoria.add-dialog.component';

@Component({
  selector: 'app-categorie',
  imports: [CrudTableComponent],
  templateUrl: './categorie.component.html',
})
export class CategorieComponent  {

  constructor(
    private _loaderService: ComponentLoaderService,
    private _prodottiService: CategorieService
  ) { }
  

  ngOnInit() {
    this._prodottiService.getCategories().subscribe((prod) => this.prodotti = prod)
  }



  public prodotti: Prodotto[] = [];
  public config: CrudTableConfig = {
    title: 'Categorie',
    addButtonText: 'Aggiungi categoria',
    columns: [
      { field: 'id', header: 'ID' ,filter: true,type: 'text' },
      { field: 'nome', header: 'Nome',filter: true,type: 'text'  },
    ],
    actionButtons: [
      { name: 'edit', label: 'Modifica', icon: 'pi pi-pencil', class: 'p-button-success' },
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' },
    ],
    actions: {
      add: (item) =>
        this._loaderService
          .load(CategorieAddDialogComponent, item)
          .then(() =>
            this._prodottiService
              .getCategories()
              .subscribe((prodotti) => (this.prodotti = prodotti))
          ),
      edit: (item) =>
        this._loaderService
          .load(CategorieAddDialogComponent, item)
          .then(() =>
            this._prodottiService
              .getCategories()
              .subscribe((prodotti) => (this.prodotti = prodotti))
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
                // Elimina il prodotto e poi ricarica la lista
                return this._prodottiService.deleteCategoria(item.id).pipe(
                  mergeMap(() => this._prodottiService.getCategories())
                );
              } else {
                // Se l'azione viene annullata, ritorna un Observable che emette null
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
  


}




