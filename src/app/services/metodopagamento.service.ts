import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { MetodoPagamento } from '../models/metodopagamento.model';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagamentoService {

  private apiUrl = environment.apiUrl + '/metodo-pagamento';

  constructor(private http: HttpClient) {}

  // Recupera tutti i metodi di pagamento dell'utente autenticato
  getMetodiPagamento(): Observable<MetodoPagamento[]> {
    return this.http.get<MetodoPagamento[]>(this.apiUrl);
  }

  // Recupera un metodo di pagamento specifico
  getMetodoPagamentoById(id: number): Observable<MetodoPagamento> {
    return this.http.get<MetodoPagamento>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo metodo di pagamento
  createMetodoPagamento(metodoPagamento: MetodoPagamento): Observable<MetodoPagamento> {
    return this.http.post<MetodoPagamento>(this.apiUrl, metodoPagamento);
  }

  // Modifica un metodo di pagamento esistente
  updateMetodoPagamento(id: number, metodoPagamento: MetodoPagamento): Observable<MetodoPagamento> {
    return this.http.put<MetodoPagamento>(`${this.apiUrl}/${id}`, metodoPagamento);
  }

  // Elimina un metodo di pagamento
  deleteMetodoPagamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}