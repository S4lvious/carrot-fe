import { Component, Input } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { CtInputComponent } from "../input/input.component";
import { DialogFooterActions } from '../../models/utils.type';
import { Prodotto } from '../../models/prodotto.model';
import { ProdottiService } from '../../services/prodotti.service';
import { ComponentDialog } from '../../models/component-dialog';
import { Categoria } from '../../models/categoria.model';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CategorieService } from '../../services/categoria.service';
import { OrdiniService } from '../../services/ordine.service';
import { Ordine } from '../../models/ordine.model';
import { Checkbox } from 'primeng/checkbox';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CtCheckboxComponent } from "../checkbox/ct-checkbox.component";


@Component({
  selector: 'app-prodotti-add-dialog',
  standalone: true,
  imports: [BmDialogComponent, PanelModule, TableModule, ButtonModule, InputTextModule, CtInputComponent, FormsModule, ToggleButtonModule, IftaLabelModule, DatePicker, Select, CtCheckboxComponent],
  templateUrl: 'fattura-add-dialog.component.html',
  styles: []
})
export class FatturaAddDialog extends ComponentDialog {

  ordine: Ordine
  ordineSelect: Ordine[];
  applicareRitenuta: boolean = false;
  ritenutaAcconto: number = 0;
  scadenza: Date = new Date();
  stato: string = "Non pagata";
  orderDetails: any[];

  footerActions: DialogFooterActions = {
    primary: {
      label: 'Salva',
      command: () => {
          this.ordineService.generaFatturaDaOrdine({
            ordine: this.ordine,
            applicareRitenuta: this.applicareRitenuta,
            ritenutaAcconto: this.ritenutaAcconto,
            scadenza: this.scadenza,
            stato: this.stato
        }).subscribe(() => {
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

  selectionChange() {
    this.orderDetails = [];
    this.orderDetails = this.ordine.dettagliOrdine;
  }

  constructor(private ordineService: OrdiniService) {
    super();
  }

  ngOnInit() {
    this.ordineService.getOrdiniNonFatturati().subscribe((orders) => this.ordineSelect = orders);
  }
}
