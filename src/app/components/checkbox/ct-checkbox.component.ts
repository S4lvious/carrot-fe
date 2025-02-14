import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch'
@Component({
  selector: 'ct-checkbox',
  templateUrl: './ct-checkbox.component.html',
  styleUrls: ['./ct-checkbox.component.scss'],
  standalone: true,
  imports: [InputSwitchModule, FormsModule, CommonModule]
})
export class CtCheckboxComponent {
  // Testo da mostrare accanto al controllo.
  @Input() label: string = '';

  // Se non viene passata label, viene usato questo nome (es. tradotto da pipe)
  @Input() settedName: string = '';

  // Testo di aiuto opzionale.
  @Input() helperText: string = '';

  // Stato disabilitato.
  @Input() disabled: boolean = false;

  // Se true, la label viene mostrata in bold.
  @Input() bold: boolean = false;

  // Dimensione del controllo ('small' oppure 'default').
  @Input() size: 'small' | 'default' = 'default';

  // Se true, aggiunge una classe per lo sfondo.
  @Input() background: boolean = false;

  // Se true, aggiunge una classe per il margin.
  @Input() margin: boolean = false;

  // Nome da associare all'input hidden.
  @Input() name: string = '';

  // Valore del modello, gestito via two-way binding.
  @Input() bmModel: boolean = false;
  @Output() bmModelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Gestione del click sul p-inputSwitch.
  onClick(event: MouseEvent): void {
    // Impedisci la propagazione, se necessario.
    event.stopPropagation();
  }
}
