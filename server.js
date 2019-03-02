const Koa = require('koa');
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello World，I am in docker'
})

app.listen(8981)