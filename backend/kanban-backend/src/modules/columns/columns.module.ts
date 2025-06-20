import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column } from '../../common/entities/column.entity';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [TypeOrmModule.forFeature([Column])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService]
})
export class ColumnsModule {}
