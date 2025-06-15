export default class Service<T = any> {
  constructor(private _db: Record<string, T>) {}

  get db(): Record<string, T> {
    return this._db
  }

  find(name: string): any {
    return this.db[name]
  }

  findById(name: string, id: string | number): any {
    const data = this.db[name]
    if (data && Array.isArray(data)) {
      const result = data.find(item => item.id === id)
      return result
    }
  }
}
