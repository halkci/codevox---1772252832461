import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async create(order: Partial<Order>): Promise<Order> {
    const orderNo = `ORD${Date.now()}`;
    return this.orderRepository.save({ ...order, orderNo });
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :today', { today })
      .getMany();

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgPrice = totalOrders > 0 ? totalSales / totalOrders : 0;

    return { totalOrders, totalSales, avgPrice };
  }
}
