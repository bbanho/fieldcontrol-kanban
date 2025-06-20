import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Column } from '../../common/entities/column.entity';
import { CreateColumnDto } from '../../common/dto/create-column.dto';
import { UpdateColumnDto } from '../../common/dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const newColumn = this.columnRepository.create(createColumnDto);
    return this.columnRepository.save(newColumn);
  }

  async findAll(): Promise<Column[]> {
    return this.columnRepository.find({ relations: ['cards'], order: { position: 'ASC' } });
  }

  async findOne(id: number): Promise<Column> {
    const column = await this.columnRepository.findOne({ where: { id }, relations: ['cards'] });
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const column = await this.findOne(id);
    this.columnRepository.merge(column, updateColumnDto);
    return this.columnRepository.save(column);
  }

  async remove(id: number): Promise<void> {
    const result = await this.columnRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
  }
} 