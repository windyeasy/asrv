import type { Low } from 'lowdb'
import { Service } from '@windyeasy/json-server'

export type Data = Record<string, any>

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

  getData<T extends Data>(): T {
    return this.#database.data as T
  }

  async setData(data: Data): Promise<void> {
    if (this.#database.data !== data) {
      this.#database.data = data
      return this.write()
    }
  }
}
