import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnsService } from './columns.service';
import { Column } from '../../common/entities/column.entity';
import { CreateColumnDto } from '../../common/dto/create-column.dto';
import { UpdateColumnDto } from '../../common/dto/update-column.dto';
import { NotFoundException } from '@nestjs/common';

describe('ColumnsService', () => {
  let service: ColumnsService;
  let repository: Repository<Column>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: getRepositoryToken(Column),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
    repository = module.get<Repository<Column>>(getRepositoryToken(Column));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new column', async () => {
      const createColumnDto: CreateColumnDto = {
        title: 'Test Column',
        position: 1,
      };

      const expectedColumn = {
        id: 1,
        ...createColumnDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };

      mockRepository.create.mockReturnValue(expectedColumn);
      mockRepository.save.mockResolvedValue(expectedColumn);

      const result = await service.create(createColumnDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createColumnDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedColumn);
      expect(result).toEqual(expectedColumn);
    });
  });

  describe('findAll', () => {
    it('should return all columns with cards', async () => {
      const expectedColumns = [
        {
          id: 1,
          title: 'Column 1',
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        },
        {
          id: 2,
          title: 'Column 2',
          position: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        },
      ];

      mockRepository.find.mockResolvedValue(expectedColumns);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['cards'],
        order: { position: 'ASC' },
      });
      expect(result).toEqual(expectedColumns);
    });
  });

  describe('findOne', () => {
    it('should return a column by id', async () => {
      const columnId = 1;
      const expectedColumn = {
        id: columnId,
        title: 'Test Column',
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };

      mockRepository.findOne.mockResolvedValue(expectedColumn);

      const result = await service.findOne(columnId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
        relations: ['cards'],
      });
      expect(result).toEqual(expectedColumn);
    });

    it('should throw NotFoundException when column not found', async () => {
      const columnId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(columnId)).rejects.toThrow(
        new NotFoundException(`Column with ID ${columnId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a column', async () => {
      const columnId = 1;
      const updateColumnDto: UpdateColumnDto = {
        title: 'Updated Column',
      };

      const existingColumn = {
        id: columnId,
        title: 'Original Column',
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };

      const updatedColumn = {
        ...existingColumn,
        ...updateColumnDto,
      };

      mockRepository.findOne.mockResolvedValue(existingColumn);
      mockRepository.merge.mockImplementation((entity, dto) => {
        Object.assign(entity, dto);
        return entity;
      });
      mockRepository.save.mockResolvedValue(updatedColumn);

      const result = await service.update(columnId, updateColumnDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
        relations: ['cards'],
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingColumn, updateColumnDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedColumn);
      expect(result).toEqual(updatedColumn);
    });

    it('should throw NotFoundException when updating non-existent column', async () => {
      const columnId = 999;
      const updateColumnDto: UpdateColumnDto = {
        title: 'Updated Column',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(columnId, updateColumnDto)).rejects.toThrow(
        new NotFoundException(`Column with ID ${columnId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a column', async () => {
      const columnId = 1;

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(columnId);

      expect(mockRepository.delete).toHaveBeenCalledWith(columnId);
    });

    it('should throw NotFoundException when removing non-existent column', async () => {
      const columnId = 999;

      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(columnId)).rejects.toThrow(
        new NotFoundException(`Column with ID ${columnId} not found`),
      );
    });
  });
});
