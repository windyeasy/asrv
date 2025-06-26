import type { Low } from 'lowdb'
import { Service } from '@windyeasy/json-server'

 type AnyO = Record<string, any>
export interface Data {
  [index: string]: any[] | AnyO
  [index: number]: any[] | AnyO

}
export type DbType = Low<Data>

export class AsrvService extends Service {
  #database: DbType
  constructor(db: DbType) {
    super(db)
    this.#database = db
  }

  write(): Promise<void> {
    return this.#database.write()
  }

  getData<T = Data>(): T {
    return this.#database.data as T
  }

  async setData<T = Data>(data: T): Promise<void> {
    if (this.#database.data !== data) {
      (this.#database.data as T) = data
      return this.write()
    }
  }
}
