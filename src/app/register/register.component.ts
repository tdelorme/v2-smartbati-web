import {Component, inject, OnInit} from '@angular/core';
import {MatError, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import {RxReactiveFormsModule, RxwebValidators} from '@rxweb/reactive-form-validators'
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmSnackBarComponent } from '../snackbar/confirm-snack-bar/confirm-snack-bar.component';
import { ErrorSnackBarComponent } from '../snackbar/error-snack-bar/error-snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RxReactiveFormsModule,
    MatError
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);
  public registerForm!: FormGroup;
  isLoading = false;

  constructor(private registerService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]), 
      confirmEmail: new FormControl('', [Validators.required, Validators.email, RxwebValidators.compare({fieldName: 'email'})]),
      password: new FormControl('', [Validators.required, RxwebValidators.password({validation: {minLength: 8, digit: true, specialCharacter: true, alphabet: true}})]),
      confirmPassword: new FormControl('', [Validators.required, RxwebValidators.password({validation: {minLength: 8, digit: true, specialCharacter: true, alphabet: true}}), RxwebValidators.minLength({value: 8}), RxwebValidators.compare({fieldName: 'password'})])
    })
  }

  public OnSubmit() {
    const user: User = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    }

    this.registerService.registerUser(user).subscribe(
      {
        next: (value) => {
          this._snackBar.openFromComponent(ConfirmSnackBarComponent, {
            duration: 5000,
          })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate(['/login']);
          });

          
        },
        error: (error) => {
          this._snackBar.openFromComponent(ErrorSnackBarComponent, {
            duration: 5000,
          })
        }
      }
    )
  }

}
