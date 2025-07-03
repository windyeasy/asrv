/// <reference types="vite/client" />
declare interface Window {
  // extend the window
}

// with unplugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

// src/types/vue-json-view.d.ts
declare module '@matpool/vue-json-view' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{
    src: string | Record<string, any>
  }, object, any>
  export default component
}
