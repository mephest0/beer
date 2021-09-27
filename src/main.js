import Koa from 'koa'
import serve from 'koa-static'
import { handleApi } from './api.js'
import { join } from 'path'
import { thermostat } from './thermostat.js';

const PORT_NUMBER = 31337

const app = new Koa()
thermostat.start()

// timer-and-error middleware
app.use(async (ctx, next) => {
  const time = Date.now()
  console.log(`. got request to [${ ctx.request.path }] from ${ ctx.request.ip }`)

  try {
    await next()
  } catch (e) {
    ctx.body = (ctx.body || '') + '<span class="server">there was an error<br />' + (e.message || e.toString()) + '</span>'
    ctx.status = 400
    console.error(e)
  }

  if (ctx.response.type === 'application/json') ctx.body.requestTook = Date.now() - time
  console.log(`. request to [${ ctx.request.path }] took ${ Date.now() - time }ms`)
})

// api call handler, or pass on to static file middleware
app.use(async (ctx, next) => {
  // all other requests than those for /api/* are passed on
  if (!ctx.request.path.startsWith('/api/')) return await next()

  const path = ctx.request.path
    .replace(/^\/api\//, '')
    .replace(/\/$/, '')

  ctx.body = await handleApi(path)
  ctx.response.type = 'application/json'
})

// static file handler
app.use(serve(join('./static'), { defer: true }))

app.listen(PORT_NUMBER)
console.log(`all set up, listening on port ${ PORT_NUMBER }`)
