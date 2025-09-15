import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Workspace } from 'src/workspaces/workspace.entity';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Workspace]), IdempotencyModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
