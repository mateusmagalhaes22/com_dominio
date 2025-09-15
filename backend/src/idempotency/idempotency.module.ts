import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyKey } from './IdempotencyKey.entity';
import { IdempotencyInterceptor } from './idempotency.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotencyKey])],
  providers: [IdempotencyInterceptor],
  exports: [
    IdempotencyInterceptor,
    TypeOrmModule,
  ],
})
export class IdempotencyModule {}
