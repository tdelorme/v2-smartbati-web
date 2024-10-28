import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Billing } from '../../shared/model/billing.model';
import { BillingService } from '../../shared/billing/billing.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {
  displayedColumns: string[] = ['number', 'client', 'totalIncludingTax', 'type', 'due', 'actions'];
  data: Billing[] = []
  resultsLength = 0
  pageSize = 3
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Billing>;

  constructor(private billingService: BillingService) {}

  ngAfterViewInit(): void {
      this.paginator.page.pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.billingService.getInvoicePaidByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
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

  private reRenderTable(isDeleted: boolean, id: string) {
    if (isDeleted) {
      this.data.splice(this.data.findIndex(d => d.id === id) ,1);
      this.table.renderRows();
    }
  }

  getTypeLibelle(key: string): string {
    switch(key) {
      case 'INVOICE': return 'Facture non payé';
      case 'INVOICE_PAID': return 'Facture payé';
      default: return 'DEVIS';
    }
  }
}
