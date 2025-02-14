import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientiService {

    private apiUrl = environment.apiUrl + '/clienti'

    constructor(private http: HttpClient) { }

    getClients(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getClientById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
    }

    createClient(client: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, client);
    }

    updateClient(client: Cliente): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, client);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}