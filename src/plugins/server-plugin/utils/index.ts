import chalk from 'chalk'
import type { ApiKeyType, IServer } from '..'
import type { Context } from '../../../app'

export function checkApiKey(key: string): boolean {
  if (!key)
    return false
  const keyArray = key.split(' ')
  const requestMethods = ['get', 'post', 'put', 'delete', 'patch']
  if (keyArray.length > 2 || keyArray.length < 1) {
    console.warn(chalk.yellow(`api key ${key} is not valid`))
    return false
  }

  if (keyArray.length === 2) {
    if (!requestMethods.includes(keyArray[0].toLowerCase())) {
      console.warn(chalk.yellow(`api key ${key} is not valid`))
      return false
    }
  }
  return true
}

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
export function getReqMethodAndUrlByKey(key: string): [RequestMethod, string] {
  const keyArray = key.split(' ')
  if (keyArray.length === 2) {
    return [keyArray[0].toLowerCase() as RequestMethod, keyArray[1]]
  }
  return ['get', key]
}

// todo: 后面获取类型
export function apiRegister(key: string, value: ApiKeyType, context: Context): any {
  const app = context.app
  const [method, url] = getReqMethodAndUrlByKey(key)

  if (typeof value === 'string' || Array.isArray(value)) {
    console.log(key, value)
    console.log(method, url)
    const newUrl = url[0] !== '/' ? '/' + url : url
    app[method](newUrl, (_, res) => {
      console.log("apiRegister", {method, url})
      res.json(value)
    })
    return
  }
  // todo: useJsonServer
  if (typeof value === 'function') {
    app[method](url, (req, res, next) => {
      return value(req, res, next, context)
    })
    return
  }

  // todo: 将配置信息解析为数组：[[method, url, value]] = ['get', '/api/user', 'string']
  // { api: { list: []}} => `get /api/list`
  // { `post api`: { list: [] }} => `post /api/list`
  // { `post api`: { 'get list': [] }} => `post /api/get list`
  
  // todo: 写方档时记录，定义的API，会覆盖掉JSONServer的API, 给警句提示
  if (typeof value === 'object') {
    const childKeys = Object.keys(value)
    for (const childKey of childKeys) {
      if (checkApiKey(childKey)) {
        continue
      }
      const childKeySplitArray = childKey.split(' ')
      let newKey = `${key}/${childKeySplitArray[1]}`
      if (childKeySplitArray.length === 2){
        newKey = `${childKeySplitArray[0]} ${key+childKeySplitArray[1]}}`
      }
      apiRegister(`${newKey}`, value[childKey], context)
    }
  }
}

export function handleApi(api: IServer['api'], context: Context): void {
  const keys = Object.keys(api)
  for (const key of keys) {
    if (!checkApiKey(key)) {
      continue
    }
    const value = api[key]
    apiRegister(key, value, context)
  }
}
