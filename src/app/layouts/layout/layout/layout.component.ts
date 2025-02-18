import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../topbar/topbar/topbar.component';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ComponentLoaderService } from '../../../services/loader.service';
import { ComponentHostDirective } from '../../../directives/component-host.directive';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from "../../../components/loader/loader.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TopBarComponent, SidebarComponent, RouterModule, ComponentHostDirective, ToastModule, LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild(ComponentHostDirective, { static: true })
  hostDirective!: ComponentHostDirective;

  sidebarCollapsed = false;

  constructor(private loaderService: ComponentLoaderService) {}
  
  

  ngOnInit() {
    this.loaderService.init(this.hostDirective);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
