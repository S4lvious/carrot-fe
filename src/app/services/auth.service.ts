import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

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

    sendRegister(registerForm: any) {
      const plan: string = registerForm.plan;
    
      // Creiamo un oggetto per i parametri della richiesta
      let params: any = {};
    
      // Aggiungiamo planName solo se plan esiste e non è una stringa vuota
      if (plan && plan.trim() !== '') {
        params.planName = plan;
      }

      delete registerForm.plan;
      registerForm.role = "USER";
      return this._http.post(this.apiurl + '/register', registerForm, { responseType: 'text', params: params },);
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
