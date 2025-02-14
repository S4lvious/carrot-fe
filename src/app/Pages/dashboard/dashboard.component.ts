import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard.service';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: 'dashboard.component.scss',
    standalone: true,
    imports: [ButtonModule, CardModule, ChartModule, TableModule, CommonModule]
})
export class DashboardComponent {
    constructor(
    private dashboardService: DashboardService
    ) {
        
     }

     dashBoardData: any;

    ngOnInit(): void {
        this.dashboardService.getDashboardData().subscribe((data: any) => {
            this.dashBoardData = data;
            console.log(this.dashBoardData);
        });
    }




}