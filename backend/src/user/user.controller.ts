import { Controller, Get, Post, Put, Delete, Body, Param, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() user: Partial<User>) {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.login(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return { id: user.id, name: user.name, role: user.role };
  }
}
