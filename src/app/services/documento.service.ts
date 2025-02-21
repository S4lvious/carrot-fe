import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl =  environment.apiUrl + '/documenti';

  constructor(private http: HttpClient) {}

  getDocumentiByOrdine(ordineId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ordine/${ordineId}`);
  }

  getDocumentiByCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  deleteDocument(docId: any): Observable<any>{
    return this.http.delete<any[]>(`${this.apiUrl}/${docId}`);
  }

  getSignedUrl(filePath: string): Observable<{ signedUrl: string }> {
    const params = new HttpParams().set('filePath', filePath);
    return this.http.get<{ signedUrl: string }>(`${this.apiUrl}/visualizza`, { params });
  }
  }
