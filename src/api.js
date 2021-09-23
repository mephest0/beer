import { thermostat } from './thermostat.js'

export const handleApi = async (request) => {
  let ret;
  
  try {
    switch (request) {
      case 'get_running':
        ret = { running: thermostat.isRunning() }
        break
      case 'get_sensors':
        ret = thermostat.getSensorData()
        break
      case 'get_settings':
        ret = thermostat.getSettings()
        break
      case 'start':
        await thermostat.start()
        ret = { ok: true }
        break
      case 'start_force':
        await thermostat.start(true)
        ret = { ok: true }
        break
      case 'stop':
        await thermostat.stop()
        ret = { ok: true }
        break
      default:
        throw new Error(`API call for unsupported request [${request}]`)
    }
  } catch (e) {
    console.error('! Error in API handler.', e)
    
    ret = { handled: false, error: e }
  }
  
  return ret
}
