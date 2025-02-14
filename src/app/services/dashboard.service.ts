import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private baseUrl = environment.apiUrl  // Adjust the API base URL as needed

    constructor(private http: HttpClient) {}

    getDashboardData(): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/dashboard`);
    }
}