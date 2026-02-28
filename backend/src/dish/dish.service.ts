import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  async findAll(): Promise<Dish[]> {
    return this.dishRepository.find();
  }

  async findOne(id: number): Promise<Dish> {
    return this.dishRepository.findOne({ where: { id } });
  }

  async create(dish: Partial<Dish>): Promise<Dish> {
    return this.dishRepository.save(dish);
  }

  async update(id: number, dish: Partial<Dish>): Promise<Dish> {
    await this.dishRepository.update(id, dish);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.dishRepository.delete(id);
  }
}
