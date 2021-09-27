import rpio from 'rpio'

const COOLER_RELAY_GPIO = 7

rpio.open(COOLER_RELAY_GPIO, rpio.OUTPUT, rpio.LOW)

export const setRelay = (state) => {
  const nuValue = state ? 1 : 0
  const current = readRelay()
  
  if (nuValue !== current) {
    console.log('. setRelay', nuValue, 'was', readRelay())
    rpio.write(COOLER_RELAY_GPIO, nuValue)
  }
}

const readRelay = () => rpio.read(COOLER_RELAY_GPIO)
