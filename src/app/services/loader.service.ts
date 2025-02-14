import {
    Injectable,
    ComponentFactoryResolver,
    Injector,
    ComponentRef,
    ViewContainerRef,
    Type
  } from '@angular/core';
  import { map, take } from 'rxjs/operators';
  
  import { ComponentHostDirective } from '../directives/component-host.directive';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { from, Observable } from 'rxjs';
  
  @Injectable(
    {
      providedIn: 'root'
    }
  )
  export class ComponentLoaderService {
  
    private viewContainerRef!: ViewContainerRef;
  
    constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private injector: Injector
    ) {}
  
    /**
     * Inizializza il servizio passandogli la direttiva con il ViewContainerRef
     */
    public init(host: ComponentHostDirective) {
      this.viewContainerRef = host.viewContainerRef;
    }
  
    public confirm<T = void>(data: {
      title?: string;
      message?: string;
      primary?: string;
      secondary?: string;
      // Opzionalmente puoi estendere con altri campi se necessario
    }): Observable<any> {
      return from(
        this.load(ConfirmDialogComponent, { ...data, dialogType: 'confirm' })
      ).pipe(
        map((res: any) => res.output ?? res) // Se il ConfirmDialogComponent emette un oggetto, ad esempio { confirmed: true }
      );
    }

  
  
    public load<T extends object>(component: Type<T>, data?: any): Promise<any> {
      if (!this.viewContainerRef) {
        console.error('ComponentLoaderService: viewContainerRef non inizializzato');
        return Promise.resolve(null);
      }
  
      // 1) Risolviamo la factory
      const factory = this.componentFactoryResolver.resolveComponentFactory(component);
  
      // 2) Creiamo il componente
      const compRef = this.viewContainerRef.createComponent(factory, 0, this.injector);
  
      // 3) Se esiste una property `data`, la impostiamo
      if ('data' in compRef.instance) {
        (compRef.instance as any).data = data;
      }
  
      // 4) Se esiste un `onClose` (EventEmitter), costruiamo una Promise
      if ('onClose' in compRef.instance) {
        const onClose$ = (compRef.instance as any).onClose;
        return new Promise<any>((resolve) => {
          onClose$.pipe(take(1)).subscribe((result: any) => {
            resolve(result);
            compRef.destroy();
          });
        });
      }
  
      // Se non c'è onClose, restituiamo promise risolta
      return Promise.resolve(null);
    }
  }
  