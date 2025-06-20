import { Entity, PrimaryGeneratedColumn, Column as TypeORMColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @TypeORMColumn({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @TypeORMColumn({ type: 'int', nullable: false })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Card, card => card.column, { cascade: true })
  cards: Card[];
} 