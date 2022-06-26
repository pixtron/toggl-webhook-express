import { Logger, LogFn } from './types.js';

const logFn: LogFn = (msg: string, tag: string, meta: unknown): void => {
  console.log(tag, msg, meta);
}

export const logger: Logger = {
  silly: logFn,
  debug: logFn,
  notice: logFn,
  info: logFn,
  warning: logFn,
  error: logFn,
}
