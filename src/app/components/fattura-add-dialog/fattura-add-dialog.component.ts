import { Component, Input } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { CtInputComponent } from "../input/input.component";
import { DialogFooterActions } from '../../models/utils.type';
import { Ordine } from '../../models/ordine.model';
import { FormsModule } from '@angular/forms';
import { ComponentDialog } from '../../models/component-dialog';
import { Checkbox } from 'primeng/checkbox';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CtCheckboxComponent } from "../checkbox/ct-checkbox.component";
import { Select } from 'primeng/select';
import { OrdiniService } from '../../services/ordine.service';
import { FatturaService } from '../../services/fattura.service';

// MODELS
import {
  DatiBollo,
  DatiCassaPrevidenziale,
  DatiPagamento,
  Fattura
} from '../../models/fattura.model';

@Component({
  selector: 'app-fattura-add-dialog',
  standalone: true,
  imports: [
    BmDialogComponent, PanelModule, TableModule, ButtonModule,
    InputTextModule, CtInputComponent, FormsModule,
    IftaLabelModule, DatePicker, Select, CtCheckboxComponent,
  ],
  templateUrl: 'fattura-add-dialog.component.html',
  styles: []
})
export class FatturaAddDialog extends ComponentDialog {

  // --- Ordine e lista ordini
  ordine: Ordine | null = null;
  ordineSelect: Ordine[] = [];
  orderDetails: any[] = [];

  // --- Campi base fattura
  applicareRitenuta: boolean = false;
  ritenutaAcconto: number = 0;
  importoRitenuta: number = 0;
  scadenza: Date = new Date();
  stato: string = "Non pagata";
  generaMovimento: boolean = false;

  // --- Nuovi campi per Fattura
  tipoDocumento: string = "FATT";
  causale: string = "";
  causalePagamento: string = "";

  datiBollo: DatiBollo = {
    bolloVirtuale: false,
    importoBollo: 0
  };

  datiCassa: DatiCassaPrevidenziale = {
    tipoCassa: "",
    alCassa: "",
    importoContributoCassa: 0,
    imponibileCassa: 0,
    aliquotaIVACassa: 0,
    natura: "",
    ritenuta: false
  };

  datiPagamento: DatiPagamento = {
    condizioniPagamento: "TP02", // default
    dettaglioPagamento: {
      beneficiario: "",
      modalitaPagamento: "MP05", // default
      dataScadenzaPagamento: "",
      iban: "",
      importoPagamento: 0,
      istitutoFinanziario: ""
    }
  };

  // Opzioni di select
  tipoDocumentoOptions = ["FATT", "NDC"];
  statoOptions = ["Pagata", "Non pagata"];
  condizioniPagamentoOptions = ["TP01", "TP02", "TP03"];
  modalitaPagamentoOptions = [
    "MP01","MP02","MP03","MP04","MP05","MP06","MP07","MP08","MP09","MP10",
    "MP11","MP12","MP13","MP14","MP15","MP16","MP17","MP18","MP19","MP20",
    "MP21","MP22","MP23"
  ];

  get isSaveDisabled(): boolean {

    // 1) Ordine deve essere selezionato
    if (!this.ordine) return true;

    // 2) Tipo Documento (FATT o NDC) non deve essere vuoto
    if (!this.tipoDocumento) return true;

    // 3) Data scadenza deve essere presente
    if (!this.scadenza) return true;

    // 4) Stato fattura
    if (!this.stato) return true;

    // 5) Condizioni di Pagamento
    if (!this.datiPagamento.condizioniPagamento) return true;

    // 6) Modalità di Pagamento
    if (!this.datiPagamento.dettaglioPagamento.modalitaPagamento) return true;

    // 7) Se c'è la ritenuta e aliquota ritenutaAcconto = 0 => impossibile
    if (this.applicareRitenuta && (!this.ritenutaAcconto || this.ritenutaAcconto <= 0)) {
      return true;
    }

    // 8) Se il bollo è virtuale, importoBollo deve essere > 0
    if (this.datiBollo.bolloVirtuale && (!this.datiBollo.importoBollo || this.datiBollo.importoBollo <= 0)) {
      return true;
    }

    // 9) Se cassa è un campo obbligatorio, potresti richiedere:
    //    - "tipoCassa" non vuoto
    //    - "importoContributoCassa" > 0
    //    ma dipende dalla tua logica
    //
    // if (this.datiCassa.tipoCassa && this.datiCassa.importoContributoCassa <= 0) {
    //   return true;
    // }

    return false;
  }


  get footerActions(): DialogFooterActions {
    return {
      primary: {
        disabled: this.isSaveDisabled,
        label: 'Salva',
        command: () => {
          const payload = {
            ordine: this.ordine,
            applicareRitenuta: this.applicareRitenuta,
            ritenutaAcconto: this.ritenutaAcconto,
            scadenza: this.scadenza,
            stato: this.stato,
            inserisciMovimento: this.generaMovimento,

            // Nuovi campi
            tipoDocumento: this.tipoDocumento,
            causale: this.causale,
            causalePagamento: this.causalePagamento,
            datiBollo: this.datiBollo,
            datiCassaPrevidenziale: this.datiCassa,
            datiPagamento: this.datiPagamento
          };

          this._fatturaService.generaFatturaCompleta(payload).subscribe(() => {
            this.close();
          });
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
    private ordineService: OrdiniService,
    private _fatturaService: FatturaService
  ) {
    super();
  }

  ngOnInit() {
    // Carica ordini non fatturati
    this.ordineService.getOrdiniNonFatturati().subscribe((orders) => {
      this.ordineSelect = orders;
    });
  }

  selectionChange() {
    this.orderDetails = [];
    if (this.ordine) {
      this.orderDetails = this.ordine.dettagliOrdine;
    }
  }
}
