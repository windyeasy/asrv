import type { Context } from './app'
export interface PluginType {
  name: string
  apply(context: Context): void
  hooks?: any // TODO: 待完善
}

class PluginDeriver {
  pluginsMap: Map<string, PluginType>
  constructor(private _context: Context) {
    this.pluginsMap = new Map()
  }

  install(plugin: PluginType) {
    if (this.pluginsMap.has(plugin.name)) {
      throw new Error(`plugin ${plugin.name} has been installed`)
    }
    this.pluginsMap.set(plugin.name, plugin)
    plugin.apply(this._context)
    return true
  }
}

export default PluginDeriver
