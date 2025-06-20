import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Column {
  id: number;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateColumnDto {
  name: string;
}

export interface UpdateColumnDto {
  name?: string;
  order?: number;
}

@Injectable({ providedIn: 'root' })
export class ColumnsService {
  private apiUrl = environment.apiUrl + '/columns';

  constructor(private http: HttpClient) {}

  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this.apiUrl);
  }

  getColumn(id: number): Observable<Column> {
    return this.http.get<Column>(`${this.apiUrl}/${id}`);
  }

  createColumn(dto: CreateColumnDto): Observable<Column> {
    return this.http.post<Column>(this.apiUrl, dto);
  }

  updateColumn(id: number, dto: UpdateColumnDto): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/${id}`, dto);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
