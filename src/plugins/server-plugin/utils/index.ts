import type { ApiKeyType, APIMiddlewareType, ApiType, IServer } from '..'
import type { Context } from '../../../app'
import chalk from 'chalk'

export function checkApiKey(key: string): boolean {
  if (!key)
    return false
  const keyArray = key.split(' ')
  const requestMethods = ['get', 'post', 'put', 'delete', 'patch']
  if (keyArray.length > 2 || keyArray.length < 1) {
    console.warn(chalk.yellow(`api key "${key}" is not valid`))
    return false
  }

  if (keyArray.length === 2) {
    if (!requestMethods.includes(keyArray[0].toLowerCase())) {
      console.warn(chalk.yellow(`api key "${key}" is not valid`))
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

export interface RegisterApiInfo {
  method: RequestMethod
  url: string
  value: string | any[] | APIMiddlewareType
}

export function flatApiInfo(apiInfo: ApiType, prefix: string = ''): RegisterApiInfo[] {
  const keys = Object.keys(apiInfo)
  const result: RegisterApiInfo[] = []
  for (const key of keys) {
    if (!checkApiKey(key))
      continue

    let [method, url] = getReqMethodAndUrlByKey(key)
    url = url[0] === '/' ? url.replace('/', '') : url
    const value = apiInfo[key]
    if (typeof value === 'object' && !Array.isArray(value)) {
      result.push(...flatApiInfo(value, `${prefix}/${url}`))
    }
    else {
      const urlValue = `${prefix}/${url}`
      // Check if the url is repeated
      const checkIndex = result.findIndex(item => item.url === urlValue)
      if (checkIndex !== -1) {
        result.splice(checkIndex, 1)
        console.warn(chalk.yellow(`api key "${key}" is repeated`))
      }
      result.push({ method, url: urlValue, value })
    }
  }

  return result
}

function isJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  }
  catch {
    return false
  }
}

export function apiRegister(api: ApiType, context: Context): void {
  const app = context.app
  const registerApiInfos = flatApiInfo(api)

  registerApiInfos.forEach((info) => {
    app[info.method](info.url, (req, res, next) => {
      const value = info.value
      if (typeof value === 'function') {
        return value(req, res, next, context)
      }
      else if (typeof value === 'string') {
        if (isJSON(value)) {
          res.json(JSON.parse(value))
        }
        else {
          res.send(value)
        }
      }
      else {
        res.json(value)
      }
    })
  })
}
