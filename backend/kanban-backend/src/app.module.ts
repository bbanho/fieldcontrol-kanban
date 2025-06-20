import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DtoModule } from './common/dto/dto.module';
import { EntitiesModule } from './common/entities/entities.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'kanban_user',
      password: 'kanban_password',
      database: 'kanban_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DtoModule,
    EntitiesModule,
    ColumnsModule,
    CardsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
