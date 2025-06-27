import type { ChildProcess } from 'node:child_process'
import type { Server } from 'node:http'
import type { AppConfig, AppConfigCbType } from './types'
import { fork } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import chokidar from 'chokidar'
import pkg from '../package.json'
import { createApp } from './app'
import { __dirname, parseDepPaths, resloveConfig } from './config'

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

/**
 * 代理信息打印提示
 */
function printProxyTips(addresses: string[], config: AppConfig['proxy']): void {
  if (config) {
    console.log(chalk.gray('Proxy server:'))
    const proxyKeys = Object.keys(config)

    proxyKeys.forEach((key) => {
      addresses.forEach((address) => {
        const target = config[key]!.target
        const serverAddress = key.startsWith('/') ? `${address}${key}` : `${address}/${key}`
        console.log(`  ${chalk.green(serverAddress)} → ${chalk.green(target)}`)
      })
    })
  }
}

export function runApp(configOrCb: AppConfig | AppConfigCbType): Server {
  const config: AppConfig = typeof configOrCb === 'function' ? configOrCb() : configOrCb
  const app = createApp(config)
  config.port = config.port || 9000
  const server = app.listen(config.port!, '0.0.0.0', () => {
    const addresses = getAccessibleAddresses(config.port!)
    // 提示代理信息
    printProxyTips(addresses, config.proxy)

    // 提示开启服务的信息
    console.log(`\n${chalk.gray('Server is running. Accessible at')}:`)
    for (const address of addresses) {
      console.log(`  → ${chalk.green(address)}`)
    }
  })

  return server
}

export async function run() {
  const args = process.argv.slice(2).filter(Boolean)
  let server: null | Server = null
  async function startRun() {
    if (server)
      server.close()
    const configPath: string | undefined = args.length === 2 ? args[1] : undefined
    const { config, path } = await resloveConfig(configPath)
    config.swaggerDeps = [path]

    if (config.$deps) {
      const deps = await parseDepPaths(config.$deps)
      // swagger依赖
      config.swaggerDeps.push(...deps)
    }

    server = runApp(config)
  }
  startRun()
}

let child: null | ChildProcess = null

function startServer(args: string[]) {
  if (child) {
    child.kill()
  }
  const childPath = path.resolve(__dirname, '../bin/child-runner.mjs')
  child = fork(childPath, args)
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Service restart failed please check the configuration`)
    }
  })
}

export async function watchFileChange(args: string[]) {
  const argConfigPath: string | undefined = args.length === 2 ? args[1] : undefined
  const watchPaths: string[] = []
  try {
    const { config, path } = await resloveConfig(argConfigPath)
    watchPaths.push(path)
    if (config.$deps) {
      const deps = await parseDepPaths(config.$deps)
      watchPaths.push(...deps)
    }
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }

  startServer(args)
  chokidar.watch(watchPaths, { ignoreInitial: true }).on('change', () => {
    console.log(chalk.green(`asrv Config changed`))
    startServer(args)
  })
}

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

  if (args.length === 2 && (args[0].toLowerCase() === '-c' || args[0].toLowerCase() === '--config')) {
    // startRunApp()
    watchFileChange(args)
    return
  }

  if (args.length === 0) {
    watchFileChange(args)
  }
}
