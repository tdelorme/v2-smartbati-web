import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api.response.model';
import { Designation } from '../../edit/designation.model';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<Designation[]>> {
    return this.http.get<ApiResponse<Designation[]>>('/api/designation');
  }

  getAllByFilteredName(designation: string, type: string): Observable<ApiResponse<Designation[]>> {
    return this.http.get<ApiResponse<Designation[]>>(`/api/designation/${type}/${designation}`);
  }

  getAllByTypeDesignation(type: string): Observable<ApiResponse<Designation[]>> {
    return this.http.get<ApiResponse<Designation[]>>(`/api/designation/${type}`);
  }
}
