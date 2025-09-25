import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthUser } from './current-user.decorator';

@Injectable()
export class UserSelfAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    const requestedUserId = parseInt(request.params.id, 10);

    if (!user.userId) {
      throw new ForbiddenException('User not authenticated properly');
    }

    if (user.userId !== requestedUserId) {
      throw new ForbiddenException('Users can only access their own information');
    }

    return true;
  }
}