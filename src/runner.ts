import type { Server } from 'node:http'
import type { AppConfig, AppConfigCbType } from './types'
import process from 'node:process'
import chalk from 'chalk'
import chokidar from 'chokidar'
import pkg from '../package.json'
import createApp from './app'
import { parseDepPaths, resloveConfig } from './config'



// createApp({
//   port: 9000,
//   proxy: {
//     '/api': {
//       target: 'http://localhost:3000',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '',
//       },
//     },
//   },
//   plugins: [jsonServerPlugin],
// })

export function runApp(configOrCb: AppConfig | AppConfigCbType): Server {
  const config: AppConfig = typeof configOrCb === 'function' ? configOrCb() : configOrCb
  const app = createApp(config)

  const server = app.listen(config.port, () => {
    const url = `http://localhost:${config.port}`
    console.log(`${chalk.gray('server:')}: ${chalk.green(url)}`)
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
