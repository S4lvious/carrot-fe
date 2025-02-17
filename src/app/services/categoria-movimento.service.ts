import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prodotto } from '../models/prodotto.model';
import { Categoria, CategoriaMovimento } from '../models/categoria.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class CategorieMovimentoService {

    private apiUrl = environment.apiUrl + '/categorie/movimenti'; // Replace with your actual API URL

    constructor(private http: HttpClient) { 
    }

    getCategories(): Observable<any> {
        return this.http.get<CategoriaMovimento[]>(`${this.apiUrl}`);
    }

    createCategoria(categoria: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, categoria);
    }

    updateCategoria(categoria: CategoriaMovimento): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, categoria);
    }

    deleteCategoria(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}