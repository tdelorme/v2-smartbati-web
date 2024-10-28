import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Billing } from '../model/billing.model';
import { ApiResponse, PageableApiResponse } from '../model/api.response.model';
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

  getInvoiceByPage(index: number, pageSize: number): Observable<PageableApiResponse<Billing[]>> {
    return this.http.get<PageableApiResponse<Billing[]>>(`/api/billing/invoice/page/${index}/size/${pageSize}`);
  }

  getInvoicePaidByPage(index: number, pageSize: number): Observable<PageableApiResponse<Billing[]>> {
    return this.http.get<PageableApiResponse<Billing[]>>(`/api/billing/invoice/paid/page/${index}/size/${pageSize}`);
  }

  getInvoiceNotPaidByPage(index: number, pageSize: number): Observable<PageableApiResponse<Billing[]>> {
    return this.http.get<PageableApiResponse<Billing[]>>(`/api/billing/invoice/not/paid/page/${index}/size/${pageSize}`);
  }


  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`/api/billing/${id}`);
  }

  transform(id: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`/api/billing/transform/${id}`, null);
  }

  paid(id: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`/api/billing/paid/${id}`, null);
  }


}
