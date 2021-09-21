"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRelay = void 0;
const rpio_1 = __importDefault(require("rpio"));
const COOLER_RELAY_GPIO = 7;
rpio_1.default.open(COOLER_RELAY_GPIO, rpio_1.default.OUTPUT, rpio_1.default.LOW);
const setRelay = (state) => {
    const nuValue = state ? 1 : 0;
    console.log('. setRelay', nuValue, 'is now', readRelay());
    rpio_1.default.write(COOLER_RELAY_GPIO, nuValue);
};
exports.setRelay = setRelay;
const readRelay = () => rpio_1.default.read(COOLER_RELAY_GPIO);
