import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verificationEmail.component.html',
})
export class VerifyEmailComponent implements OnInit {
  message: string = 'Verificando il tuo account...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Legge il token dall'URL
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      // Chiama l'API di verifica
      this.http.get(`https://api.powerwebsoftware.it/api/auth/verify?token=${token}`, { responseType: 'text' })
        .subscribe({
            next: (response) => {
                if (response.startsWith('https://checkout.stripe.com/')) {
                  // L'utente ha scelto il pagamento diretto, lo reindirizziamo a Stripe
                  window.location.href = response;
                } else {
                  // L'utente ha attivato il trial, lo mandiamo al login
                  this.message = response;
                  setTimeout(() => this.router.navigate(['/login']), 3000);
                }},
              error: (error) => {
            this.message = "Errore: il link è scaduto o non valido.";
          }
        });
    } else {
      this.message = "Errore: nessun token trovato.";
    }
  }
}
