import type { Request } from 'express'
import type { Context } from '@/types'

export function useContext(request: Request): Context | null {
  if (request?.app && request.app.locals && request.app.locals.context) {
    return request.app.locals.context
  }
  return null
}
