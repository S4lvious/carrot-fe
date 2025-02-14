import { Component, Input, OnInit } from '@angular/core';
import { Ordine } from '../../models/ordine.model';
import { ComponentDialog } from '../../models/component-dialog';
import { Cliente } from '../../models/cliente.model';
import { Prodotto } from '../../models/prodotto.model';
import { DialogFooterActions } from '../../models/utils.type';
import { OrdiniService } from '../../services/ordine.service';
import { ProdottiService } from '../../services/prodotti.service';
import { BmDialogComponent } from '../dialog/dialog.component';
import { CtInputComponent } from '../input/input.component';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ClientiService } from '../../services/clienti.service';
import { TableModule } from 'primeng/table';
import { FloatLabelModule } from 'primeng/floatlabel';

interface DettaglioOrdineInput {
  id?: number;
  prodotto: Prodotto;
  quantita: number;
  prezzoUnitario: number;
}

@Component({
  selector: 'app-ordini-add-dialog',
  templateUrl: './ordine-add-dialog.component.html',
  standalone: true,
  imports: [BmDialogComponent, CtInputComponent, Select, DatePicker, FormsModule, ButtonModule, CommonModule, TableModule, FloatLabelModule]
})
export class OrdiniAddDialogComponent extends ComponentDialog implements OnInit {

  @Input() data: any; // Se presente, significa che stiamo modificando l'ordine
  edit: boolean = false;

  // Campi per l'ordine
  selectedCliente: Cliente;
  dataOrdine: Date; // Gestito come oggetto Date (PrimeNG p-calendar lavora con Date)
  stato: string = '';
  fatturato: boolean = false;

  // Lista dei dettagli dell'ordine
  orderDetails: DettaglioOrdineInput[] = [];

  // Campi per inserire un nuovo dettaglio
  selectedProdotto: Prodotto | null;
  dettaglioQuantita: number;

  // Liste per i select (vanno caricate tramite un servizio)
  clientiList: Cliente[] = [];
  prodottiList: Prodotto[] = [];

  // Flag per mostrare/nascondere la dialog
  display: boolean = true;

  // Azioni del footer
  footerActions: DialogFooterActions = {
    primary: {
      label: 'Salva',
      command: () => {
        const ordine: any = {
          cliente: this.selectedCliente,
          dataOrdine: this.dataOrdine,
          totale: this.calculateTotale(),
          fatturato: this.fatturato,
          stato: this.stato,
          dettagliOrdine: this.orderDetails.map(d => ({
            prodotto: d.prodotto,
            quantita: d.quantita,
            prezzoUnitario: d.prezzoUnitario
          }))
        };

        if (this.edit) {
          ordine.id = this.data.id;
          this.ordiniService.updateOrdine(ordine).subscribe(() => this.close());
        } else {
          this.ordiniService.createOrdine(ordine).subscribe(() => this.close());
        }
      }
    },
    secondary: {
      label: 'Annulla',
      command: () => this.close()
    }
  };

  constructor(private ordiniService: OrdiniService, private productService: ProdottiService, private clienteService: ClientiService) {
    super();
  }

  ngOnInit() {
    // Carica le liste dei clienti e dei prodotti (adattare ai metodi del tuo service)
    this.clienteService.getClients().subscribe(cli => this.clientiList = cli);
    this.productService.getProducts().subscribe(prod => this.prodottiList = prod);
    console.log(this.data)
    if (this.data) {
      this.edit = true;
      this.selectedCliente = this.data.cliente;
      this.dataOrdine = new Date(this.data.dataOrdine);
      this.fatturato = this.data.fatturato;
      this.stato = this.data.stato;
      this.orderDetails = this.data.dettagliOrdine.map((d: any) => ({
        id: d.id,
        prodotto: d.prodotto,
        quantita: d.quantita,
        prezzoUnitario: Number(d.prezzoUnitario)
      }));
    } else {
      this.dataOrdine = new Date();
      this.stato = "In corso"
    }
  }

  addDettaglio(): void {
    // Verifica che sia stato selezionato un prodotto
    if (!this.selectedProdotto) {
      console.error("Nessun prodotto selezionato");
      return;
    }
  
    // Converte la quantità in numero
    const quantita = Number(this.dettaglioQuantita);
    if (isNaN(quantita) || quantita <= 0) {
      console.error("Inserire una quantità valida maggiore di zero!");
      return;
    }
    
    // Converte il prezzo unitario del prodotto in numero
    const prezzoUnitario = Number(this.selectedProdotto.prezzo);
    if (isNaN(prezzoUnitario)) {
      console.error("Il prezzo del prodotto non è un numero valido:", this.selectedProdotto.prezzo);
      return;
    }
    
    // Cerca se il prodotto è già presente nei dettagli (confronto per id)
    const existingDetail = this.orderDetails.find(detail => detail.prodotto.id === this.selectedProdotto?.id);
    if (existingDetail) {
      // Se esiste, somma la quantità (forzando la conversione a numero)
      existingDetail.quantita = Number(existingDetail.quantita) + quantita;
    } else {
      // Se non esiste, aggiunge un nuovo dettaglio
      this.orderDetails.push({
        prodotto: this.selectedProdotto,
        quantita: quantita,
        prezzoUnitario: prezzoUnitario
      });
    }
    
    // (Opzionale) Puoi aggiornare il totale chiamando il metodo calculateTotale()
    // this.totale = this.calculateTotale();
    
    // Resetta i campi per il prossimo inserimento
    this.selectedProdotto = null;
    this.dettaglioQuantita = 0;
  }

  removeDettaglio(index: number): void {
    this.orderDetails.splice(index, 1);
  }

  calculateTotale(): number {
    return this.orderDetails.reduce((sum, d) => {
      return sum + (Number(d.prezzoUnitario) * Number(d.quantita));
    }, 0);
  }
  
}
