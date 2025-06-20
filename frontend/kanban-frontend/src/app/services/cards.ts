import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Card {
  id: number;
  title: string;
  description: string;
  columnId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description: string;
  columnId: number;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  columnId?: number;
  order?: number;
}

@Injectable({ providedIn: 'root' })
export class CardsService {
  private apiUrl = environment.apiUrl + '/cards';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  createCard(dto: CreateCardDto): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, dto);
  }

  updateCard(id: number, dto: UpdateCardDto): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, dto);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
