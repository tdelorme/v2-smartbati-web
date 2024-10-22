import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Designation, DesignationLine } from './designation.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth.service';
import { ClientService } from '../client/client.service';
import { Client } from '../client/model/client.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { ApiResponse } from '../shared/model/api.response.model';
import { Billing } from '../shared/model/billing.model';
import { BillingService } from '../shared/billing/billing.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    RxReactiveFormsModule,
    MatIconModule,
    MatError,
    AsyncPipe],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit{

  public designations: DesignationLine[] = [];
  public editFormGroup!: FormGroup;
  public discountFormGroup!: FormGroup;
  selected: string = "";
  tax: number = 0;
  taxAmount: number = 0;
  discount: number = 0;
  discountAmount: number = 0;
  total: number = 0;
  filteredOptions$: Observable<Client[]> = new Observable();
  clientAutoCompleteControl = new FormControl();
  clientSelected!: Client;


  constructor(private userService: AuthService,
              private clientService: ClientService,
              private billingService: BillingService
  ) {}

  ngOnInit(): void {

    this.discountFormGroup = new FormGroup({
      discount: new FormControl('0', RxwebValidators.digit()),
      client: this.clientAutoCompleteControl
    });

    this.filteredOptions$ = this.clientAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.loadClient(value).pipe(
          map( clients => clients.data)
        );
      })
    );
  
    this.editFormGroup = new FormGroup({
      type: new FormControl('', Validators.required),
      designation: new FormControl('', [Validators.required]),
      quantity: new FormControl('', RxwebValidators.digit()),
      price: new FormControl('', RxwebValidators.digit())
    });

    this.userService.getCurrentUser().subscribe(user => {
      if (user && user.data && user.data.tax) {
        this.tax = user.data.tax;
      }
    });

    
  }

  public onSubmit() {

    if (this.editFormGroup.valid) {
      const type = '' + this.editFormGroup.get('type')?.value

      const designation: Designation = {
        typeDesignation: type.toUpperCase(),
        name: this.editFormGroup.get('designation')?.value,
        price: this.editFormGroup.get('price')?.value,
      }

      const designationLine: DesignationLine = {
        quantity: this.editFormGroup.get('quantity')?.value,
        designation,
      }

      this.designations.push(designationLine);  
    }

    console.log('designations loaded', this.designations)
  }

  public getLineTotal(line: DesignationLine) {
    if (line && line.designation && line.quantity && line.designation.price) {
      return line.designation.price * line.quantity;
    } else {
      return 'ERROR'
    }
  }

  public deleteCategory(line: DesignationLine) {
    if (this.designations.length === 1
       || this.designations.filter(designation => designation.designation.typeDesignation === 'CATEGORY').length === 1) {
      this.designations = [];
    }
    else {
      const indexCategoryDelete = this.designations.indexOf(line);
      const indexOfNextCategory = this.designations.findIndex((element, index) => element.designation.typeDesignation === 'CATEGORY' && index > indexCategoryDelete);

      const numberElementsBetween = indexOfNextCategory - indexCategoryDelete;
      this.designations.splice(indexCategoryDelete, numberElementsBetween);

    }
  }

  public deleteLine(line: DesignationLine) {
    this.designations.splice(this.designations.indexOf(line), 1);
  }

  public calculSubTotal(): number {
    let subtotal = 0;
    if (this.designations && this.designations.length > 0) {
      
      this.designations.filter(line => line.designation.typeDesignation === 'LINE').forEach(line => {
        if (line && line.designation && line.designation.price) {
          subtotal += (line.designation.price * line.quantity);
        }
      });
      
    }
    return subtotal;
  }

  public getTax() {
    return this.tax;
  }

  public calculTax() {
    return this.calculSubTotal() * (this.tax / 100);
  }

  public calculDiscount() {
    return this.calculSubTotal() * (this.discount / 100);
  }

  public calculTotal() {
    return this.calculSubTotal() + this.calculTax() - this.calculDiscount();
  }

  public setDiscountPercent() {
    if (this.discountFormGroup.valid) {
      this.discount = this.discountFormGroup.get('discount')?.value;
      this.clientSelected = this.discountFormGroup.get('client')?.value;
    }
  }

  public displayFunction(client: Client) {
    return client && client.firstName && client.lastName ? client.firstName + ' ' + client.lastName : '';
  }

  public saveBilling() {

    const billing: Billing = {
      lineQuantities: this.designations,
      clientId: this.clientSelected.id ? this.clientSelected.id : '',
      type: 'QUOTE',
      discountPercent: this.discount
    }

    this.billingService.create(billing).subscribe();

  }

  loadClient(client: string | Client): Observable<ApiResponse<Client[]>> {
    console.log ('client', client)
    if (typeof client === 'string') {
      if (!client || client === '') {
        return this.clientService.getAll();
      } else {
        return this.clientService.getAllByFilteredName(client);
      }
    } else {
      return new Observable(observer => {
        const response: ApiResponse<Client[]> = {
          data: [client],
        }
        observer.next(response);
      })
    }
  }

  public isClientNameFilled() {
    return this.clientSelected ? true : false;
  }
}
