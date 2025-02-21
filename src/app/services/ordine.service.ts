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

    getDocumentsByOrdine(ordineId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${ordineId}/documenti`);
    }
    
    getOrdiniNonFatturati(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/unfattured`);
    }

    generaFatturaDaOrdine(
        fatturaBody: fatturaDaOrdine
    ): Observable<any> {
        return this.http.post<any>(this.fatture + '/genera', fatturaBody)
    }

    createOrdine(ordineData: Ordine, documenti?: File[]): Observable<any> {
        const formData = new FormData();

        // ✅ Convertiamo l'ordine in un JSON e lo aggiungiamo come un Blob
        formData.append('ordineData', new Blob([JSON.stringify(ordineData)], { type: 'application/json' }));
    
        // ✅ Aggiungiamo i documenti, se presenti
        if (documenti && documenti.length > 0) {
            documenti.forEach(file => {
                formData.append('documenti', file);
            });
        }
        return this.http.post<any>(`${this.apiUrl}`, formData);
    }

    updateOrdine(ordine: Ordine, documenti?: File[]): Observable<any> {
        const formData = new FormData();
    
        // Aggiungiamo l'oggetto Ordine come JSON
        formData.append('ordineData', new Blob([JSON.stringify(ordine)], { type: 'application/json' }));
    
        // Se ci sono documenti, li aggiungiamo al FormData
        if (documenti && documenti.length > 0) {
            documenti.forEach(file => {
                formData.append('documenti', file);
            });
        }
    
        return this.http.put<any>(`${this.apiUrl}/${ordine.id}`, formData);
    }
        deleteProduct(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}