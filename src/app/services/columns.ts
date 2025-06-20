import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column } from '../models/column.interface';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  private apiUrl = 'http://localhost:3000/api/columns';

  constructor(private http: HttpClient) { }

  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this.apiUrl);
  }

  getColumn(id: number): Observable<Column> {
    return this.http.get<Column>(`${this.apiUrl}/${id}`);
  }

  createColumn(column: Partial<Column>): Observable<Column> {
    return this.http.post<Column>(this.apiUrl, column);
  }

  updateColumn(id: number, column: Partial<Column>): Observable<Column> {
    return this.http.patch<Column>(`${this.apiUrl}/${id}`, column);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 