import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DocumentoService } from '../../services/documento.service';
import { ClientiService } from '../../services/clienti.service';
import { OrdiniService } from '../../services/ordine.service';

@Component({
  selector: 'app-archivio-documenti',
  standalone: true,
  imports: [CommonModule, TableModule, DropdownModule, ButtonModule, FormsModule],
  template: `
    <div class="container-md mt-4">
      <h2 class="text-center mb-4">Archivio Documenti</h2>

      <!-- Filtro per Cliente -->
      <div class="d-flex mb-3">
        <p-dropdown
        [showClear]="true"
          [options]="clienti"
          [(ngModel)]="selectedCliente"
          placeholder="Seleziona Cliente"
          [optionLabel]="'nome'"
          [optionValue]="'id'"
          (onChange)="caricaDocumentiPerCliente()"
          class="me-3"
        ></p-dropdown>

        <!-- Filtro per Ordine -->
        <p-dropdown
        [showClear]="true"

          [options]="ordini"
          [(ngModel)]="selectedOrdine"
          [optionLabel]="'numeroOrdine'"
          [optionValue]="'id'"
          placeholder="Seleziona Ordine"
          (onChange)="caricaDocumentiPerOrdine()"
        ></p-dropdown>
      </div>

      <!-- Tabella Documenti -->
      <p-table [value]="documenti" [paginator]="true" [rows]="5" class="mt-3">
        <ng-template pTemplate="header">
          <tr>
            <th>Nome</th>
            <th>Ordine</th>
            <th>Azioni</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-doc>
          <tr>
            <td>{{ doc.nome }}</td>
            <td>{{ doc.ordine?.numeroOrdine }}</td>
            <td>
            <p-button
            [rounded]="true"
            [text]="true"
            icon="pi pi-search"
            size="small"
            (click)="visualizzaDocumento(doc.percorso)">
          </p-button>
          <p-button
            [rounded]="true"
            [text]="true"
            icon="pi pi-trash"
            size="small"
            (click)="deleteDocument(doc.id)">
          </p-button>

            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #343a40;
      }
    `
  ]
})
export class ArchivioDocumentiComponent implements OnInit {
  clienti: any[] = []; // Lista clienti
  ordini: any[] = []; // Lista ordini
  documenti: any[] = []; // Lista documenti

  selectedCliente: any;
  selectedOrdine: any;

  constructor(private documentoService: DocumentoService, private clienteService: ClientiService, private ordiniService: OrdiniService) {}

  ngOnInit(): void {
    this.caricaClienti();
    this.caricaOrdini();
  }

  // 📌 Carica la lista dei clienti
  caricaClienti() { 
    this.clienteService.getClients().subscribe((clients) => {
        this.clienti = clients;
    })
  }
  
  caricaOrdini() {
    this.ordiniService.getProducts().subscribe((orders) => {
        this.ordini = orders;
    })
  }

  // 📌 Carica gli ordini di un cliente selezionato
  caricaDocumentiPerCliente() {
    if (this.selectedCliente) {
      this.documentoService.getDocumentiByCliente(this.selectedCliente).subscribe((docs: any) => {
        this.documenti = docs;
      });
    }
  }

  // 📌 Carica i documenti di un ordine selezionato
  caricaDocumentiPerOrdine() {
    if (this.selectedOrdine) {
      this.documentoService.getDocumentiByOrdine(this.selectedOrdine).subscribe((docs: any) => {
        this.documenti = docs;
      });
    }
  }

  deleteDocument(id: number) {
    this.documentoService.deleteDocument(id).subscribe()
  }

  // 📌 Ottiene il signedUrl e apre il documento
  visualizzaDocumento(percorso: string) {
    this.documentoService.getSignedUrl(percorso).subscribe((response: any) => {
      window.open(response.signedUrl, '_blank');
    });
  }
}
