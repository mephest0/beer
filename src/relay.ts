import rpio from 'rpio'
const COOLER_RELAY_GPIO = 4

export const toggleRelay = () => {
  setRelay(!readRelay())
}

const readRelay = () => rpio.read(COOLER_RELAY_GPIO)

const setRelay = (state: 0 | 1 | boolean) => {
  rpio.write(COOLER_RELAY_GPIO, state ? 1 : 0)
}
