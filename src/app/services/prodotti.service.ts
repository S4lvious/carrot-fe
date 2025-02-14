import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Prodotto } from '../models/prodotto.model';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class ProdottiService {

    private apiUrl = environment.apiUrl + '/prodotti';
    private categorie = environment.apiUrl + '/categorie'

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getCategories() : Observable<any> {
        return this.http.get<Categoria[]>(this.categorie)
    }

    createProduct(client: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, client);
    }

    updateProduct(prodotto: Prodotto): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, prodotto);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}