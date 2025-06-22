import type { Express } from 'express'
import type { Context } from '@/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PluginDeriver from '../src/plugin-deriver'

const mockApp = {
  use: vi.fn(),
  listen: vi.fn(),
} as unknown as Express

const context: Context = {
  app: mockApp,
  port: 9000,
  config: {
    port: 9000,
  },
}

describe('plugin-deriver', () => {
  let deriver: PluginDeriver

  // 在每个测试前初始化实例, 避免空间重复占用
  beforeEach(() => {
    deriver = new PluginDeriver(context)
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('install', () => {
    it('安装名称不存plugin在能够添加成功', () => {
      expect(deriver.install({
        name: 'json-server',
        apply: vi.fn(),
      })).toBe(true)
    })

    it('安装名称存在plugin在添加报错', () => {
      const pluginName = 'test-repeat-plugin'
      expect(() => {
        deriver.install({
          name: pluginName,
          apply: vi.fn(),
        })
        deriver.install({
          name: pluginName,
          apply: vi.fn(),
        })
      }).toThrowError(`plugin ${pluginName} has been installed`)
    })
  })
})
