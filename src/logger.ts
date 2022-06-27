import { Logger } from './types.js';

export class DefaultLogger implements Logger {
  info(msg: string, tag: string, meta: unknown) {
    // eslint-disable-next-line no-console
    console.info(tag, msg, meta);
  }
  warning(msg: string, tag: string, meta: unknown) {
    // eslint-disable-next-line no-console
    console.warn(tag, msg, meta);
  }
}
