import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && user.password === password && user.active) {
      return user;
    }
    return null;
  }
}
