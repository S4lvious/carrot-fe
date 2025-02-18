// src/app/components/loader/loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader-component.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true, // Se stai usando standalone components
  imports: [CommonModule, ProgressSpinnerModule ],
  template: `
    <div *ngIf="loading$ | async" class="loader-overlay">
      <div class="loader"></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loading$;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$; // Inizializzazione nel costruttore
  }
}
