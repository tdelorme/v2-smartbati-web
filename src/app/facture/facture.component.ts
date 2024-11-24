import { Component, inject, Input, ViewChild } from '@angular/core';
import { Billing, TypeBilling } from '../shared/model/billing.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { BillingService } from '../shared/billing/billing.service';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { PageableApiResponse } from '../shared/model/api.response.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DepositDialogComponent } from '../components/dialog/deposit-dialog/deposit-dialog.component';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatTooltip, DecimalPipe, DatePipe],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss'
})
export class FactureComponent {
  displayedColumns: string[] = ['number', 'client', 'totalIncludingTax', 'deposit', 'type', 'due', 'actions'];
  data: Billing[] = []
  resultsLength = 0
  @Input()
  pageSize = 10
  @Input()
  title = 'Liste des factures';
  @Input()
  type: TypeBilling = TypeBilling.ALL;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Billing>;

  readonly dialog = inject(MatDialog);

  constructor(private billingService: BillingService) {}

  ngAfterViewInit(): void {
      this.paginator.page.pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let result: Observable<PageableApiResponse<Billing[]> | null> = of(null);

          switch(this.type) {
            case TypeBilling.INVOICE:
              result = this.billingService.getInvoiceNotPaidByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
              break;
            case TypeBilling.PAID:
              result = this.billingService.getInvoicePaidByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
              break;
            default:
              result = this.billingService.getInvoiceByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
              break;

          }

          return result;
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.total_count;

          return data.data;
        })
      )
      .subscribe(data => this.data = data);
  }

  downloadInvoice(b64: string) {

    const downloadLink = document.createElement('a');
    const fileName = 'facture.pdf';

    downloadLink.href = 'data:application/octet-stream;base64,' + b64;
    downloadLink.download = fileName;
    downloadLink.click();

  }
  
  payInvoice(id: string) {
    this.billingService.paid(id).subscribe(result => {
      this.reRenderTable(result.data, id);
    });
  }

  deleteInvoice(id: string) {
    this.billingService.delete(id).subscribe(result => {
      this.reRenderTable(result.data, id);
    });
  }

  depositInvoice(id: string) {
    const dialogRef = this.dialog.open(DepositDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.billingService.deposit(id, result).subscribe(result => {

          const index = this.data.findIndex(d => d.id === id);
          this.data[index] = result.data;

          this.reRenderTable(false, id);
        });
      }
    });
  }

  private reRenderTable(isDeleted: boolean, id: string) {
    if (isDeleted) {
      this.data.splice(this.data.findIndex(d => d.id === id) ,1);
    }
    this.table.renderRows();
  }

  getTypeLibelle(key: string): string {
    switch(key) {
      case 'INVOICE': return 'Facture non payé';
      case 'INVOICE_PAID': return 'Facture payé';
      default: return 'DEVIS';
    }
  }

  getClassPayment(line: Billing) {
    if ((TypeBilling.INVOICE == this.type || TypeBilling.ALL == this.type) && line.dueDate ? new Date() > new Date(line.dueDate) : false) {
      return 'late-payment';
    }
    return '';
  }
}
