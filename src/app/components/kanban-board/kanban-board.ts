import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanColumnComponent } from '../kanban-column/kanban-column';
import { ColumnFormComponent } from '../column-form/column-form';
import { ColumnsService } from '../../services/columns';
import { Column } from '../../models/column.interface';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, KanbanColumnComponent, ColumnFormComponent],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss'
})
export class KanbanBoardComponent implements OnInit {
  columns: Column[] = [];
  showColumnForm = false;

  constructor(private columnsService: ColumnsService) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns(): void {
    this.columnsService.getColumns().subscribe({
      next: (columns) => {
        this.columns = columns;
      },
      error: (error) => {
        console.error('Error loading columns:', error);
      }
    });
  }

  createColumn(columnData: Partial<Column>): void {
    this.columnsService.createColumn(columnData).subscribe({
      next: (newColumn) => {
        this.columns.push(newColumn);
        this.showColumnForm = false;
      },
      error: (error) => {
        console.error('Error creating column:', error);
      }
    });
  }

  deleteColumn(columnId: number): void {
    this.columnsService.deleteColumn(columnId).subscribe({
      next: () => {
        this.columns = this.columns.filter(col => col.id !== columnId);
      },
      error: (error) => {
        console.error('Error deleting column:', error);
      }
    });
  }

  toggleColumnForm(): void {
    this.showColumnForm = !this.showColumnForm;
  }

  trackByColumnId(index: number, column: Column): number {
    return column.id;
  }
} 