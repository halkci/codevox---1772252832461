import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './dish.entity';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishService],
  controllers: [DishController],
  exports: [DishService],
})
export class DishModule {}
