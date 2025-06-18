import type { AppConfig } from './app'
import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'
import { loadConfig } from 'unconfig'

export function defineConfig(config: AppConfig): AppConfig {
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
