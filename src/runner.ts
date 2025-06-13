import createApp, { type AppConfig } from './app'
import process from 'node:process'
import pkg from '../package.json'
import chalk from 'chalk'

export type AppConfigCbType = () => AppConfig

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

export function runApp(configOrCb: AppConfig | AppConfigCbType) {
  const config: AppConfig = typeof configOrCb === 'function' ? configOrCb() : configOrCb
  createApp(config)
}

export function runCli() {
  // 有一个解析配置文件的过程
  const args = process.argv.slice(2).filter(Boolean)
  if (args.length === 1 && (args[0].toLowerCase() === '-v' || args[0].toLowerCase() === '--version')) {
    console.log(chalk.green(`v${pkg.version}`))
    return
  }
  if (args.length === 1 && (args[0].toLowerCase() === '-h' || args[0].toLowerCase() === '--help')) {
    console.log(`${chalk.green(`${pkg.name}`)} ${chalk.gray(`${pkg.description}`)} \n`)
    console.log(`Usage: asr [options] \n`)

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
}
