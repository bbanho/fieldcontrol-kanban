import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DtoModule } from './common/dto/dto.module';
import { EntitiesModule } from './common/entities/entities.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [DtoModule, EntitiesModule, ColumnsModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
