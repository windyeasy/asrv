import { describe, expect, it } from 'vitest'
import Service from './index'

describe('service', () => {
  const db = {
    user: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Jim' },
    ],
  }
  const service = new Service(db)

  it('通过key 获取数据', () => {
    const data = service.find('user')
    expect(data).toEqual(db.user)
  })

  it('通过id 获取数据', () => {
    const data = service.findById('user', 1)
    expect(data).toEqual(db.user[0])
  })
})
