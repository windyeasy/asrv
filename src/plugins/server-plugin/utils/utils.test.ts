import type { ApiType } from '..'

import { describe, expect, it } from 'vitest'
import { checkApiKey, flatApiInfo, getReqMethodAndUrlByKey } from './index'

describe('utils', () => {
  describe('checkApiKey', () => {
    it('should return true when key is valid', () => {
      const key = '123456'
      const result = checkApiKey(key)
      expect(result).toBe(true)
    })

    it('should return false when key is empty string', () => {
      const key = ''
      const result = checkApiKey(key)
      expect(result).toBe(false)
    })

    it('当key有个空格时返回true并且第一空格前是正确请求方法', () => {
      const key = 'post /api/user/list'
      const result = checkApiKey(key)
      expect(result).toBe(true)
    })

    it('当key有个空格时返回false并且第一空格前不是正确请求方法', () => {
      const key = 'test /api/user/list'
      const result = checkApiKey(key)
      expect(result).toBe(false)
    })

    it('当key大于两个空格时返回false', () => {
      const key = 'post user list'
      const result = checkApiKey(key)
      expect(result).toBe(false)
    })
  })

  describe('getReqMethodAndUrlByKey', () => {
    it('当key没有空格时返回正确结果', () => {
      const key = '/api/user/list'
      const result = getReqMethodAndUrlByKey(key)
      expect(result).toEqual(['get', '/api/user/list'])
    })

    it('当key有空格时返回正确的结果', () => {
      const method = 'get'
      const url = '/api/user/list'
      const key = `${method}  ${url}`
      const result = getReqMethodAndUrlByKey(key)
      expect(result).toEqual([method, key])
    })

    it('当空格前的字符是大写时返回正确结果', () => {
      const method = 'Get'
      const url = '/api/user/list'
      const key = `${method} ${url}`
      const result = getReqMethodAndUrlByKey(key)
      expect(result).toEqual(['get', url])
    })
  })

  describe('flatApiInfo', () => {
    const apiInfo: ApiType = {
      'api': {
        user: {
          list: [],
          detail: 'detail',
        },
      },

      'api2': 'api2',
      'post api3': 'api3',
      'post api4': {
        'get post': [],
      },
    }

    it('should return correct result', () => {
      expect(flatApiInfo(apiInfo)).toEqual([
        {
          method: 'get',
          url: '/api/user/list',
          value: [],
        },
        {
          method: 'get',
          url: '/api/user/detail',
          value: 'detail',
        },
        {
          method: 'get',
          url: '/api2',
          value: 'api2',
        },
        {
          method: 'post',
          url: '/api3',
          value: 'api3',
        },
        {
          method: 'get',
          url: '/api4/post',
          value: [],
        },
      ])
    })

    it('should return correct result when apiInfo is empty', () => {
      expect(flatApiInfo({})).toEqual([])
    })

    it('a warning is issued if the wrong value is passed', () => {
      expect(flatApiInfo({
        'post api5 test': 'test',
      })).toEqual([])
    })
  })
})
