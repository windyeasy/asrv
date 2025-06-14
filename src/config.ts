import type { AppConfig } from './app'
import { loadConfig } from 'unconfig'
export function defineConfig(config: AppConfig): AppConfig {
  return config
}

export async function resloveConfig(configPath?: string): Promise<AppConfig> {
  if (!configPath) {
    configPath = 'asr.config'
  }

  const { config } = await loadConfig<AppConfig | undefined>({
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
  return config
}
