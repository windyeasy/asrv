import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

function createConfig(isProperty) {
  const sourcemap = isProperty ? false : true
  /**
   * @type {import('rollup').RollupOptions}
   */
  return [
    {
      input: 'src/index.ts',
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
        resolve({
          extensions: ['.js', '.ts', '.json', '.tsx', '.jsx', '.mjs', '.mts', '.cjs'],
        }),
        commonjs(),
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
