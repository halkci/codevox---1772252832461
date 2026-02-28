import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';

@Controller('api/dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  @Post()
  create(@Body() dish: Partial<Dish>) {
    return this.dishService.create(dish);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dish: Partial<Dish>) {
    return this.dishService.update(+id, dish);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dishService.delete(+id);
  }
}
