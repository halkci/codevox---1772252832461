import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private userService: UserService) {}
  
  async onModuleInit() {
    const users = await this.userService.findAll();
    if (users.length === 0) {
      await this.userService.create({ username: 'admin', password: 'admin123', name: '管理员', role: 'admin' });
      await this.userService.create({ username: 'zhangliang', password: '123456', name: '张亮', role: 'manager' });
      await this.userService.create({ username: 'staff', password: '123456', name: '店员', role: 'staff' });
      console.log('Default users created');
    }
  }
}
