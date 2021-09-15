import Koa from 'koa';
import serve from 'koa-static';
import { join } from 'path'

const PORT_NUMBER = 31337

console.log('hello world');
const app = new Koa();

// timer-and-error middleware
app.use(async (ctx, next) => {
  const time = Date.now()
  
  try {
    await next()
  } catch (e) {
    ctx.body = (ctx.body || '') + '<span class="server">there was an error<br />' + (e.message || e.toString()) + '</span>'
    ctx.status = 400
  }
  
  console.log(`Request to ${ctx.request.path} took ${Date.now() - time}ms`)
})

app.listen(PORT_NUMBER)
console.log(`all set up, listening on port ${PORT_NUMBER}`)
