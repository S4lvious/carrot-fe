import { Component } from '@angular/core';
import { mergeMap, of } from 'rxjs';
import { CrudTableComponent } from '../../components/crud-table/crud-table.component';
import { PrimaNota } from '../../models/primanota.model';
import { CrudTableConfig } from '../../models/crud-table.model';
import { PrimaNotaAddDialog } from '../../components/primanota-add-dialog/primanota-add-dialog.component';
import { PrimaNotaService } from '../../services/prima-nota.service';
import { ComponentLoaderService } from '../../services/loader.service';
import { ChartModule } from 'primeng/chart';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-prima-nota',
  templateUrl: './contabilita.component.html',
  imports: [CrudTableComponent, ChartModule, Card]
})
export class PrimaNotaComponent {

  public primaNota: PrimaNota[] = [];
  public chartEntrateUscite: any;
  public chartSaldoMensile: any;
  public chartDistribuzioneEntrate: any;
  public chartDistribuzioneUscite: any;
  public chartProdottiPiuCostosi: any
  public chartRapportoEntrateUscite: any

  public config: CrudTableConfig = {
    title: 'Prima Nota',
    addButtonText: 'Aggiungi Operazione',
    columns: [
      { field: 'primaNota.id', header: 'ID', filter: true, type: 'text' },
      { field: 'primaNota.dataOperazione', header: 'Data Operazione', filter: true, type: 'date' },
      { field: 'primaNota.nome', header: 'Nome', filter: true, type: 'text' },
      { field: 'primaNota.categoria.nome', header: 'Categoria', filter: true, type: 'text' },
      { field: 'primaNota.metodoPagamento.nome', header: 'Metodo di Pagamento', filter: true, type: 'text' },
      { field: 'primaNota.importo', header: 'Importo', filter: true, type: 'text' },
      { field: 'primaNota.tipoMovimento', header: 'Tipo Movimento', filter: true, type: 'custom', props: ["ENTRATA", "USCITA"] },
      { field: 'primaNota.fattura.numeroFattura', header: 'Fattura Associata', filter: true, type: 'text' },
      { field: 'incarico.numeroOrdine', header: 'Incarico Associato', filter: true, type: 'text'}
    ],
    actionButtons: [
      { name: 'delete', label: 'Elimina', icon: 'pi pi-trash', class: 'p-button-danger' },
      { name: 'edit', label:'Modifica', icon:'pi pi-pencil', class: 'p-button-danger'}
    ],
    actions: {
      add: () =>
        this._loaderService
          .load(PrimaNotaAddDialog)
          .then(() => { 
            this._primaNotaService.getPrimaNota().subscribe((data: PrimaNota[] | null) => { if (data) { this.primaNota = data; } })
            this.loadDashboardData()
          }
          ),
          edit: (item: any) =>
            this._loaderService
              .load(PrimaNotaAddDialog, item.primaNota)
              .then(() => { 
                this._primaNotaService.getPrimaNota().subscribe((data: PrimaNota[] | null) => { if (data) { this.primaNota = data; } })
                this.loadDashboardData()
              }
              ),
    
      delete: (item: { primaNota: any; }) =>
        this._loaderService
          .confirm({
            title: 'Vuoi davvero eliminare questa operazione?',
            primary: 'Conferma',
            secondary: 'Annulla'
          })
          .pipe(
            mergeMap((result: any) => {
              if (result?.confirmed) {
                this.loadDashboardData()
                return this._primaNotaService.deletePrimaNota(item.primaNota.id).pipe(
                  mergeMap(() => this._primaNotaService.getPrimaNota())
                );
              } else {
                return of(null);
              }
            })
          )
          .subscribe((data: PrimaNota[] | null) => {
            if (data) {
              this.primaNota = data;
            }
          })
    }
  };

  constructor(
    private _primaNotaService: PrimaNotaService,
    private _loaderService: ComponentLoaderService
  ) {}

  ngOnInit() {
    this._primaNotaService.getPrimaNota().subscribe((data: PrimaNota[]) => {
      this.primaNota = data;
    });

    // Caricare dati per i grafici
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Entrate vs Uscite
    this._primaNotaService.getTotaleEntrateUscite()
      .subscribe((data) => {
        this.chartEntrateUscite = {
          labels: ['Entrate', 'Uscite'],
          datasets: [{
            data: [data.entrate, data.uscite],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        };
      });

    // Saldo Mensile
    this._primaNotaService.getSaldoMensile()
      .subscribe((data) => {
        this.chartSaldoMensile = {
          labels: data.map((m: any) => m.mese),
          datasets: [
            { label: 'Entrate', data: data.map(m => m.entrate), borderColor: '#28a745' },
            { label: 'Uscite', data: data.map(m => m.uscite), borderColor: '#dc3545' },
            { label: 'Saldo', data: data.map(m => m.saldo), borderColor: '#007bff' }
          ]
        };
      });

    // Distribuzione Entrate per Categoria
    this._primaNotaService.getDistribuzioneCategorie('ENTRATA')
      .subscribe((data) => {
        this.chartDistribuzioneEntrate = {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
          }]
        };
      });

    // Distribuzione Uscite per Categoria
    this._primaNotaService.getDistribuzioneCategorie('USCITA')
      .subscribe((data) => {
        this.chartDistribuzioneUscite = {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
          }]
        };
      });

      this._primaNotaService.getProdottiPiuCostosiInUscite().subscribe((data) => {
        this.chartProdottiPiuCostosi = {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        };
      });
          this._primaNotaService.getProdottiConRapportoEntrateUscite().subscribe((data) => {
        this.chartRapportoEntrateUscite = {
            labels: Object.keys(data),
            datasets: [
                {
                    label: 'Rapporto Entrate/Uscite',
                    data: Object.values(data),
                    backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8']
                }
            ]
        };
    });

  }
}