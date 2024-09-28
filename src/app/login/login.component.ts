import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../shared/login/login.request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RxReactiveFormsModule,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  public loginForm!: FormGroup;
  isLoading = false;

  constructor(private loginService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]), 
      password: new FormControl('', [Validators.required, RxwebValidators.password({validation: {minLength: 8, digit: true, specialCharacter: true, alphabet: true}})]),
    })
  }

  public onSubmit() {
    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.loginService.login(loginRequest);
  }
}
