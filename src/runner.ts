import type { Server } from 'node:http'
import type { AppConfig, AppConfigCbType } from './types'
import os from 'node:os'
import process from 'node:process'
import chalk from 'chalk'
import chokidar from 'chokidar'
import pkg from '../package.json'
import createApp from './app'
import { parseDepPaths, resloveConfig } from './config'

/**
 * 获取本机所有可通过网络访问的 IPv4 地址
 * @param {number} port 要附加的端口号
 * @returns {string[]} 可访问的完整地址数组（如 http://192.168.1.100:3000）
 */
export function getAccessibleAddresses(port: number): string[] {
  const interfaces = os.networkInterfaces()
  const addresses = []

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(`http://${iface.address}:${port}`)
      }
    }
  }

  // 加上 localhost
  addresses.push(`http://localhost:${port}`)

  return addresses
}

export function runApp(configOrCb: AppConfig | AppConfigCbType): Server {
  const config: AppConfig = typeof configOrCb === 'function' ? configOrCb() : configOrCb
  const app = createApp(config)

  const server = app.listen(config.port!, '0.0.0.0', () => {
    console.log(`${chalk.gray('Server is running. Accessible at')}:`)
    const addresses = getAccessibleAddresses(config.port!)
    for (const address of addresses) {
      console.log(`  → ${chalk.green(address)}`)
    }
  })

  return server
}

let server: null | Server = null

export async function runCli(): Promise<void> {
  const args = process.argv.slice(2).filter(Boolean)
  if (args.length === 1 && (args[0].toLowerCase() === '-v' || args[0].toLowerCase() === '--version')) {
    console.log(chalk.green(`v${pkg.version}`))
    return
  }
  if (args.length === 1 && (args[0].toLowerCase() === '-h' || args[0].toLowerCase() === '--help')) {
    console.log(`${chalk.green(`${pkg.name}`)}: ${chalk.gray(`${pkg.description}`)} \n`)
    console.log(`Usage: ${pkg.name} [options] \n`)

    const options = [
      {
        name: '-v, --version',
        description: 'Output the version number',
      },
      {
        name: '-h, --help',
        description: 'Display help for command',
      },
      {
        name: '-c, --config',
        description: 'a config file path, example：-c ./config.js',
      },
    ]
    console.log('Options:')
    options.forEach((option) => {
      console.log(`  ${option.name}   - ${option.description}`)
    })
    return
  }

  async function startRunApp(): Promise<void> {
    if (server)
      server.close()
    const configPath: string | undefined = args.length === 2 ? args[1] : undefined
    const { config, path } = await resloveConfig(configPath)
    server = runApp(config)
    const watchPaths: string[] = [path]

    if (config.$deps) {
      const deps = await parseDepPaths(config.$deps)
      console.log(deps)
      watchPaths.push(...deps)
    }

    chokidar.watch(watchPaths, { ignoreInitial: true }).on('change', () => {
      console.log(chalk.green(`asrv Config changed`))
      startRunApp()
    })
  }

  if (args.length === 2 && (args[0].toLowerCase() === '-c' || args[0].toLowerCase() === '--config')) {
    startRunApp()
    return
  }

  if (args.length === 0) {
    startRunApp()
  }
}
const db = {
  user: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jim' },
  ],
  post: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 },
    { id: 3, title: 'Post 3', userId: 3 },
  ],
}

const config: AppConfig = {
  port: 9000,
  enableServer: true, // default true
  enableLoggerFile: true,
  server: {
    db,
    api: {
      api: 'testString',
      api3: 'testString',
      api2: {
        user: {
          list: [],
          info: JSON.stringify({
            id: 30,
            name: 'xiaoming',
            age: 18,
          }),
          // 数据的读写
          list2(req, res, next, context) {
            const { useData } = context.server!
            // todo: 修改类型
            const [data, setData] = useData<typeof db>()
            // todo: 修改数据与保存
            data.user[0] = {
              id: 20,
              name: 'xiaoming',
            }
            setData({ ...data })
            res.send('数据写入成功')
          },
        },
      },
    },
  },
}

runApp(config)
