import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { fatturaDaOrdine } from '../models/fattura.model';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class FatturaService {

    private apiUrl = environment.apiUrl + '/fatture'
    constructor(private http: HttpClient) { }

    getFatture(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    generaPdf(fattura: any) {
        this.http.post(this.apiUrl + '/generapdf', fattura, { responseType: 'blob' })
          .subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fattura.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          });
      }


      generaXml(fattura: any) {
        this.http.post(this.apiUrl + '/generaxml', fattura, { responseType: 'blob' })
          .subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fattura.xml';
            a.click();
            window.URL.revokeObjectURL(url);
          });
      }

      

    getFatturaById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    generateFattura(fatturaBody: fatturaDaOrdine): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, fatturaBody);
    }

    generaFatturaCompleta(payload: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, payload);
    }
  

    deleteFattura(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}