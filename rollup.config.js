import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import nodeResolve from '@rollup/plugin-node-resolve'
import { builtinModules } from 'node:module'
import fs from 'node:fs'
function getPkgJson() {
  const pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  return pkgJson
}
function createConfig(isProperty) {
  const sourcemap = isProperty ? false : true
  const pkg = getPkgJson()

  /**
   * @type {import('rollup').RollupOptions}
   */
  return [
    {
      input: 'src/index.ts',
      external: [
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
      ],
      output: [
        {
          file: './dist/index.cjs',
          format: 'cjs',
          exports: 'named',
          sourcemap,
        },
        {
          file: './dist/index.mjs',
          format: 'es',
          sourcemap,
        },
      ],
      plugins: [
        commonjs(),
        nodeResolve({
          preferBuiltins: true,
          extensions: ['.js', '.json', '.ts', '.tsx', '.mjs', '.cjs'],
        }),
        json(),
        typescript({
          tsconfig: './tsconfig.json',
          sourceMap: sourcemap,
        }),
      ],
    },
    {
      input: 'src/index.ts',
      output: {
        file: 'dist/index.d.ts',
        format: 'es',
      },
      plugins: [dts()],
    },
  ]
}

export default (commandLineArguments) => {
  const isDevelopment = commandLineArguments.watch

  return createConfig(!isDevelopment)
}
