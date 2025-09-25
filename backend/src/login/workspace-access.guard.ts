import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthUser } from './current-user.decorator';

@Injectable()
export class WorkspaceAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    const workspaceId = parseInt(request.params.id, 10);

    if (!user.workspaceId) {
      throw new ForbiddenException('User does not have access to any workspace');
    }

    if (user.workspaceId !== workspaceId) {
      throw new ForbiddenException('User does not have access to this workspace');
    }

    return true;
  }
}