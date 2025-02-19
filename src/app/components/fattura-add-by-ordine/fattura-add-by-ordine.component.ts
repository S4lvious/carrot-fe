import { Component, Input } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { DialogFooterActions } from '../../models/utils.type';
import { ComponentDialog } from '../../models/component-dialog';
import { OrdiniService } from '../../services/ordine.service';
import { Ordine } from '../../models/ordine.model';

// Se usi embeddable a livello di front-end, potresti importare i modelli:
import {
  DatiBollo,
  DatiCassaPrevidenziale,
  DatiPagamento,
  DocumentoRiferimento
} from '../../models/fattura.model';
import { FatturaService } from '../../services/fattura.service';
import { CtCheckboxComponent } from '../checkbox/ct-checkbox.component';
import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { CtInputComponent } from '../input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fattura-add-by-ordine',
  standalone: true,
  imports: [
    CtCheckboxComponent,
    PanelModule,
    Select,
    IftaLabel,
    CtInputComponent,
    FormsModule,
    
    BmDialogComponent,
    // ... i moduli di UI (panel, datepicker, select, etc.)
  ],
  templateUrl: 'fattura-add-by-ordine.component.html',
  styles: []
})
export class FatturaAddByOrdine extends ComponentDialog {

  @Input() data: Ordine;

  // Campi esistenti
  applicareRitenuta: boolean = false;
  ritenutaAcconto: number = 0;
  scadenza: Date = new Date();
  stato: string = "Non pagata";
  generaMovimento: boolean = false;

  // Nuovi campi
  tipoDocumento: string = "FATT";
  causale: string = "";
  causalePagamento: string = "";

  // Bollo
  bolloVirtuale: boolean = false;
  importoBollo: number = 0;

  // Cassa
  tipoCassa: string = "";
  alCassa: string = "";
  importoContributoCassa: number = 0;
  imponibileCassa: number = 0;
  aliquotaIVACassa: number = 0;
  naturaCassa: string = "";
  ritenutaCassa: boolean = false;

  // Dati Pagamento
  condizioniPagamento: string = "TP02"; // default
  modalitaPagamento: string = "MP05";   // default
  beneficiario: string = "";
  iban: string = "";
  importoPagamento: number = 0;
  istitutoFinanziario: string = "";

  // Documenti di Riferimento (esempio con uno, potresti gestire Contratto, Convenzione, etc. simili)
  datiOrdineAcquisto: DocumentoRiferimento = {
    idDocumento: "",
    data: "",
    codiceCommessaConvenzione: "",
    codiceCUP: "",
    codiceCIG: ""
  };

  // Opzioni per select
  tipoDocumentoOptions = [ "FATT", "NDC" ];
  condizioniPagamentoOptions = [ "TP01", "TP02", "TP03" ];
  modalitaPagamentoOptions = [
    "MP01","MP02","MP03","MP04","MP05","MP06","MP07","MP08","MP09","MP10",
    "MP11","MP12","MP13","MP14","MP15","MP16","MP17","MP18","MP19","MP20",
    "MP21","MP22","MP23"
  ];

  footerActions: DialogFooterActions = {
    primary: {
      label: 'Salva',
      command: () => {
        // Componi l'oggetto di payload
        const payload = {
          ordine: this.data,
          applicareRitenuta: this.applicareRitenuta,
          ritenutaAcconto: this.ritenutaAcconto,
          scadenza: this.scadenza,
          stato: this.stato,
          inserisciMovimento: this.generaMovimento,

          // Nuovi campi
          tipoDocumento: this.tipoDocumento,
          causale: this.causale,
          causalePagamento: this.causalePagamento,

          datiBollo: {
            bolloVirtuale: this.bolloVirtuale,
            importoBollo: this.importoBollo
          },
          datiCassaPrevidenziale: {
            tipoCassa: this.tipoCassa,
            alCassa: this.alCassa,
            importoContributoCassa: this.importoContributoCassa,
            imponibileCassa: this.imponibileCassa,
            aliquotaIVACassa: this.aliquotaIVACassa,
            natura: this.naturaCassa,
            ritenuta: this.ritenutaCassa
          },
          datiPagamento: {
            condizioniPagamento: this.condizioniPagamento,
            dettaglioPagamento: {
              beneficiario: this.beneficiario,
              modalitaPagamento: this.modalitaPagamento,
              dataScadenzaPagamento: "", // se vuoi una data specifica
              iban: this.iban,
              importoPagamento: this.importoPagamento,
              istitutoFinanziario: this.istitutoFinanziario
            }
          },
          datiOrdineAcquisto: this.datiOrdineAcquisto
          // ... analoghi campi per Contratto, Convenzione, etc. se servono
        };

        // Chiamata al servizio
        this.ordineService.generaFatturaCompleta(payload).subscribe(() => {
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

  constructor(private ordineService: FatturaService) {
    super();
  }

  ngOnInit() {
    // Se serve inizializzare qualcosa in base all'ordine
    // ...
  }
}
