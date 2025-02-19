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
      //CAMPI ADE
      { field: 'sdiIdentificativo', header: 'Identificativo SDI', filter: true, type: 'text' },
      { field: 'SdiStato', header: 'Stato SDI', filter: true, type: 'text' },
      { field: 'SdiMessaggio', header: 'Messaggio SDI', filter: true, type: 'text' },



      // Campi principali già esistenti
      { field: 'numeroFattura', header: 'Numero Fattura', filter: true, type: 'text' },
      { field: 'ordine.numeroOrdine', header: 'Ordine Nr.', filter: true, type: 'text' },
      { field: 'dataEmissione', header: 'Data Emissione', filter: true, type: 'date' },
      { field: 'totaleNetto', header: 'Totale Netto', filter: true, type: 'text' },
      { field: 'totaleIVA', header: 'Totale IVA', filter: true, type: 'text' },
      { field: 'totaleLordo', header: 'Totale Lordo', filter: true ,type: 'text'},
      { field: 'totaleDovuto', header: 'Totale Dovuto', filter: true, type: 'text' },
      { field: 'applicareRitenuta', header: 'Applica Ritenuta', filter: true, type: 'boolean'},
      { field: 'ritenutaAcconto', header: 'Aliquota Ritenuta %', filter: true, type: 'text' },
      { field: 'importoRitenuta', header: 'Importo Ritenuta', filter: true, type: 'text' },
      { field: 'inviataAdE', header: 'Inviata AdE', filter: true, type: 'boolean' },
      { field: 'stato', header: 'Stato', filter: true, type: 'custom', props: ["Pagata", "Non pagata"]},
      { field: 'dataScadenza', header: 'Data Scadenza', filter: true, type: 'date' },
      
      // Dati Emittente
      { field: 'nomeEmittente', header: 'Nome Emittente', filter: true, type: 'text' },
      { field: 'indirizzoEmittente', header: 'Indirizzo Emittente', filter: true, type: 'text' },
      { field: 'capEmittente', header: 'CAP Emittente', filter: true, type: 'text' },
      { field: 'cittaEmittente', header: 'Città Emittente', filter: true, type: 'text' },
      { field: 'provinciaEmittente', header: 'Prov. Emittente', filter: true, type: 'text' },
      { field: 'partitaIVAEmittente', header: 'P.IVA Emittente', filter: true, type: 'text' },
      { field: 'codiceFiscaleEmittente', header: 'CF Emittente', filter: true, type: 'text' },

      // Dati Cliente
      { field: 'nomeCliente', header: 'Nome/Denominazione Cliente', filter: true, type: 'text'},
      { field: 'indirizzoCliente', header: 'Indirizzo Cliente', filter: true, type: 'text' },
      { field: 'capCliente', header: 'CAP Cliente', filter: true, type: 'text' },
      { field: 'cittaCliente', header: 'Città Cliente', filter: true, type: 'text' },
      { field: 'provinciaCliente', header: 'Prov. Cliente', filter: true, type: 'text' },
      { field: 'partitaIVACliente', header: 'P.IVA Cliente', filter: true, type: 'text' },
      { field: 'codiceFiscaleCliente', header: 'CF Cliente', filter: true, type: 'text' },

      // Campi aggiuntivi per il destinatario
      { field: 'codiceSDIDestinatario', header: 'Codice SDI Dest.', filter: true, type: 'text' },
      { field: 'pecDestinatario', header: 'PEC Dest.', filter: true, type: 'text' },
      { field: 'denominazioneDestinatario', header: 'Denominaz. Dest.', filter: true, type: 'text' },
      { field: 'nazioneDestinatario', header: 'Nazione Dest.', filter: true, type: 'text' },

      // Dati del documento
      { field: 'tipoDocumento', header: 'Tipo Documento', filter: true, type: 'text' },
      { field: 'causale', header: 'Causale', filter: true, type: 'text' },
      { field: 'causalePagamento', header: 'Causale Pagamento', filter: true, type: 'text' },

      // Dati Bollo (Embeddable)
      { field: 'datiBollo.bolloVirtuale', header: 'Bollo Virtuale', filter: true, type: 'boolean' },
      { field: 'datiBollo.importoBollo', header: 'Importo Bollo', filter: true, type: 'text' },

      // Dati Cassa Previdenziale (Embeddable)
      { field: 'datiCassaPrevidenziale.tipoCassa', header: 'Tipo Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.alCassa', header: 'Aliquota Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.importoContributoCassa', header: 'Contributo Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.imponibileCassa', header: 'Imponibile Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.aliquotaIVACassa', header: 'Aliquota IVA Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.natura', header: 'Natura Cassa', filter: true, type: 'text' },
      { field: 'datiCassaPrevidenziale.ritenuta', header: 'Ritenuta Cassa', filter: true, type: 'boolean' },

      // Dati Pagamento (Embeddable)
      { field: 'datiPagamento.condizioniPagamento', header: 'Cond. Pagamento', filter: true, type: 'text' },
      { field: 'datiPagamento.dettaglioPagamento.beneficiario', header: 'Beneficiario', filter: true, type: 'text' },
      { field: 'datiPagamento.dettaglioPagamento.modalitaPagamento', header: 'Modalità Pag.', filter: true, type: 'text' },
      { field: 'datiPagamento.dettaglioPagamento.dataScadenzaPagamento', header: 'Scadenza Pag.', filter: true, type: 'date' },
      { field: 'datiPagamento.dettaglioPagamento.iban', header: 'IBAN', filter: true, type: 'text' },
      { field: 'datiPagamento.dettaglioPagamento.importoPagamento', header: 'Importo Pag.', filter: true, type: 'text' },
      { field: 'datiPagamento.dettaglioPagamento.istitutoFinanziario', header: 'Istituto Fin.', filter: true, type: 'text' },
    ],
    actionButtons: [
      { name: 'generatePDF', label: 'Genera PDF', icon: 'pi pi-file', class: 'p-button-success' },
      { name: "generateXml", label: 'Invia in cloud', icon: 'pi pi-file', class: 'p-button-success' },
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
        this._fattureService.generaPdf(item),
      generateXml: (item) =>
        this._fattureService.generaXml(item).subscribe(),
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
