import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/column.interface';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) { }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  createCard(card: Partial<Card>): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  updateCard(id: number, card: Partial<Card>): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  moveCard(id: number, columnId: number, position: number): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/${id}/move`, { columnId, position });
  }
} 