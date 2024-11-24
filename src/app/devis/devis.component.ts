import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Billing } from '../shared/model/billing.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTable, MatTableModule } from '@angular/material/table';
import { BillingService } from '../shared/billing/billing.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-devis',
    imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatTooltipModule, DecimalPipe, DatePipe],
    templateUrl: './devis.component.html',
    styleUrl: './devis.component.scss',
    standalone: true,
})
export class DevisComponent implements AfterViewInit{

  displayedColumns: string[] = ['number', 'client', 'totalIncludingTax', 'date', 'due', 'actions'];
  data: Billing[] = []
  resultsLength = 0
  @Input()
  pageSize = 10
  @Input()
  title = 'Liste des devis'
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
