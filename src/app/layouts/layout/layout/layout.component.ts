import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../topbar/topbar/topbar.component';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ComponentLoaderService } from '../../../services/loader.service';
import { ComponentHostDirective } from '../../../directives/component-host.directive';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TopBarComponent, SidebarComponent, RouterModule, ComponentHostDirective, ToastModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild(ComponentHostDirective, { static: true })
  hostDirective!: ComponentHostDirective;

  constructor(
    private loaderService: ComponentLoaderService
  ) {

  }
  sidebarVisible = false;

  ngOnInit() {
    this.loaderService.init(this.hostDirective);
  }



  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
