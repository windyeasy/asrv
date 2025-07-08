import type { MiddlewareType } from "@/types";

/**
 * 可以批量使用中间件
 * @param middlewares  
 * @returns 返回中间件数组
 */
export function useMiddlewares(...middlewares: MiddlewareType[]): MiddlewareType[] {
  return middlewares
}
