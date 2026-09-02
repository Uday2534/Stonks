export interface LogContext {
  [key: string]: string | number | boolean | undefined;
}

export class Logger {
  static info(message: string, context?: LogContext): void {
    console.info('[INFO]', message, context ?? {});
  }

  static success(message: string, context?: LogContext): void {
    console.info('[SUCCESS]', message, context ?? {});
  }

  static error(message: string, context?: LogContext): void {
    console.error('[ERROR]', message, context ?? {});
  }
}
