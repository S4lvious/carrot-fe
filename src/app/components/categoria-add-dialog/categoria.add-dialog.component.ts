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
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-prodotti-add-dialog',
  standalone: true,
  imports: [BmDialogComponent, InputTextModule, CtInputComponent, FormsModule, ToggleButtonModule, PanelModule],
  templateUrl: 'categoria-add-dialog.component.html',
  styles: []
})
export class CategorieAddDialogComponent extends ComponentDialog {

  @Input() data: Prodotto;
  edit: boolean;
  nome: string;
  footerActions: DialogFooterActions = {
    primary: {
      label: 'Salva',
      command: () => {
        if (this.edit) {
          this.prodottiService.updateCategoria({
            id: this.data.id,
            nome: this.nome,
          }).subscribe(() => {
            this.close();
          });
        } else {
          this.prodottiService.createCategoria({
            nome: this.nome,
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

  constructor(private prodottiService: CategorieService) {
    super();
  }

  ngOnInit() {
    if (this.data) {
        this.edit = true
      this.nome = this.data.nome;
    } else {
        this.edit = false;
      this.nome = '';
    }
  }
}
