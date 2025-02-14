import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Prodotto } from '../models/prodotto.model';
import { Categoria } from '../models/categoria.model';
import { Ordine } from '../models/ordine.model';
import { fatturaDaOrdine } from '../models/fattura.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdiniService {

    private apiUrl = environment.apiUrl + '/ordini'; // Replace with your actual API URL
    private fatture = environment.apiUrl + '/fatture'

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getOrdiniNonFatturati(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/unfattured`);
    }

    generaFatturaDaOrdine(
        fatturaBody: fatturaDaOrdine
    ): Observable<any> {
        return this.http.post<any>(this.fatture + '/genera', fatturaBody)
    }

    createOrdine(client: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, client);
    }

    updateOrdine(ordine: Ordine): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${ordine.id}`, ordine);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}