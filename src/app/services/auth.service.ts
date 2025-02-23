import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

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
      const token = localStorage.getItem('token');
  
      if (!token) {
        return false;
      }
  
      if (this.isTokenExpired(token)) {
        this.logout(); // 🔥 Se il token è scaduto, lo eliminiamo e buttiamo fuori l'utente
        return false;
      }
  
      return true;
    }
  
    private isTokenExpired(token: string): boolean {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Confronto con il tempo attuale in secondi
        return decodedToken.exp < currentTime; // Se il token è scaduto, ritorna true
      } catch (error) {
        return true; // Se c'è un errore nel decoding, consideriamo il token non valido
      }
    }
  

  public apiUrl : string = 'https://api.powerwebsoftware.it/api/user/profile-status';
  isProfileCompleted(): Observable<boolean> {
    return this._http.get<{ profileCompleted: boolean }>(this.apiUrl)
      .pipe(map(response => response.profileCompleted));
  }


  login(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
