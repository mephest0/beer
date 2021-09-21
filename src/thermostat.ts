import { Entry, getSettings, sendEntry } from './firebase'
import { getSensors, SensorData } from './sensors'

export interface Settings {
  /**
   * Temperature above `targetTemp + maxDelta` will cause the compressor to start
   */
  maxDelta: number
  /**
   * Interval in ms between every time the sensors are read and results sent to Firestore
   */
  pollingRate: number
  /**
   * Time in ms to run the compressor for before checking again
   */
  runFor: number
  /**
   * Temperature control for the thermostat
   */
  targetTemp: number
}

class Thermostat {
  private cooling = false
  private running = false
  private sensorData: SensorData
  private settings: Settings
  private timeout: NodeJS.Timeout
  
  isRunning = () => this.running
  
  getSensorData = () => this.sensorData
  
  getSettings = () => this.settings
  
  start = async (force?: boolean)  => {
    if (this.running && !force) throw new Error('Thermostat is already running')

    try {
      console.log('### Thermostat.start()')
      
      await this.tick()

      console.log('+ Started successfully')
    } catch (e) {
      console.error('- Failed to start :(')
      console.error(e)
      
      throw e
    }
  }
  
  stop = async () => {
    clearTimeout(this.timeout)
    this.running = false
    // if (this.#cooling) await setRelay(0)
    
    return true
  }
  
  private tick = async () => {
    console.log('### Thermostat.tick()')

    if (this.timeout) clearTimeout(this.timeout)
    await Promise.all([this.updateSensorData(), this.updateSettings()])
    
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
    const entry: Partial<Omit<Entry, 'time'>> = this.sensorData
    entry.cooling = needCooling

    if (!this.running) entry.initial = true
    await sendEntry(entry as Entry)
    
    this.running = true
    
    // await setRelay(needCooling)
    console.log('needCooling', needCooling)
    this.cooling = needCooling

    // tick tock
    this.timeout = setTimeout(
      this.tick,
      needCooling ? this.settings.runFor : this.settings.pollingRate)
  }
  
  private updateSensorData = async () => {
    this.sensorData = await getSensors()
    console.log('Thermostat.updateSensorData()', this.sensorData);
  }
  
  private updateSettings = async () => {
    this.settings = await getSettings()
    console.log('Thermostat.updateSettings()', this.settings)
  }
}

export const thermostat = new Thermostat()

