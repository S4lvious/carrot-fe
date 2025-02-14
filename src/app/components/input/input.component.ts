import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { CtTooltipInfo, InputType, InputViewType, Size, TagColor } from '../../models/utils.type';
import { PrimeIcons } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ct-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [FormsModule, InputIconModule, InputTextModule, CommonModule]
})
export class CtInputComponent {

  public settedName: string = '';
  private _name: string = '';
  @Input() set name(name: string) {
    this._name = name;
    if (name && !name.startsWith('__')) {
      this.settedName = name;
    }
  }
  public get name() {
    return this._name;
  }
  @Input() ctModel!: string | number | null;
  @Output() ctModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() required: boolean = false;
  @Input() type: InputType = 'text';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() view: InputViewType = 'default';
  @Input() helperText: string = '';
  @Input() upperCaseNoSpaceInput: boolean = false;
  @Input() showClear: boolean = false;
  @Input() maxLength: number = 255;
  @Input() showClearIfDisabled: boolean = false;
  @Input() size: Size = 'large';

  /** Mostra 🟢🔵🔴🟡 al posto dell'icona */
  @Input() tag!: TagColor;

  /** Oggetto per gestire il tooltip sull'input (necessario per tooltip che appare al focus) */
  @Input() tooltipInfo!: CtTooltipInfo;

  @Input() icon!: PrimeIcons;  /** Imposta la corretta visualizzazione di un'icona cliccabile */
  @Input() iconClickable: boolean = false;
  /** Viene emesso al click dell'icona, se l'input non è disabilitato */
  @Output() iconClick: EventEmitter<void> = new EventEmitter<void>();

  /** Icona principale, da usare invece di impostare gli input singolarmente */
  @Input() primaryIcon!: PrimeIcons;

  /** Icona secondaria, visibile solo in "viewOnly" */
  @Input() secondaryIcon!: PrimeIcons;


  @Input() set placeholder(placeholder: string) {
    this._placeholder = placeholder;
  }
  public get placeholder() {
    if (this._placeholder && this._placeholder !== '') {
      return this._placeholder;
    }
    return this.view === 'viewOnly' ? '' : 'Inserisci';
  }
  private _placeholder!: string;

  public showClearToolTip: string = 'Rimuove definitivamente il dato inserito'

  
  public isInvalid: boolean = false;
  

  constructor(
  ) { }

  public emitValue(event: string | number | null) {
    this.ctModelChange.emit(this.type === 'number' ? (event?.toString().length === 0 ? null : +event!) : event);
  }


  public clear() {
    this.ctModel = null;
    this.ctModelChange.emit(null);
  }

  public onIconClick() {
    if (!this.disabled) {
      this.iconClick.emit();
    }
  }
}
