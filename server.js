const Koa = require('koa');
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello World，I am in docker'
  console.log('sign is: ' + ctx.request.body.sign)
})
app.listen(8981)
