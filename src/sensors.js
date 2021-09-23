// import sensor from 'node-dht-sensor'

export const getSensors = async () =>
  new Promise((resolve, reject) => {
    resolve({ humidity: 13, temperature: 37 })
    // sensor.read(11, 17, (err: any, temperature: number, humidity: number) => {
    //   if (err) reject(err)
    //
    //   resolve({ humidity, temperature })
    // })
  })
