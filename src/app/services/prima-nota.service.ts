import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrimaNota } from '../models/primanota.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PrimaNotaService {

  private apiUrl = environment.apiUrl + '/prima-nota';

  constructor(private http: HttpClient) {}

  // Recupera tutte le operazioni di prima nota dell'utente autenticato
  getPrimaNota(): Observable<PrimaNota[]> {
    return this.http.get<PrimaNota[]>(this.apiUrl);
  }

  // Recupera una singola operazione
  getPrimaNotaById(id: number): Observable<PrimaNota> {
    return this.http.get<PrimaNota>(`${this.apiUrl}/${id}`);
  }

  // Recupera solo le entrate o le uscite dell'utente autenticato
  getByTipo(tipoMovimento: string): Observable<PrimaNota[]> {
    return this.http.get<PrimaNota[]>(`${this.apiUrl}/tipo/${tipoMovimento}`);
  }

  // Aggiunge una nuova operazione
  createPrimaNota(primaNota: PrimaNota): Observable<PrimaNota> {
    return this.http.post<PrimaNota>(this.apiUrl, primaNota);
  }

  // Modifica un'operazione esistente
  updatePrimaNota(id: number, primaNota: PrimaNota): Observable<PrimaNota> {
    return this.http.put<PrimaNota>(`${this.apiUrl}/${id}`, primaNota);
  }

  // Elimina un'operazione
  deletePrimaNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Recupera il totale delle entrate e delle uscite per i grafici
  getTotaleEntrateUscite(
    dataInizio?: Date,
    dataFine?: Date,
    rollingDays?: number
  ): Observable<{ entrate: number; uscite: number }> {
    let params = new HttpParams();
    
    if (dataInizio) {
      // Converte la data in formato ISO (YYYY-MM-DD)
      params = params.set('dataInizio', dataInizio.toISOString().split('T')[0]);
    }
    if (dataFine) {
      params = params.set('dataFine', dataFine.toISOString().split('T')[0]);
    }
    if (rollingDays !== undefined && rollingDays !== null) {
      params = params.set('rollingDays', rollingDays.toString());
    }
    
    return this.http.get<{ entrate: number; uscite: number }>(`${this.apiUrl}/dashboard/totali`, { params });
  }
  // Recupera il saldo mensile per i grafici
  getSaldoMensile(mesi: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/saldo?mesi=${mesi}`);
  }

  // Recupera la distribuzione delle categorie per tipo di movimento (ENTRATA o USCITA)
  getDistribuzioneCategorie(tipoMovimento: string): Observable<{ [categoria: string]: number }> {
    return this.http.get<{ [categoria: string]: number }>(`${this.apiUrl}/dashboard/categorie?tipoMovimento=${tipoMovimento}`);
  }

  getProdottiPiuCostosiInUscite() {
    return this.http.get<PrimaNota[]>(this.apiUrl + '/dashboard/prodotti');
  }

  getProdottiConRapportoEntrateUscite(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/dashboard/prodotti-rapporto-entrate-uscite`);
  }

}