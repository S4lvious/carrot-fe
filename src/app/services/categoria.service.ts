import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prodotto } from '../models/prodotto.model';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class CategorieService {

    private apiUrl = environment.apiUrl + '/categorie'; // Replace with your actual API URL

    constructor(private http: HttpClient) { }

    getCategories(): Observable<any> {
        return this.http.get<Categoria[]>(`${this.apiUrl}`);
    }

    createCategoria(categoria: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, categoria);
    }

    updateCategoria(categoria: Categoria): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, categoria);
    }

    deleteCategoria(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}