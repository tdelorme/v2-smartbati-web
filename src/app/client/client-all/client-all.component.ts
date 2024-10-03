import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Client } from '../model/client.model';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-all',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './client-all.component.html',
  styleUrl: './client-all.component.scss'
})
export class ClientAllComponent implements AfterViewInit{

  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'phone', 'address'];
  data: Client[] = [];
  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientService: ClientService) {}

  ngAfterViewInit(): void {
      this.paginator.page.pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.clientService.getByPage(this.paginator.pageIndex, this.pageSize).pipe(catchError(() => of(null)));
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

}
