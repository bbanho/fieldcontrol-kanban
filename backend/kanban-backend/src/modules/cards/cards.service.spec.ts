import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { ColumnsService } from '../columns/columns.service';
import { Card } from '../../common/entities/card.entity';
import { CreateCardDto } from '../../common/dto/create-card.dto';
import { UpdateCardDto } from '../../common/dto/update-card.dto';
import { NotFoundException } from '@nestjs/common';

describe('CardsService', () => {
  let service: CardsService;
  let repository: Repository<Card>;
  let columnsService: ColumnsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  const mockColumnsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockRepository,
        },
        {
          provide: ColumnsService,
          useValue: mockColumnsService,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    repository = module.get<Repository<Card>>(getRepositoryToken(Card));
    columnsService = module.get<ColumnsService>(ColumnsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const createCardDto: CreateCardDto = {
        title: 'Test Card',
        description: 'Test Description',
        position: 1,
        columnId: 1,
      };

      const expectedCard = {
        id: 1,
        ...createCardDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockColumnsService.findOne.mockResolvedValue({ id: 1, title: 'Test Column' });
      mockRepository.create.mockReturnValue(expectedCard);
      mockRepository.save.mockResolvedValue(expectedCard);

      const result = await service.create(createCardDto);

      expect(mockColumnsService.findOne).toHaveBeenCalledWith(createCardDto.columnId);
      expect(mockRepository.create).toHaveBeenCalledWith(createCardDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedCard);
      expect(result).toEqual(expectedCard);
    });

    it('should throw error when column does not exist', async () => {
      const createCardDto: CreateCardDto = {
        title: 'Test Card',
        description: 'Test Description',
        position: 1,
        columnId: 999,
      };

      mockColumnsService.findOne.mockRejectedValue(
        new NotFoundException('Column with ID 999 not found'),
      );

      await expect(service.create(createCardDto)).rejects.toThrow(
        new NotFoundException('Column with ID 999 not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const expectedCards = [
        {
          id: 1,
          title: 'Card 1',
          description: 'Description 1',
          position: 1,
          columnId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Card 2',
          description: 'Description 2',
          position: 2,
          columnId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(expectedCards);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedCards);
    });
  });

  describe('findOne', () => {
    it('should return a card by id', async () => {
      const cardId = 1;
      const expectedCard = {
        id: cardId,
        title: 'Test Card',
        description: 'Test Description',
        position: 1,
        columnId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(expectedCard);

      const result = await service.findOne(cardId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(result).toEqual(expectedCard);
    });

    it('should throw NotFoundException when card not found', async () => {
      const cardId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(cardId)).rejects.toThrow(
        new NotFoundException(`Card with ID ${cardId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      const cardId = 1;
      const updateCardDto: UpdateCardDto = {
        title: 'Updated Card',
      };

      const existingCard = {
        id: cardId,
        title: 'Original Card',
        description: 'Original Description',
        position: 1,
        columnId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCard = {
        ...existingCard,
        ...updateCardDto,
      };

      mockRepository.findOne.mockResolvedValue(existingCard);
      mockRepository.merge.mockImplementation((entity, dto) => {
        Object.assign(entity, dto);
        return entity;
      });
      mockRepository.save.mockResolvedValue(updatedCard);

      const result = await service.update(cardId, updateCardDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingCard, updateCardDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedCard);
      expect(result).toEqual(updatedCard);
    });

    it('should validate column when columnId is provided in update', async () => {
      const cardId = 1;
      const updateCardDto: UpdateCardDto = {
        title: 'Updated Card',
        columnId: 2,
      };

      const existingCard = {
        id: cardId,
        title: 'Original Card',
        description: 'Original Description',
        position: 1,
        columnId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCard = {
        ...existingCard,
        ...updateCardDto,
      };

      mockRepository.findOne.mockResolvedValue(existingCard);
      mockColumnsService.findOne.mockResolvedValue({ id: 2, title: 'New Column' });
      mockRepository.merge.mockImplementation((entity, dto) => {
        Object.assign(entity, dto);
        return entity;
      });
      mockRepository.save.mockResolvedValue(updatedCard);

      const result = await service.update(cardId, updateCardDto);

      expect(mockColumnsService.findOne).toHaveBeenCalledWith(updateCardDto.columnId);
      expect(result).toEqual(updatedCard);
    });

    it('should throw error when updating card with non-existent column', async () => {
      const cardId = 1;
      const updateCardDto: UpdateCardDto = {
        title: 'Updated Card',
        columnId: 999,
      };

      const existingCard = {
        id: cardId,
        title: 'Original Card',
        description: 'Original Description',
        position: 1,
        columnId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingCard);
      mockColumnsService.findOne.mockRejectedValue(
        new NotFoundException('Column with ID 999 not found'),
      );

      await expect(service.update(cardId, updateCardDto)).rejects.toThrow(
        new NotFoundException('Column with ID 999 not found'),
      );
    });

    it('should throw NotFoundException when updating non-existent card', async () => {
      const cardId = 999;
      const updateCardDto: UpdateCardDto = {
        title: 'Updated Card',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(cardId, updateCardDto)).rejects.toThrow(
        new NotFoundException(`Card with ID ${cardId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a card', async () => {
      const cardId = 1;

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(cardId);

      expect(mockRepository.delete).toHaveBeenCalledWith(cardId);
    });

    it('should throw NotFoundException when removing non-existent card', async () => {
      const cardId = 999;

      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(cardId)).rejects.toThrow(
        new NotFoundException(`Card with ID ${cardId} not found`),
      );
    });
  });
});
