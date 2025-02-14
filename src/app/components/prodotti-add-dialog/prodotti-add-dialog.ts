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
import { CtCheckboxComponent } from "../checkbox/ct-checkbox.component";
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-prodotti-add-dialog',
  standalone: true,
  imports: [BmDialogComponent, PanelModule,InputTextModule, CtInputComponent, FormsModule, Select, ToggleButtonModule, CtCheckboxComponent],
  templateUrl: 'prodotti-add-dialog.component.html',
  styles: []
})
export class ProdottiAddDialogComponent extends ComponentDialog {

  @Input() data: Prodotto;
  edit: boolean;
  nome: string;
  descrizione: string;
  prezzo: number;
  categoria: Categoria[];
  aliquotaIVA: number;
  quantita: number;
  esauribile: boolean;
  selectedCategoria: Categoria;
  get calculateDisabled() {
    return (!this.nome || !this.selectedCategoria);
  }


  get footerActions(): DialogFooterActions {
    return  {
      primary: {
        disabled: this.calculateDisabled,
        label: 'Salva',
        command: () => {
          if (this.edit) {
            this.prodottiService.updateProduct({
              id: this.data.id,
              nome: this.nome,
              descrizione: this.descrizione,
              prezzo: this.prezzo,
              categoria: this.selectedCategoria,
              aliquotaIVA: this.aliquotaIVA,
              quantita: this.quantita,
              esauribile: this.esauribile
            }).subscribe(() => {
              this.close();
            });
          } else {
            this.prodottiService.createProduct({
              nome: this.nome,
              descrizione: this.descrizione,
              prezzo: this.prezzo,
              categoria: this.selectedCategoria,
              aliquotaIVA: this.aliquotaIVA,
              quantita: this.quantita,
              esauribile: this.esauribile
            }).subscribe(() => {
              this.close();
            });
          }
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
  constructor(private prodottiService: ProdottiService) {
    super();
  }

  ngOnInit() {
    this.prodottiService.getCategories().subscribe((cat) => this.categoria = cat)
    if (this.data) {
      this.edit = true;
      this.nome = this.data.nome;
      this.descrizione = this.data.descrizione ?? '';
      this.prezzo = this.data.prezzo;
      this.aliquotaIVA = this.data.aliquotaIVA;
      this.quantita = this.data.quantita;
      this.esauribile = this.data.esauribile;
      this.selectedCategoria = this.data.categoria;
    } else {
      this.edit = false;
      this.nome = '';
      this.descrizione = '';
      this.prezzo = 0;
      this.aliquotaIVA = 0;
      this.quantita = 0;
      this.esauribile = false;
    }
  }
}
