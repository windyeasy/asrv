const db = {
  user: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jim' },
  ],
  post: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 },
    { id: 3, title: 'Post 3', userId: 3 },
  ],
}

export default {
  port: 9000,
  enableServer: true, // default true
  enableLogger: false,
  server: {
    db,
    api: {
      /**
       * @swagger
       * /api/hello:
       *   get:
       *     summary: 获取 hello 文本
       *     responses:
       *       200:
       *         description: 成功返回 hello
       */
      '/api/hello': 'Hello Swagger',
    },
  },
}
