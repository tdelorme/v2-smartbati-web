import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ClientService } from '../client.service';
import { Client } from '../model/client.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmSnackBarComponent } from '../../snackbar/confirm-snack-bar/confirm-snack-bar.component';
import { ErrorSnackBarComponent } from '../../snackbar/error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RxReactiveFormsModule,
    MatError
  ],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent implements OnInit{

  private _snackBar = inject(MatSnackBar);
  public addClientFormGroup!: FormGroup;

  constructor(private clientService: ClientService) {

  }

  ngOnInit(): void {
      this.addClientFormGroup = new FormGroup({
        lastname: new FormControl('', [Validators.required]), 
        firstname: new FormControl('', [Validators.required]), 
        email: new FormControl('', [Validators.required, RxwebValidators.email()]), 
        phone: new FormControl('', [Validators.required, RxwebValidators.digit()]), 
        address: new FormControl('', [Validators.required]), 
      });
  }

  public onSubmit() {

    const client: Client = {
      lastName: this.addClientFormGroup.get('lastname')?.value,
      firstName: this.addClientFormGroup.get('firstname')?.value,
      email: this.addClientFormGroup.get('email')?.value,
      phone: this.addClientFormGroup.get('phone')?.value,
      address: this.addClientFormGroup.get('address')?.value
    }

    if (this.addClientFormGroup.valid) {

      this.clientService.create(client).subscribe({
          next: (value) => {
            this._snackBar.openFromComponent(ConfirmSnackBarComponent, {
              duration: 5000,
            })
            .afterDismissed()
            .subscribe(() => {
              this.addClientFormGroup.reset();
            });
          },
          error: (error) => {
            this._snackBar.openFromComponent(ErrorSnackBarComponent, {
              duration: 5000,
            });
          }
      });
    }
  }

}
