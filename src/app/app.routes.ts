import { Routes } from '@angular/router';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { LayoutComponent } from './layouts/layout/layout/layout.component';
import { OrdiniComponent } from './Pages/ordini/ordini/ordini.component';
import { ClientiComponent } from './Pages/clienti/clienti/clienti.component';
import { FattureComponent } from './Pages/fatture/fatture/fatture.component';
import { LoginComponent } from './Pages/login/login/login.component';
import { ProdottiComponent } from './Pages/prodotti/prodotti.component';
import { CategorieComponent } from './Pages/categorie/categorie.component';
import { authGuard } from './guards/auth.guard';
import { PrimaNotaComponent } from './Pages/contabilita/contabilita.component';
import { VerifyEmailComponent } from './Pages/verifcationEmail/verificationEmail.component';
import { RegisterComponent } from './Pages/register/register.component';
import { EditUserComponent } from './Pages/user/user.component';
import { CategorieMovimentoComponent } from './Pages/categorie-movimento/categorie-movimento.component';
import { profileGuard } from './guards/profile.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, profileGuard] },
      { path: 'prodotti', component: ProdottiComponent, canActivate: [authGuard,  profileGuard] },
      { path: 'ordini', component: OrdiniComponent, canActivate: [authGuard, profileGuard] },
      { path: 'clienti', component: ClientiComponent, canActivate: [authGuard, profileGuard] },
      { path: 'categorie', component: CategorieComponent, canActivate: [authGuard, profileGuard] },
      { path: 'categorie-movimento', component: CategorieMovimentoComponent, canActivate: [authGuard,profileGuard] },
      { path: 'fatture', component: FattureComponent, canActivate: [authGuard,profileGuard] },
      { path: 'contabilita', component: PrimaNotaComponent, canActivate: [authGuard,profileGuard]},
      { path: 'utente', component: EditUserComponent, canActivate:[authGuard]}

    ]
  },
  { path: 'register', component: RegisterComponent},
  { path: 'auth/verify', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent } // Questa pagina non avrà la sidebar e la topbar
];
