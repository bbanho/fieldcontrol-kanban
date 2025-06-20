import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../common/entities/card.entity';
import { CreateCardDto } from '../../common/dto/create-card.dto';
import { UpdateCardDto } from '../../common/dto/update-card.dto';
import { ColumnsService } from '../columns/columns.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly columnsService: ColumnsService,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    await this.columnsService.findOne(createCardDto.columnId);
    const newCard = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(newCard);
  }

  async findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id }});
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    if (updateCardDto.columnId) {
      await this.columnsService.findOne(updateCardDto.columnId);
    }
    const card = await this.findOne(id);
    this.cardRepository.merge(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
  }
} 