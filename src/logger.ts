import type { NextFunction, Request, Response } from 'express'
import type { MiddlewareType } from './types'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

export interface LoggerConfig {
  /**
   * 是否开启日志文件
   * @default true
   */
  enableLoggerFile?: boolean
  level?: 'info' | 'warn' | 'error'
}

export function createLoggerMiddleware(config: LoggerConfig): MiddlewareType {
  const { enableLoggerFile = true } = config
  // 未开启日志文件，不生成日志文件，todo: 测试
  const dailyRotates = enableLoggerFile === true
    ? [new DailyRotateFile({
        filename: 'asrv/logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d',
        level: config.level || 'info',
        format: format.combine(
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`
          }),
        ),
      })]
    : []
  const logger = createLogger({
    transports: [
      ...dailyRotates,
      new transports.Console({
        level: config.level || 'info',
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  })
  return function logMiddleware(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      const msg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`

      if (res.statusCode >= 500) {
      // 服务器错误
        logger.error(msg)
      }
      else if (res.statusCode >= 400) {
      // 客户端错误或警告
        logger.warn(msg)
      }
      else {
      // 成功响应
        logger.info(msg)
      }
    })
    next()
  }
}
