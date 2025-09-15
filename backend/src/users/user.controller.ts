import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards, UseInterceptors, Headers, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Headers('Idempotency-Key') idempotencyKey: string): Promise<UserDto[]> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const users = await this.userService.findAll();
    return users.map(u => new UserDto(u));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string): Promise<UserDto> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return new UserDto(user);
  }

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  async create(@Body() user: User): Promise<UserDto> {
    return new UserDto(await this.userService.create(user));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string, @Body() user: User): Promise<User> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const updatedUser = await this.userService.update(+id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string): Promise<void> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    return this.userService.remove(+id);
  }
}
