import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { DialogFooterActions, DialogSize } from '../../models/utils.type';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ComponentDialog } from '../../models/component-dialog';

@Component({
  selector: 'ct-dialog',

  standalone:true,
  imports: [Dialog, CommonModule, ButtonModule],
  styleUrl: 'dialog.component.scss',
  template: `
    <p-dialog
      [(visible)]="controller.display"
      [closable]="closable"
      [modal]="true"
      [resizable]="false"
      [header]="title"
      (onHide)="handleOnHide()"
      [styleClass]="dialogStyleClass"
    >
      <ng-content></ng-content>
    <div class="footer-buttons" *ngIf="footerActions">
      <div class="buttons-right">
        <p-button
        *ngIf="footerActions.secondary"
          [label]="footerActions.secondary.label"
          severity="secondary"
          variant="outlined"
          (click)="footerActions.secondary.command()"
          [disabled]="getDisabled(footerActions.secondary.disabled)"
          >
        </p-button>
        <p-button
        *ngIf="footerActions.primary"
          [label]="footerActions.primary.label"
          (click)="footerActions.primary.command()"
          [disabled]="getDisabled(footerActions.primary.disabled)"
          >
        </p-button>
      </div>
    </div>

    </p-dialog>
  `
})
export class BmDialogComponent extends ComponentDialog {

  @Input() title = 'Titolo Dialog';
  @Input() footerActions: DialogFooterActions;
  @Input() closable = true;
  @Input() size: DialogSize = 'small';

  getDisabled(disabledProp: boolean | (() => boolean) | undefined): boolean {
    // Se disabledProp è una funzione, la invoca e restituisce il risultato,
    // altrimenti restituisce il valore (o false se undefined)
    return typeof disabledProp === 'function' ? disabledProp() : (disabledProp ?? false);
  }
    
  public get dialogStyleClass() {
    let classes = 'carrot-simple-dialog carrot-dialog-'+this.size;
    return classes;
  }


  ngOnInit() {
    console.log(this.footerActions)
    this.controller.display = true;
  }
  handleOnHide() {
    this.onClose.emit(true);
  }
}
