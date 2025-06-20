import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Column as KanbanColumn } from './column.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  position: number;

  @Column({ name: 'column_id', nullable: false })
  columnId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => KanbanColumn, column => column.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'column_id' })
  column: KanbanColumn;
} 