import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentWorkerJwtPayloadByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user;

export const CurrentWorkerJwtPayload = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentWorkerJwtPayloadByContext(context),
);
