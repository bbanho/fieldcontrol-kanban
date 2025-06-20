import { Injectable } from '@angular/core';
import { CardsService, Card, CreateCardDto, UpdateCardDto } from './cards';
import { ColumnsService, Column, CreateColumnDto, UpdateColumnDto } from './columns';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  constructor(
    private cardsService: CardsService,
    private columnsService: ColumnsService
  ) {}

  getBoard(): Observable<{ columns: Column[]; cards: Card[] }> {
    return forkJoin({
      columns: this.columnsService.getColumns(),
      cards: this.cardsService.getCards()
    });
  }

  // Métodos utilitários para manipulação do board podem ser adicionados aqui
}
