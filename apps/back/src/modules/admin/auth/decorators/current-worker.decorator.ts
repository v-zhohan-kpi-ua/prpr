import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentWorkerByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user;

export const CurrentWorker = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentWorkerByContext(context),
);
