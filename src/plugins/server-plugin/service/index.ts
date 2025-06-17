import type { Data } from '@windyeasy/json-server'
import type { Low } from 'lowdb'
import { Service } from '@windyeasy/json-server'

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

  getData(): Data {
    return this.#database.data
  }

  async setData(data: Data): Promise<void> {
    this.#database.data = data
    return this.write()
  }
}
