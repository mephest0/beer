import { getSettings, sendEntry } from './firebase.js'
import { getSensors } from './sensors.js'
import { setRelay } from './relay.js'

class Thermostat {
  /**
   * Is cooling turned on?
   * @private
   */
  cooling = false
  /**
   * @see isRunning
   * @private
   */
  running = false
  sensorData
  settings = undefined
  /**
   * Holds the Timeout used for timing thermostat updates
   * @private
   */
  timeout = undefined
  
  /**
   * Is this `Thermostat` running?
   */
  isRunning = () => this.running
  
  /**
   * Returns the sensor data, updated last time thermostat updated
   */
  getSensorData = () => this.sensorData
  
  /**
   * Returns the settings used for thermostat's last update
   */
  getSettings = () => this.settings
  
  /**
   * Starts the thermostat logic and makes sure it keeps on running
   * @param force
   */
  start = async (force) => {
    console.log('### Thermostat.start()')
    if (this.running && !force) throw new Error('Thermostat is already running')
    
    try {
      await this._tick()
      
      console.log('+ Started successfully')
    } catch (e) {
      console.error('- Failed to start :(')
      console.error(e)
      
      throw e
    }
  }
  
  /**
   * Stops the thermostat from running and makes sure cooling is turned off
   */
  stop = async () => {
    clearTimeout(this.timeout)
    this.running = false
    if (this.cooling) await setRelay(0)
    
    return true
  }
  
  /**
   * Updates settings and sensor data. Turns on/off cooling based on this.
   */
  _tick = async () => {
    console.log('### Thermostat.tick()')
    
    if (this.timeout) clearTimeout(this.timeout)
    await Promise.all([this._updateSensorData(), this._updateSettings()])
    
    // Sanity checks
    if (!this.sensorData) throw new Error('Missing sensor data')
    if (!this.settings) throw new Error('Missing settings')
    
    // Magic
    const needCooling = this.cooling ?
      // if compressor is running, run until temperature is AT target temperature
      this.sensorData.temperature > this.settings.targetTemp :
      // else, let the temperature run up to targetTemp + maxDelta
      this.sensorData.temperature > this.settings.targetTemp + this.settings.maxDelta
    
    // Update Firestore and clean up
    const entry = this.sensorData
    entry.cooling = needCooling
    
    if (!this.running) entry.initial = true
    await sendEntry(entry)
    
    this.running = true
    
    await setRelay(needCooling)
    this.cooling = needCooling
    
    // tick tock
    this.timeout = setTimeout(
      this._tick,
      needCooling ? this.settings.runFor : this.settings.pollingRate)
  }
  
  _updateSensorData = async () => {
    // Update, or, if that fails keep old temps
    this.sensorData = (await getSensors()) || this.sensorData
    console.log('. Thermostat.updateSensorData()', this.sensorData)
  }
  
  _updateSettings = async () => {
    this.settings = await getSettings()
  }
}

export const thermostat = new Thermostat()

