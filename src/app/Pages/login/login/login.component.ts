import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environment/environment';
import  packageJson  from '../../../../../package.json'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  version = packageJson.version;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.sendLogin({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }).subscribe((data: any) =>{
      this.authService.login(data.token);
      this.router.navigate([''])
    })
  }
}
