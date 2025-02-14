import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { IComponentDialogController } from './utils.type';

@Directive()
export abstract class ComponentDialog {
  @Input() controller: IComponentDialogController = { display: false, onClose() {
      
  }, };
  @Output() onClose = new EventEmitter<any>();

  /**
   * Metodo per chiudere il dialog.
   */
  close(result?: any): void {
    this.onClose.emit(result);
    this.controller.display = false;
    if (this.controller.onClose) {
      this.controller.onClose();
    }
  }
}
