import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  username: string;
  userId: number;
  workspaceId: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);