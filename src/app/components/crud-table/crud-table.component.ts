import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ColumnConfig, CrudTableConfig } from '../../models/crud-table.model';
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

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss'],
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule, ContextMenu, InputTextModule, Select, DatePicker],
})
export class CrudTableComponent {
  @Input() config!: CrudTableConfig;
  @ViewChild('cm') cm: ContextMenu;
  _data: any[] = [];
  @ViewChild('dt', { static: false }) dt!: Table;


  @Input() set data(value: any[]) {
    this._data = value;
  }
  get data(): any[] {
    return this._data;
  }
  dialogStyle = { width: '50vw' };
  menuItems: MenuItem[];

  displayDialog = false;
  selectedItem: any = null;
  actionType: 'add' | 'edit' | null = null;
  get globalFilterFields(): string[] {
    return this.config.columns.map(c => c.field);
  }
  
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
      // Per il dropdown, il valore selezionato è in event.value
      filterValue = event.value;
      this.dt.filter(filterValue, col.field, 'equals');
    } else if (col.type === 'date') {
      // Per il calendario, l'evento restituisce la data selezionata.
      filterValue = event;
      this.dt.filter(filterValue, col.field, 'equals');
    } else if (col.type === 'custom') {
      // Anche qui usiamo il dropdown: il valore selezionato è in event.value.
      filterValue = event.value;
      this.dt.filter(filterValue, col.field, 'equals');
    }
  }

  /**
   * Trasforma un array di valori (stringa o numero) in un array di oggetti
   * compatibile con p-dropdown ({label, value}).
   * @param options Array di valori
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


  ngOnInit() {
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
