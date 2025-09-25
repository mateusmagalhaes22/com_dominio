import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards, UseInterceptors, Headers, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { UserSelfAccessGuard } from 'src/login/user-self-access.guard';
import { CurrentUser, type AuthUser } from 'src/login/current-user.decorator';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Headers('admin-key') adminKey: string): Promise<UserDto[]> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key for user access');
    }
    
    const foundUsers = await this.userService.findAll();
    return foundUsers.map(user => new UserDto(user));
  }

  @Get(':id')
  async findOne(@Headers('admin-key') adminKey: string, @Param('id') id: string): Promise<UserDto> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key for user access');
    }
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return new UserDto(user);
  }

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  async create(@Headers('admin-key') adminKey: string, @Body() user: User): Promise<UserDto> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key for user creation');
    }

    return new UserDto(await this.userService.create(user));
  }

  @Put(':id')
  async update(@Headers('admin-key') adminKey: string, @Param('id') id: string, @Body() user: User): Promise<User> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key for user update');
    }
    const updatedUser = await this.userService.update(+id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Headers('admin-key') adminKey: string, @Param('id') id: string): Promise<void> {
    const validAdminKey = process.env.ADMIN_KEY;

    if (!adminKey || adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key for user deletion');
    }
    return this.userService.remove(+id);
  }
}
