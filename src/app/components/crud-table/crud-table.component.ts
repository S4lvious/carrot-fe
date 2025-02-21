import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Dropdown } from 'primeng/dropdown';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';

import { CrudTableConfig, ColumnConfig } from '../../models/crud-table.model';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ContextMenu,
    InputTextModule,
    Select,
    DatePicker,
    MultiSelectModule,
  ],
})
export class CrudTableComponent {
  @Input() config!: CrudTableConfig;

  @ViewChild('cm') cm: ContextMenu;
  @ViewChild('dt', { static: false }) dt!: Table;

  /** Dati effettivi (righe della tabella) */
  _data: any[] = [];
  @Input() set data(value: any[]) {
    this._data = value;
  }
  get data(): any[] {
    return this._data;
  }

  /** Colonne correntemente selezionate (mostrate in tabella) */
  selectedColumns: ColumnConfig[] = [];

  /** Stile di esempio per un eventuale dialog */
  dialogStyle = { width: '50vw' };

  /** Voci del context menu */
  menuItems: MenuItem[];

  /** Stato del dialog (se lo usi) */
  displayDialog = false;
  selectedItem: any = null;
  actionType: 'add' | 'edit' | null = null;

  /** Filtri globali: usiamo i field delle colonne selezionate */
  get globalFilterFields(): string[] {
    return this.selectedColumns.map(c => c.field);
  }

  /** Ritorna un valore annidato (ad es. 'ordine.numeroOrdine') */
  getNestedValue(item: any, field: string): any {
    if (!item || !field) return null;
    return field.split('.').reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, item);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onColumnFilter(event: any, col: ColumnConfig): void {
    let filterValue: any;
    if (col.type === 'text') {
      filterValue = event.target.value;
      this.dt.filter(filterValue, col.field, 'contains');
    } else if (col.type === 'boolean') {
      filterValue = event.value;
      this.dt.filter(filterValue, col.field, 'equals');
    } else if (col.type === 'date') {
      filterValue = event;
      this.dt.filter(filterValue, col.field, 'equals');
    } else if (col.type === 'custom') {
      filterValue = event.value;
      this.dt.filter(filterValue, col.field, 'equals');
    } else {
      // fallback su text
      filterValue = event.target.value;
      this.dt.filter(filterValue, col.field, 'contains');
    }
  }

  /**
   * Trasforma un array di valori in un array di oggetti compatibile con p-dropdown (label/value).
   */
  getCustomOptions(options: Array<string | number> | undefined): Array<{ label: string, value: string | number }> {
    if (!options) {
      return [];
    }
    return options.map(opt => ({
      label: opt.toString(),
      value: opt
    }));
  }

  booleanOptions = [
    { label: 'Tutti', value: null },
    { label: 'Vero', value: true },
    { label: 'Falso', value: false }
  ];

  formatDate(value: any): string {
    if (!value) return '';
    
    // Controlla se è un formato ISO 8601
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      const date = new Date(value);
      return date.toLocaleDateString('it-IT'); // Formato DD/MM/YYYY
    }
  
    return value;
  }
  

  ngOnInit() {
    // Inizializza le colonne selezionate in base a defaultSelected
    if (!this.config.defaultSelected || this.config.defaultSelected.length === 0) {
      // Nessuna colonna specificata: selezioniamo TUTTE le colonne
      this.selectedColumns = [...this.config.columns];
    } else {
      // Seleziona solo le colonne il cui field è incluso in defaultSelected
      this.selectedColumns = this.config.columns.filter(col =>
        this.config.defaultSelected?.includes(col.field)
      );
    }

    // Mappiamo le azioni di config.actionButtons in un modello compatibile con il context menu
    this.menuItems = this.config.actionButtons.map(action => ({
      label: action.label,
      icon: action.icon,
      command: () => {
        this.handleAction(action.name, this.selectedItem);
      }
    }));
  }

  onContextMenu(event: MouseEvent, item: any) {
    this.selectedItem = item; // Imposta l'elemento corrente
    this.cm.show(event);      // Mostra il context menu
  }

  handleAction(action: string, item?: any) {
    this.config.actions[action](item);
  }
}
