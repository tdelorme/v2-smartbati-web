import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Billing } from '../shared/model/billing.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BillingService } from '../shared/billing/billing.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ClientService } from '../client/client.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule],
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.scss'
})
export class DevisComponent implements AfterViewInit{

  displayedColumns: string[] = ['number', 'client', 'totalIncludingTax', 'date', 'due', 'actions'];
  data: Billing[] = []
  resultsLength = 0
  pageSize = 10
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private billingService: BillingService,
              private clientService: ClientService
  ) {}

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

  }

  deleteBilling(id: string) {

  }

}
