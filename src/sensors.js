import sensor from 'node-dht-sensor'

export const getSensors = async () =>
  new Promise((resolve, reject) => {
    sensor.read(11, 17, (err, temperature, humidity) => {
      if (err) reject(err)

      resolve({ humidity, temperature })
    })
  })
