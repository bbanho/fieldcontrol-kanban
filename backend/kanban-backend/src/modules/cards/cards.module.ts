import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../../common/entities/card.entity';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), ColumnsModule],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
