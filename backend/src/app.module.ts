import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from './dish/dish.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { DishService } from './dish/dish.service';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'malatang',
      password: process.env.DB_PASSWORD || 'malatang2024',
      database: process.env.DB_DATABASE || 'malatang_pos',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DishModule,
    OrderModule,
    UserModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dishService: DishService, private userService: UserService) {}
  
  async onModuleInit() {
    const dishes = await this.dishService.findAll();
    if (dishes.length === 0) {
      const defaultDishes = [
        { name: '青菜', icon: '🥬', price: 12.8 },
        { name: '西兰花', icon: '🥦', price: 15.0 },
        { name: '蘑菇', icon: '🍄', price: 18.0 },
        { name: '萝卜', icon: '🥕', price: 8.0 },
        { name: '肥牛', icon: '🥩', price: 38.0 },
        { name: '排骨', icon: '🍖', price: 42.0 },
        { name: '虾仁', icon: '🦐', price: 45.0 },
        { name: '鹌鹑蛋', icon: '🥚', price: 20.0 },
        { name: '宽粉', icon: '🍜', price: 10.0 },
        { name: '油炸', icon: '🍤', price: 22.0 },
        { name: '火腿', icon: '🌭', price: 18.0 },
        { name: '豆腐', icon: '🧈', price: 6.0 },
        { name: '鸡蛋', icon: '🥚', price: 12.0 },
        { name: '生菜', icon: '🥬', price: 10.0 },
        { name: '娃娃菜', icon: '🥬', price: 12.0 },
        { name: '鱼丸', icon: '🍡', price: 18.0 },
      ];
      for (const dish of defaultDishes) {
        await this.dishService.create(dish);
      }
      console.log('Default dishes created');
    }

    const users = await this.userService.findAll();
    if (users.length === 0) {
      await this.userService.create({ username: 'admin', password: 'admin123', name: '管理员', role: 'admin' });
      await this.userService.create({ username: 'zhangliang', password: '123456', name: '张亮', role: 'manager' });
      await this.userService.create({ username: 'staff', password: '123456', name: '店员', role: 'staff' });
      console.log('Default users created');
    }
  }
}
