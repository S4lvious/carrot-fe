import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { UserService } from '../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    standalone:true,
    imports: [PanelModule, TabViewModule, InputTextModule, FormsModule, ButtonModule, CardModule, CommonModule, DatePipe],
  selector: 'app-edit-user',
  templateUrl: './user.component.html',
})


export class EditUserComponent implements OnInit {
  user: any = {
    id: null,
    username: '',
    password: '',
    nome: '',
    cognome: '',
    ragioneSociale: '',
    codiceFiscale: '',
    partitaIva: '',
    indirizzo: '',
    cap: '',
    citta: '',
    provincia: '',
    pec: '',
    codiceDestinatario: '',
    telefono: '',
    email: '',
    iban: '',
    enabled: false,
    trialActive: true,
    role: 'USER',
    subscription: {
      id: '',
      plan: null,
      startDate: null,
      endDate: null,
      trial: true
    },
    createdAt: new Date()
  };


  plans: any = [
    "Annuale", "Trimestrale", "Mensile"
  ]
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUser().subscribe((user: any) => {
        this.user = user;
    })
    }

    upgradeSub(planName: string) {
      this.userService.upgradeSub(planName, this.user.id).subscribe((url) =>{
        if (url) {
          window.open(url, '_blank'); // Apri il link di pagamento in una nuova finestra/tab
      } else {
          console.error("Nessun URL di pagamento ricevuto.");
      }

      })
    }

  onSave(): void {
    this.userService.updateUser(this.user).subscribe(() => {
        this.loadUser();
    })
}

  onCancel(): void {
    this.loadUser(); // Ricarica i dati originali se l'utente annulla
  }
}
