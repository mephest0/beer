import sensor from 'node-dht-sensor'

const ATTEMPTS = 10

export const getSensors = async () => {
  const results = []
  
  // Get ATTEMPTS number of results, in case of errors/faulty readings
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const res = await getSensorOnce()
      
      results.push(res)
    } catch (e) {
      results.push({ humidity: undefined, temperature: undefined })
    }
  }
  
  // Remove errors
  const temperatures = []
  const humidities = []
  
  results.forEach(result => {
    if (result.temperature !== undefined) temperatures.push(result.temperature)
    if (result.humidity !== undefined) humidities.push(result.humidity)
  })
  
  try {
    // Remove outliers
    const midTemps = temperatures.sort().slice(1, temperatures.length - 2)
    const midHums = humidities.sort().slice(1, humidities.length - 2)
    
    // Average
    const averageTemp = midTemps.reduce((prev, total) => prev + total) / midTemps.length
    const averageHum = midHums.reduce((prev, total) => prev + total) / midHums.length
    
    // ez
    return {
      humidity: averageHum,
      temperature: averageTemp,
    }
  } catch (e) {
    console.error('There was an error processing sensor output.', e)
    
    return undefined
  }
}

const getSensorOnce = async () =>
  new Promise((resolve, reject) => {
    sensor.read(11, 17, (err, temperature, humidity) => {
      if (err) reject(err)

      resolve({ humidity, temperature })
    })
  })
