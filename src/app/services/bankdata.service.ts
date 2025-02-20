import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Institution {
  id: string;
  name: string;
  bic: string;
  // ...
}

export interface RequisitionResponse {
  id: string;
  redirect: string;
  link: string;
  // ...
}

export interface CreateRequisitionRequest {
  institutionId: string;
  redirectUrl: string;
  reference: string;
  userLanguage: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankDataService {
  // In produzione, sposta la baseUrl in environment.ts
  private baseUrl = environment.apiUrl + '/bank';

  constructor(private http: HttpClient) {}

  getInstitutions(country: string): Observable<Institution[]> {
    return this.http.get<Institution[]>(`${this.baseUrl}/institutions?country=${country}`);
  }

  createRequisition(request: CreateRequisitionRequest): Observable<RequisitionResponse> {
    return this.http.post<RequisitionResponse>(`${this.baseUrl}/requisition`, request);
  }

  requestSync(accountId: string) : Observable<any> {
    return this.http.post(this.baseUrl + 'syncData', {accountId});
  }

}
