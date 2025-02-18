import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [CardModule, ButtonModule, InputTextModule, FormsModule, CommonModule, MessageModule, Toast]
})

export class RegisterComponent {
  userData: any = {
    username: '',
    password: '',
    nome: '',
    cognome: '',
    codiceFiscale: '',
    partitaIva: '',
    ragioneSociale: '',
    indirizzo: '',
    cap: '',
    citta: '',
    provincia: '',
    pec: '',
    telefono: '',
    email: '',
    iban: '',
    plan: ''
  };

  plans = [
    { name: 'Mensile', price: '€9,99', value: 'Mensile', description: 'Accesso per un mese con tutte le funzionalità.' },
    { name: 'Trimestrale', price: '€24,99', value: 'Trimestrale', description: 'Risparmia con tre mesi di accesso completo.' },
    { name: 'Annuale', price: '€89,99', value: 'Annuale', description: 'Il piano più conveniente per un anno di accesso.' },
    { name: '', price: 'Gratis', value: '', description: 'Inizia con una prova gratuita senza impegno.' }
  ];
  mailSendend: boolean = false;
  constructor(private messageService: MessageService, private authService: AuthService) {}

  onSubmit() {
    if (this.userData.email && this.userData.password) {
      this.authService.sendRegister(this.userData).subscribe((data) => {
        this.messageService.add({ severity: 'success', summary: 'Successo', detail: data });
        
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Errore', detail: 'Compila tutti i campi richiesti' });
    }
  }
}