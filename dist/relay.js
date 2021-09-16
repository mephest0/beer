"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRelay = void 0;
const onoff_1 = require("onoff");
const COOLER_RELAY_GPIO = 4;
const RELAY_CONTROL = new onoff_1.Gpio(COOLER_RELAY_GPIO, 'out');
const toggleRelay = () => {
    const state = RELAY_CONTROL.readSync();
    RELAY_CONTROL.writeSync(state ? 0 : 1);
};
exports.toggleRelay = toggleRelay;
