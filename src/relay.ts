import { Gpio } from 'onoff'

const COOLER_RELAY_GPIO = 4
const RELAY_CONTROL = new Gpio(COOLER_RELAY_GPIO, 'out')

export const toggleRelay = () => {
  const state = RELAY_CONTROL.readSync()

  RELAY_CONTROL.writeSync(state ? 0 : 1)
}
