import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BmDialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { DialogFooterActions } from '../../models/utils.type';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [BmDialogComponent, CommonModule, ButtonModule],
  template: `
    <ct-dialog [title]="title" [closable]="false" [size]="'small'" (onClose)="handleOnClose($event)">
      <div class="p-3 text-center">
        <p *ngIf="message">{{ message }}</p>
        <div class="mt-3">
            <p-button class="mx-2" (click)="confirm()">{{ primary }}</p-button>
            <p-button class="mx-2" [severity]="'secondary'"(click)="cancel()">{{ secondary }}</p-button>
        </div>
      </div>
    </ct-dialog>
  `
})
export class ConfirmDialogComponent {
  // Proprietà separate
  @Input() title: string = 'Conferma';
  @Input() primary: string = 'Conferma';
  @Input() secondary: string = 'Annulla';
  @Input() message: string = '';

  // Setter per data
  @Input() set data(value: any) {
    if (value) {
      if (value.title !== undefined) { this.title = value.title; }
      if (value.message !== undefined) { this.message = value.message; }
      if (value.primary !== undefined) { this.primary = value.primary; }
      if (value.secondary !== undefined) { this.secondary = value.secondary; }
      // Puoi gestire altri campi se necessario
    }
  }

  footerActions: DialogFooterActions = {
    primary: {
        label: 'Conferma',
        command:() => this.confirm()
    },
    secondary: {
        label: 'Annulla',
        command:() => this.cancel()
    }
  }


  @Output() onClose = new EventEmitter<{ confirmed: boolean }>();

  confirm(): void {
    this.onClose.emit({ confirmed: true });
  }

  cancel(): void {
    this.onClose.emit({ confirmed: false });
  }

  handleOnClose(event: any): void {
    this.onClose.emit({ confirmed: false });
  }
}
