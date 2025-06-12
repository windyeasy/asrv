import type { Request, Response, NextFunction } from 'express'

export type MiddlewareType = (request: Request, response: Response, next: NextFunction) => void
