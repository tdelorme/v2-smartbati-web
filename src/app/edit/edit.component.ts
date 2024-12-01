import { Component, inject, OnInit } from '@angular/core';
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
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { ApiResponse } from '../shared/model/api.response.model';
import { Billing, TypeBilling } from '../shared/model/billing.model';
import { BillingService } from '../shared/billing/billing.service';
import { DesignationService } from '../shared/designation/designation.service';
import { ConfirmSnackBarComponent } from '../snackbar/confirm-snack-bar/confirm-snack-bar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../snackbar/error-snack-bar/error-snack-bar.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-edit',
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
        MatSnackBarModule,
        MatError,
        AsyncPipe,
        DecimalPipe
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    standalone: true,
})
export class EditComponent implements OnInit{

  public designations: DesignationLine[] = [];
  public editFormGroup!: FormGroup;
  public discountFormGroup!: FormGroup;
  selected: string = '';
  tax: number = 0;
  taxAmount: number = 0;
  discount: number = 0;
  discountAmount: number = 0;
  total: number = 0;
  filteredOptions$: Observable<Client[]> = new Observable();
  clientAutoCompleteControl = new FormControl();
  clientSelected!: Client;

  filteredOptionsDesignation$: Observable<Designation[]> = new Observable();
  designationAutoCompleteControl = new FormControl();
  designationSelected!: Designation;

  private _snackBar = inject(MatSnackBar);

  constructor(private userService: AuthService,
              private clientService: ClientService,
              private billingService: BillingService,
              private designationService: DesignationService,
              private currentRoute: ActivatedRoute,
              private router: Router
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
      designation: this.designationAutoCompleteControl,
      description: new FormControl(''),
      quantity: new FormControl('', RxwebValidators.digit()),
      price: new FormControl('', RxwebValidators.digit())
    });

    this.filteredOptionsDesignation$ = this.designationAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.loadDesignation(value, this.editFormGroup.get('type')?.value).pipe(
          map(designation => designation.data)
        )
      })
    )

    this.userService.getCurrentUser().subscribe(user => {
      if (user && user.data && user.data.tax) {
        this.tax = user.data.tax;
      }
    });

    this.currentRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        const idQuote = params['id'];

        this.billingService.getById(idQuote).subscribe(response => {
          const billing = response.data;

          this.discountFormGroup.get('discount')?.setValue(billing.discountPercent);
          this.discountFormGroup.get('client')?.setValue(billing.client);

          if (billing.client) {
            this.clientSelected = billing.client;
          }

          if (billing.lineQuantities) {
            this.designations = billing.lineQuantities;
          }
        });
      }
    });
    
  }

  public onSubmit() {

    if (this.editFormGroup.valid) {
      const type = '' + this.editFormGroup.get('type')?.value
      const designationValue = this.editFormGroup.get('designation')?.value;
      
      const designation: Designation = {
        typeDesignation: type.toUpperCase(),
        name: designationValue.name ? designationValue.name : designationValue,
        description: this.editFormGroup.get('description')?.value,
        price: this.editFormGroup.get('price')?.value,
      }

      const designationLine: DesignationLine = {
        quantity: this.editFormGroup.get('quantity')?.value,
        designation,
      }

      this.designations.push(designationLine);  
    }

    this.resetDesignationForm();

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

  public displayFunctionDesignation(designation: Designation) {
    return designation && designation.name ? designation.name : '';
  }

  public saveBilling() {

    const billing: Billing = {
      lineQuantities: this.designations,
      clientId: this.clientSelected.id ? this.clientSelected.id : '',
      type: TypeBilling.QUOTE,
      discountPercent: this.discount
    }

    this.billingService.create(billing).subscribe({
      next: (response) => {
        this._snackBar.openFromComponent(ConfirmSnackBarComponent, {
          duration: 5000,
        });
        this.router.navigate(['devis'])
      },
      error: (err) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          duration: 5000,
        });
      }
    });

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

  loadDesignation(designation: string | Designation, type: string): Observable<ApiResponse<Designation[]>> {
    if (typeof designation === 'string') {
      if ((!designation || designation === '') && !type) {
          return this.designationService.getAll();
      } else {
        if (type) {
          return this.designationService.getAllByTypeDesignation(type);
        } else {
          return this.designationService.getAllByFilteredName(designation, type)
        }
      }
    } else {
      return new Observable(observer => {
        const response: ApiResponse<Designation[]> = {
          data: [designation],
        }
        observer.next(response)
      })
    }
  }

  onTypeDesignationChange() {
    this.filteredOptionsDesignation$ = this.designationAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.loadDesignation(value, this.editFormGroup.get('type')?.value).pipe(
          map(designation => designation.data)
        )
      })
    )
  }

  public isClientNameFilled() {
    return this.clientSelected ? true : false;
  }

  public onSelectionDesignation(designation: Designation) {
    this.editFormGroup.get('type')?.setValue(designation.typeDesignation?.toLowerCase());
    this.selected = designation.typeDesignation ? designation.typeDesignation.toLowerCase() : '';
    this.editFormGroup.get('description')?.setValue(designation.description);
    this.editFormGroup.get('price')?.setValue(designation.price);
  }

  private resetDesignationForm() {
    this.editFormGroup.get('type')?.setValue('');
    this.editFormGroup.get('designation')?.setValue('');
    this.editFormGroup.get('description')?.setValue('');
    this.editFormGroup.get('price')?.setValue('');
    this.editFormGroup.get('quantity')?.setValue(0);
  }
}
