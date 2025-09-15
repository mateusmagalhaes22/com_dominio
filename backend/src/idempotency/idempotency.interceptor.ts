import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdempotencyKey } from './IdempotencyKey.entity';
import { tap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly idempotencyRepo: Repository<IdempotencyKey>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];

    if (!key) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    const existing = await this.idempotencyRepo.findOne({ where: { key } });
    if (existing) {
      return of(existing.response);
    }

    return next.handle().pipe(
      tap(async (response) => {
        const entry = this.idempotencyRepo.create({ key, response });
        await this.idempotencyRepo.save(entry);
      }),
    );
  }
}
