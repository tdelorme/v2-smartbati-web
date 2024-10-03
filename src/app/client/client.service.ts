import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from './model/client.model';
import { Observable } from 'rxjs';
import { LocalService } from '../shared/local.storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient
  ) { }

  public create(client: Client): Observable<Client> {
    return this.http.post<Client>('/api/client/create', client);
  }
}
