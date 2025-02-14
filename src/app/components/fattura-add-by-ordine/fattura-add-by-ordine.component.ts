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
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-prodotti-add-dialog',
  standalone: true,
  imports: [BmDialogComponent, InputTextModule, CtInputComponent, FormsModule, ToggleButtonModule, Checkbox, FloatLabelModule, DatePicker, Select],
  templateUrl: 'fattura-add-by-ordine.component.html',
  styles: []
})
export class FatturaAddByOrdine extends ComponentDialog {

  @Input() data: Ordine;
  applicareRitenuta: boolean = false;
  ritenutaAcconto: number = 0;
  scadenza: Date = new Date();
  stato: string = "Non pagata";

  footerActions: DialogFooterActions = {
    primary: {
      label: 'Salva',
      command: () => {
          this.ordineService.generaFatturaDaOrdine({
            ordine: this.data,
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

  constructor(private ordineService: OrdiniService) {
    super();
  }

  ngOnInit() {
  }
}
