import type { Request } from 'express'
import type { Data } from '@/plugins/server-plugin/service'
import { useContext } from './useContext'

export async function useData<T extends Data>(request: Request): Promise<[T, (data: T) => void]> {
  const context = useContext(request)

  if (!context) {
    throw new Error('context is null')
  }
  console.log(context.server)
  if (!context.server || !context.server.service) {
    throw new Error('data service not enabled ')
  }

  const service = context.server.service
  async function getData(): Promise<T> {
    return service.getData() as T
  }

  function setData(data: T): void {
    service.setData(data)
  }
  const data = await getData()

  return [data, setData]
}
