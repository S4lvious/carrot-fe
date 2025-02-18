import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopBarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  @Input() sidebarChiusa: boolean
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);

  }

  editUser() {
    this.router.navigate(['/utente'])
  }
}
