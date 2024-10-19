import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { User } from '../shared/user/user.model';
import { AuthService } from '../shared/auth.service';
import { ConfirmSnackBarComponent } from '../snackbar/confirm-snack-bar/confirm-snack-bar.component';
import { ErrorSnackBarComponent } from '../snackbar/error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RxReactiveFormsModule,
    MatError],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit{
  private _snackBar = inject(MatSnackBar);

  private _currentUser!: User;

  public settingForm!: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.settingForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]), 
        firstName: new FormControl('', [Validators.required, RxwebValidators.alpha()]), 
        lastName: new FormControl('', [Validators.required, RxwebValidators.alpha()]),
        phone: new FormControl('', [Validators.required, RxwebValidators.digit()]),
        address: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        website: new FormControl('', [RxwebValidators.url()]),
        tax: new FormControl('', [Validators.required, RxwebValidators.digit()]),
        footer: new FormControl('')
      });

      this.authService.getCurrentUser().subscribe(apiResponseUser => {
        this._currentUser = apiResponseUser.data;

        if (this._currentUser.email) {
          this.settingForm.get('email')?.setValue(this._currentUser.email);
        }
        if (this._currentUser.firstName) {
          this.settingForm.get('firstName')?.setValue(this._currentUser.firstName);
        }
        if (this._currentUser.lastName) {
          this.settingForm.get('lastName')?.setValue(this._currentUser.lastName);
        }
        if (this._currentUser.phone) {
          this.settingForm.get('phone')?.setValue(this._currentUser.phone);
        }
        if (this._currentUser.address) {
          this.settingForm.get('address')?.setValue(this._currentUser.address);
        }
        if (this._currentUser.zipCode) {
          this.settingForm.get('zipCode')?.setValue(this._currentUser.zipCode);
        }
        if (this._currentUser.city) {
          this.settingForm.get('city')?.setValue(this._currentUser.city);
        }
        if (this._currentUser.website) {
          this.settingForm.get('website')?.setValue(this._currentUser.website);
        }
        if (this._currentUser.tax) {
          this.settingForm.get('tax')?.setValue(this._currentUser.tax);
        }
        if (this._currentUser.footer) {
          this.settingForm.get('footer')?.setValue(this._currentUser.footer);
        }
      });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.settingForm.valid) {
      this._currentUser.firstName = this.settingForm.get('firstName')?.value;
      this._currentUser.lastName = this.settingForm.get('lastName')?.value;
      this._currentUser.phone = this.settingForm.get('phone')?.value;
      this._currentUser.address = this.settingForm.get('address')?.value;
      this._currentUser.zipCode = this.settingForm.get('zipCode')?.value;
      this._currentUser.city = this.settingForm.get('city')?.value;
      this._currentUser.website = this.settingForm.get('website')?.value;
      this._currentUser.tax = this.settingForm.get('tax')?.value;
      this._currentUser.footer = this.settingForm.get('footer')?.value;
    }

    this.authService.updateUser(this._currentUser).subscribe({
      next: () => {
        this.isLoading = false;
        this._snackBar.openFromComponent(ConfirmSnackBarComponent, {
          duration: 5000,
        });
      },
      error: () => {
        this.isLoading = false;
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          duration: 5000,
        });
      }
    });
  }
}
