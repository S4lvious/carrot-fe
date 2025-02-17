import { Component, Input, OnInit } from '@angular/core';
import { ComponentDialog } from '../../models/component-dialog';
import { DialogFooterActions } from '../../models/utils.type';
import { Categoria } from '../../models/categoria.model';
import { Fattura } from '../../models/fattura.model';
import { PrimaNotaService } from '../../services/prima-nota.service';
import { FatturaService } from '../../services/fattura.service';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CtInputComponent } from '../input/input.component';
import { CategorieService } from '../../services/categoria.service';
import { MetodoPagamento } from '../../models/metodopagamento.model';
import { MetodoPagamentoService } from '../../services/metodopagamento.service';
import { IftaLabel } from 'primeng/iftalabel';
import { BmDialogComponent } from '../dialog/dialog.component';
import { TipoMovimento } from '../../models/tipo-movimento.model';
import { DatePipe } from '@angular/common';
import { Ordine } from '../../models/ordine.model';
import { OrdiniService } from '../../services/ordine.service';
import { CategorieMovimentoService } from '../../services/categoria-movimento.service';

@Component({
  selector: 'app-prima-nota-add-dialog',
  standalone: true,
  imports: [PanelModule, DatePicker, Select, FormsModule, CtInputComponent, IftaLabel, BmDialogComponent],
  templateUrl: 'primanota-add-dialog.component.html',
  providers: [DatePipe],
  styles: []
})
export class PrimaNotaAddDialog extends ComponentDialog implements OnInit {

  dataOperazione: Date = new Date();
  nome: string = '';
  categoria: Categoria;
  metodoPagamento: MetodoPagamento;
  importo: number = 0;
  tipoMovimento: TipoMovimento = TipoMovimento.ENTRATA;
  fattura?: Fattura;
  incarico: Ordine;

    @Input() data: any; // Se presente, significa che stiamo modificando l'ordine
    edit: boolean = false;
  

  categoriaSelect: Categoria[] = [];
  metodoPagamentoSelect: MetodoPagamento[] = [];
  fatturaSelect: Fattura[] = [];
  ordineSelect: Ordine[] = []

  constructor(
    private primaNotaService: PrimaNotaService,
    private categoriaService: CategorieMovimentoService,
    private metodoPagamentoService: MetodoPagamentoService,
    private fatturaService: FatturaService,
    private ordineService: OrdiniService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {

    if (this.data) {
      this.edit =true;
      this.dataOperazione = this.data.dataOperazione;
      this.nome = this.data.nome;
      this.categoria = this.data.categoria;
      this.metodoPagamento = this.data.metodoPagamento;
      this.tipoMovimento = this.data.tipoMovimento;
      this.importo = this.data.importo;
      this.fattura = this.data?.fattura;
      this.incarico = this.data.incaricoId;
    }
    // Caricamento delle categorie
    this.categoriaService.getCategories().subscribe((data) => this.categoriaSelect = data);

    // Caricamento dei metodi di pagamento
    this.metodoPagamentoService.getMetodiPagamento().subscribe((data: MetodoPagamento[]) => this.metodoPagamentoSelect = data);

    // Caricamento delle fatture disponibili
    this.fatturaService.getFatture().subscribe((data) => this.fatturaSelect = data);

    this.ordineService.getProducts().subscribe((data) => this.ordineSelect = data);
  }

  get footerActions(): DialogFooterActions {
    return {
      primary: {
        disabled: this.disabled,
        label: 'Salva',
        command: () => {
          if (this.edit) {
            this.primaNotaService.updatePrimaNota(this.data.id,{
              dataOperazione: this.dataOperazione,
              nome: this.nome,
              categoria: this.categoria,
              metodoPagamento: this.metodoPagamento,
              importo: this.importo,
              tipoMovimento: this.tipoMovimento,
              fattura: this.fattura,
              incaricoId: this.incarico.id  
            }).subscribe(() => {
              this.close();
            })
          } else {
            this.primaNotaService.createPrimaNota({
              dataOperazione: this.dataOperazione,
              nome: this.nome,
              categoria: this.categoria,
              metodoPagamento: this.metodoPagamento,
              importo: this.importo,
              tipoMovimento: this.tipoMovimento,
              fattura: this.fattura,
              incaricoId: this.incarico.id
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

  public get disabled() {
    return !this.nome || !this.categoria || !this.metodoPagamento || !this.importo;
  }
}
