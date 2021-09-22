import sensor from 'node-dht-sensor'

export interface SensorData {
  humidity: number;
  temperature: number;
}

export const getSensors = async (): Promise<SensorData> =>
  new Promise<SensorData>((resolve, reject) => {
    sensor.read(11, 17, (err: any, temperature: number, humidity: number) => {
      if (err) reject(err)
      
      resolve({ humidity, temperature })
    })
  })
