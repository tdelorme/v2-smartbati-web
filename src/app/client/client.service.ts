import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from './model/client.model';
import { Observable } from 'rxjs';
import { PageableApiResponse, ApiResponse } from '../shared/model/api.response.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient
  ) { }

  public create(client: Client): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>('/api/client/create', client);
  }

  public getByPage(index: number, pageSize: number): Observable<PageableApiResponse<Client[]>> {
    return this.http.get<PageableApiResponse<Client[]>>(`/api/client/page/${index}/size/${pageSize}`);
  }

  public getAll(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>('/api/client/all');
  }

  public getAllByFilteredName(name: string): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(`/api/client/filter/${name}`);
  }

  public getById(id: string): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(`/api/client/${id}`);
  }
}
