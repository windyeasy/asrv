type Data = {
  [key: string]: unknown
}

export default class Service {
  constructor(private _db: Data) {}

  get db() {
    return this._db
  }

  find(name: string) {
    return this.db[name]
  }

  findById(name: string, id: string) {
    const data = this.db[name]
    if (data && Array.isArray(data)) {
      const result = data.find(item => item.id === id)
      return result
    }
    return
  }
}
