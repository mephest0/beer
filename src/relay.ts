import rpio from 'rpio'
const COOLER_RELAY_GPIO = 7

export const toggleRelay = () => {
  const nowState = readRelay()
  console.log('nowState', nowState)

  setRelay(!readRelay())
}

const readRelay = () => rpio.read(COOLER_RELAY_GPIO)

const setRelay = (state: 0 | 1 | boolean) => {
  const nuValue = state ? 1 : 0
  
  console.log('nuValue', nuValue)
  rpio.write(COOLER_RELAY_GPIO, nuValue)
}
