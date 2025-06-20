export interface Column {
  id: number;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  cards?: Card[];
}

export interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
  columnId: number;
  created_at: string;
  updated_at: string;
  column?: Column;
} 