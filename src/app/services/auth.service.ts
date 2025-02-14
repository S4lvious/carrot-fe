import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(
        private _http: HttpClient
    ) {

    }

    apiurl: string = environment.apiUrl + '/auth'


    sendLogin(
        loginBody: any
    ) {
        return this._http.post(this.apiurl + '/login', loginBody)
    }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica se il token esiste
  }

  login(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
