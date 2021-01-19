import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

export default [{
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    format: 'cjs'
  }, {
    file: 'dist/index.mjs',
    format: 'esm'
  }],
  plugins: [
    {
      resolveId(id, importer) {
        // console.log(id, importer)
        if (id === 'jszip') {
          return this.resolve('jszip/dist/jszip.js', importer)
        }
        if (id === 'gotenberg-js-client') {
          return this.resolve('gotenberg-js-client/dist-src/index.js', importer)
        }
        if (id.startsWith('docx-templates')) {
          return this.resolve('./node_modules/docx-templates/src/index.ts', __filename)
        }
      }
    },
    {
      name: 'replace',

      transform(code, id) {
        return code.replace(/process\.env\.NODE_ENV/g, '"production"').replace(/process\.nextTick/g, 'undefined');
      }
    },
    json(),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.mjs', '.js', '.json', '.node']
    }),
    esbuild({
      target: 'es2020'
    }),
    commonjs(),
    terser()
  ],
  external: [
    'mime-db'
  ]
}, {
  input: "./dist/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [{
    resolveId(id) {
      if (id === 'docx-templates/lib/types') {
        return require.resolve('docx-templates/lib/types').split('.')[0] + '.d.ts'
      }
    }
  }, dts({
    respectExternal: false
  })],
},]