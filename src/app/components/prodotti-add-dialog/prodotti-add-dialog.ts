import { Component, Input } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { DialogFooterActions } from '../../models/utils.type';
import { ComponentDialog } from '../../models/component-dialog';
import { ProdottiService } from '../../services/prodotti.service';
import { Categoria } from '../../models/categoria.model';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CategorieService } from '../../services/categoria.service';
import { Checkbox } from 'primeng/checkbox';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CtCheckboxComponent } from "../checkbox/ct-checkbox.component";
import { CtInputComponent } from "../input/input.component";
import { InputTextModule } from 'primeng/inputtext';
import { Prodotto } from '../../models/prodotto.model';

@Component({
  selector: 'app-prodotti-add-dialog',
  standalone: true,
  imports: [
    BmDialogComponent, PanelModule, TableModule, ButtonModule, InputTextModule,
    CtInputComponent, FormsModule, ToggleButtonModule, IftaLabelModule, DatePicker,
    Select, CtCheckboxComponent
  ],
  templateUrl: './prodotti-add-dialog.component.html',
  styles: []
})
export class ProdottiAddDialogComponent extends ComponentDialog {
  

  @Input() data: any;
  // Campi base
  id?: number;
  nome: string = "";
  descrizione: string = "";
  prezzo: number = 0;
  selectedCategoria: Categoria | null = null;
  categoria: Categoria[] = [];  // da caricare
  aliquotaIVA: number = 22;
  quantita: number = 0;
  esauribile: boolean = false;

  // Nuovi campi fattura elettronica
  codiceTipo: string = "";
  codiceValore: string = "";
  unitaMisura: string = "";
  natura: string = "";
  esigibilitaIVA: string = "";

  // Opzioni di select
  codiceTipoOptions = [ "EAN", "SKU", "ALTRO" ];
  unitaMisuraOptions = [ "NR", "PZ", "KG", "LT" ];
  naturaOptions = [ "N1", "N2", "N3", "N4", "N5" ];
  esigibilitaIVAOptions = [ "I", "D", "S" ]; // immediata, differita, scissione?

  constructor(
    private prodottiService: ProdottiService,
    private categorieService: CategorieService
  ) {
    super();
  }

  ngOnInit() {
    // Se stiamo modificando un prodotto esistente, i campi ci vengono passati in `data`
    if (this.data) {
      const prod: any = this.data;
      this.id = prod.id;
      this.nome = prod.nome;
      this.descrizione = prod.descrizione;
      this.prezzo = prod.prezzo;
      this.selectedCategoria = prod.categoria || null;
      this.aliquotaIVA = prod.aliquotaIVA ? prod.aliquotaIVA.toNumber() : 22; // cast se serve
      this.quantita = prod.quantita;
      this.esauribile = prod.esauribile;

      // Campi nuovi
      this.codiceTipo = prod.codiceTipo || "";
      this.codiceValore = prod.codiceValore || "";
      this.unitaMisura = prod.unitaMisura || "";
      this.natura = prod.natura || "";
      this.esigibilitaIVA = prod.esigibilitaIVA || "";
    }

    // Carica la lista categorie
    this.categorieService.getCategories().subscribe((cats) => {
      this.categoria = cats;
      // Se selectedCategoria ha un id, potresti reimpostarlo
    });
  }

  get footerActions(): DialogFooterActions {
    return {
      primary: {
        label: 'Salva',
        command: () => this.salvaProdotto()
      },
      secondary: {
        label: 'Annulla',
        command: () => this.close()
      }
    };
  }

  salvaProdotto() {
    // Crea un oggetto Prodotto da inviare al servizio
    const prodottoToSave: any = {
      id: this.id || 0,
      nome: this.nome,
      descrizione: this.descrizione,
      prezzo: this.prezzo,
      categoria: this.selectedCategoria || undefined,
      aliquotaIVA: this.aliquotaIVA,
      quantita: this.quantita,
      esauribile: this.esauribile,
      codiceTipo: this.codiceTipo,
      codiceValore: this.codiceValore,
      unitaMisura: this.unitaMisura,
      natura: this.natura,
      esigibilitaIVA: this.esigibilitaIVA
    };

    // Decide se creare o aggiornare
    if (!this.id) {
      // Creazione
      this.prodottiService.createProduct(prodottoToSave).subscribe(() => {
        this.close();
      });
    } else {
      // Aggiornamento
      this.prodottiService.updateProduct(prodottoToSave).subscribe(() => {
        this.close();
      });
    }
  }
}
