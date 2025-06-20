import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../entities/card.entity';
import { CreateCardDto } from '../../dto/create-card.dto';
import { UpdateCardDto } from '../../dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const card = this.cardsRepository.create(createCardDto);
    return await this.cardsRepository.save(card);
  }

  async findAll(): Promise<Card[]> {
    return await this.cardsRepository.find({
      relations: ['column'],
      order: { position: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations: ['column']
    });
    
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.findOne(id);
    Object.assign(card, updateCardDto);
    return await this.cardsRepository.save(card);
  }

  async remove(id: number): Promise<void> {
    const card = await this.findOne(id);
    await this.cardsRepository.remove(card);
  }

  async moveCard(id: number, columnId: number, position: number): Promise<Card> {
    const card = await this.findOne(id);
    card.columnId = columnId;
    card.position = position;
    return await this.cardsRepository.save(card);
  }
} 