import type { Context } from 'node:vm'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

export function useSwagger(context: Context): void {
  const app = context.app
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'asrv API',
        version: '1.0.0',
        description: 'Automatically generated API documentation',
      },
    },
    apis: context.config.swaggerDeps || [], // 注释路径
  })

  const swaggerUiHandler = swaggerUi.serve
  const swaggerDocsHandler = swaggerUi.setup(swaggerSpec)
  app.use('/api-swagger-doc', swaggerUiHandler, swaggerDocsHandler)
}
