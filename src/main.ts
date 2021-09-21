import Koa from 'koa'
import serve from 'koa-static'
import { join } from 'path'
import { thermostat } from './thermostat'

const PORT_NUMBER = 31337

const app = new Koa()
thermostat.start()

// timer-and-error middleware
app.use(async (ctx, next) => {
  const time = Date.now()
  
  try {
    await next()
  } catch (e) {
    ctx.body = (ctx.body || '') + '<span class="server">there was an error<br />' + (e.message || e.toString()) + '</span>'
    ctx.status = 400
    console.error(e)
  }
  
  console.log(`Request to ${ctx.request.path} took ${Date.now() - time}ms`)
})

// api call handler, or pass on to static file middleware
app.use(async (ctx, next) => {
  // all other requests than those for /api/* are passed on
  if (!ctx.request.path.startsWith('/api/')) return await next()
  
  const path = ctx.request.path
    .replace(/^\/api\//, '')
    .replace(/\/$/, '')
  
  console.log('api path [' + path + ']')
  switch (path) {
    case 'get_running':
      ctx.body = thermostat.isRunning()
      break
    case 'get_sensors':
      ctx.body = thermostat.getSensorData()
      break
    case 'get_settings':
      ctx.body = thermostat.getSettings()
      break
    case 'start':
      await thermostat.start()
      ctx.body = { ok: true }
      break
    case 'start_force':
      await thermostat.start(true)
      ctx.body = { ok: true }
      break
    case 'stop':
      await thermostat.stop()
      ctx.body = { ok: true }
      break
    default:
      throw new Error(`API call for unsupported request [${path}]`)
  }
  
  ctx.response.type = 'application/json'
})

// static file handler
app.use(serve(join('./static'), { defer: true }))

app.listen(PORT_NUMBER)
console.log(`all set up, listening on port ${PORT_NUMBER}`)
