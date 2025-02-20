import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { UserService } from '../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BankDataService } from '../../services/bankdata.service';
import { environment } from '../../../environment/environment';

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

  profileCompleted = true;
  missingFields: string[] = [];
  bankAccounts: any[] = [];
  bankFilter: string = '';
  

  plans: any = [
    "Annuale", "Trimestrale", "Mensile"
  ]
  constructor(
    private userService: UserService, 
    public authService: AuthService,
    public router: Router,
    public bankDataService: BankDataService
  ) {}

  profileCompleted$!: Observable<boolean>;

  public get getMissingFields(): string[] {
    this.missingFields = [];
    if (!this.user.partitaIva) this.missingFields.push('Partita IVA');
    if (!this.user.codiceFiscale) this.missingFields.push('Codice Fiscale');
    if (!this.user.indirizzo) this.missingFields.push('Indirizzo');
    if (!this.user.cap) this.missingFields.push('CAP');
    if (!this.user.citta) this.missingFields.push('Città');
    if (!this.user.provincia) this.missingFields.push('Provincia');
    if (!this.user.nome && !this.user.ragioneSociale) this.missingFields.push('Nome o Ragione Sociale');
    return this.missingFields;
  }
  get isSaveDisabled(): boolean {
    return (
      !this.user.partitaIva ||
      !this.user.codiceFiscale ||
      !this.user.indirizzo ||
      !this.user.cap ||
      !this.user.citta ||
      !this.user.provincia ||
      (!this.user.nome && !this.user.ragioneSociale)
    );
  }

  loadBankAccounts(): void {
    this.bankDataService.getInstitutions("IT").subscribe({
      next: (accounts) => {
        this.bankAccounts = accounts;
      },
      error: (err) => {
        console.error("Errore nel caricamento dei conti bancari", err);
      }
    });
  }

  configureBank(bank: any) {
    this.bankDataService.createRequisition({
      redirectUrl: environment.apiUrl + '/bank/redirect',
      institutionId: bank.id,
      reference: Math.random().toString().replace("0.", ""),
      userLanguage: 'IT'
    }).subscribe((res) => {
      window.location.href = res.link;
    });
  }

  onFilterChange(): void {
    this.bankAccounts = this.bankAccounts.filter(bank =>
      bank.name.toLowerCase().includes(this.bankFilter.toLowerCase())
    );
  }


    
  ngOnInit(): void {
    this.profileCompleted$ = this.authService.isProfileCompleted();
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
    this.userService.completeProfile(this.user).subscribe(() => {
        this.loadUser();
        this.router.navigate(['dashboard']);
    })
}

}
