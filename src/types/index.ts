import type { NextFunction, Request, Response } from 'express'

export type MiddlewareType = (request: Request, response: Response, next: NextFunction) => void
