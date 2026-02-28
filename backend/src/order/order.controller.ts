import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.orderService.getTodayStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Post()
  create(@Body() order: Partial<Order>) {
    return this.orderService.create(order);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateStatus(+id, status);
  }
}
