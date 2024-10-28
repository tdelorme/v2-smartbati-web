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
  selector: 'app-waiting-quote',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule],
  templateUrl: './waiting-quote.component.html',
  styleUrl: './waiting-quote.component.scss'
})
export class WaitingQuoteComponent {
displayedColumns: string[] = ['number', 'client', 'totalIncludingTax', 'date', 'due', 'actions'];
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
          return this.billingService.getQuoteByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
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

  downloadQuote(b64: string) {

    const downloadLink = document.createElement('a');
    const fileName = 'devis.pdf';

    downloadLink.href = 'data:application/octet-stream;base64,' + b64;
    downloadLink.download = fileName;
    downloadLink.click();

  }
  
  transformToInvoice(id: string) {
    this.billingService.transform(id).subscribe(result => {
      this.reRenderTable(result.data, id);
    });
  }

  deleteBilling(id: string) {
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
}
