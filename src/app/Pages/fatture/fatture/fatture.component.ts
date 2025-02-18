import { Component } from '@angular/core';
import { CrudTableComponent } from '../../../components/crud-table/crud-table.component';
import { CrudTableConfig } from '../../../models/crud-table.model';
import { Fattura } from '../../../models/fattura.model';
import { ComponentLoaderService } from '../../../services/loader.service';
import { mergeMap, of } from 'rxjs';
import { FatturaService } from '../../../services/fattura.service';
import { FatturaAddDialog } from '../../../components/fattura-add-dialog/fattura-add-dialog.component';

@Component({
  selector: 'app-fatture',
  imports: [CrudTableComponent],
  templateUrl: './fatture.component.html',
})
export class FattureComponent {

  public fatture: Fattura[] = [];

  public config: CrudTableConfig = {
    title: 'Fatture',
    addButtonText: 'Aggiungi fattura',
    columns: [
      { field: 'numeroFattura', header: 'Numero Fattura',filter: true,type: 'text' },
      { field: 'ordine.numero_ordine', header: 'Ordine ID',filter: true,type: 'text' },
      { field: 'dataEmissione', header: 'Data Emissione',filter: true,type: 'date' },
      { field: 'totaleNetto', header: 'Totale Netto',filter: true,type: 'text' },
      { field: 'totaleIVA', header: 'Totale IVA',filter: true,type: 'text' },
      { field: 'totaleLordo', header: 'Totale Lordo',filter: true ,type: 'text'},
      { field: 'totaleDovuto', header: 'Totale Dovuto',filter: true,type: 'text' },
      { field: 'applicareRitenuta', header: 'Applica Ritenuta',filter: true ,type: 'boolean'},
      { field: 'ritenutaAcconto', header: 'Ritenuta Acconto',filter: true,type: 'text' },
      { field: 'inviataAdE', header: 'Inviata adE',filter: true,type: 'boolean' },
      { field: 'stato', header: 'Stato',filter: true,type: 'custom', props: ["Pagata", "Non pagata"]},
      { field: 'dataScadenza', header: 'Data Scadenza',filter: true,type: 'date' },
      { field: 'nomeEmittente', header: 'Nome Emittente',filter: true,type: 'text' },
      { field: 'indirizzoEmittente', header: 'Indirizzo Emittente',filter: true,type: 'text' },
      { field: 'capEmittente', header: 'CAP Emittente' ,filter: true,type: 'text'},
      { field: 'cittaEmittente', header: 'Città Emittente' ,filter: true,type: 'text'},
      { field: 'provinciaEmittente', header: 'Provincia Emittente',filter: true,type: 'text'},
      { field: 'partitaIVAEmittente', header: 'Partita IVA Emittente',filter: true ,type: 'text'},
      { field: 'codiceFiscaleEmittente', header: 'Codice Fiscale Emittente',filter: true,type: 'text' },
      { field: 'nomeCliente', header: 'Nome Cliente',filter: true ,type: 'text'},

      { field: 'indirizzoCliente', header: 'Indirizzo Cliente',filter: true,type: 'text' },
      { field: 'capCliente', header: 'CAP Cliente',filter: true,type: 'text' },
      { field: 'cittaCliente', header: 'Città Cliente',filter: true,type: 'text' },
      { field: 'provinciaCliente', header: 'Provincia Cliente',filter: true,type: 'text' },
      { field: 'partitaIVACliente', header: 'Partita IVA Cliente',filter: true,type: 'text' },
      { field: 'codiceFiscaleCliente', header: 'Codice Fiscale Cliente',filter: true,type: 'text' }
    ],
    actionButtons: [
      { name: 'generatePDF', label: 'Genera PDF', icon: 'pi pi-file', class: 'p-button-success' },
      { name: "generateXml", label: 'Genera XML', icon: 'pi pi-file', class: 'p-button-success' },
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' }
    ],
    actions: {
      add: (item) =>
        this._loaderService
          .load(FatturaAddDialog, item)
          .then(() =>
            this._fattureService.getFatture().subscribe((fatture) => this.fatture = fatture)
          ),
          generatePDF: (item) =>
        this._fattureService
          .generaPdf(item)
            ,
            generateXml: (item) =>
              this._fattureService
                .generaXml(item)
                  ,
      
      delete: (item) =>
        this._loaderService
          .confirm({
            title: 'Vuoi davvero eliminare la fattura?',
            primary: 'Conferma',
            secondary: 'Annulla'
          })
          .pipe(
            mergeMap((result: any) => {
              if (result?.confirmed) {
                return this._fattureService.deleteFattura(item.id).pipe(
                  mergeMap(() => this._fattureService.getFatture())
                );
              } else {
                return of(null);
              }
            })
          )
          .subscribe((fatture) => {
            if (fatture) {
              this.fatture = fatture;
            }
          })
    }
  };

  constructor(
    private _fattureService: FatturaService,
    private _loaderService: ComponentLoaderService
  ) {}

  ngOnInit() {
    this._fattureService.getFatture().subscribe((fatture) => {
      this.fatture = fatture;
      console.log(fatture);
    });
  }
}
