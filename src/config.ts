import type { IServer } from './plugins/server-plugin/types'
import type { AppConfig } from './types'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { loadConfig } from 'unconfig'

export function defineConfig(config: AppConfig): AppConfig {
  return config
}

export function defineServerConfig(config: IServer): IServer {
  return config
}

export function defineApiConfig(config: IServer['api']): IServer['api'] {
  return config
}

export async function resloveConfig(configPath?: string): Promise<{ config: AppConfig, path: string }> {
  if (!configPath) {
    configPath = './asrv.config'
  }

  const { config, sources } = await loadConfig<AppConfig | undefined>({
    sources: [
    // load from `my.config.xx`
      {
        files: configPath,
        // default extensions
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],

    merge: false,
  })
  if (!config) {
    throw new Error(`${configPath} config not found`)
  }
  return { config, path: sources[0] }
}

export function resolveConfigPath(configArg: string): string {
  return path.isAbsolute(configArg) ? configArg : path.resolve(process.cwd(), configArg)
}

export function parseDepPaths(deps: string[]): Promise<string[]> {
  return fg(deps, { absolute: true })
}

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
