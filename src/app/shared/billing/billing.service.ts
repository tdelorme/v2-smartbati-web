import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Billing } from '../model/billing.model';
import { PageableApiResponse } from '../model/api.response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }

  create(billing: Billing) {
    return this.http.post('/api/billing/create', billing);
  }

  getQuoteByPage(index: number, pageSize: number): Observable<PageableApiResponse<Billing[]>> {
    return this.http.get<PageableApiResponse<Billing[]>>(`/api/billing/quote/page/${index}/size/${pageSize}`);
  }
}
