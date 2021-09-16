"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRelay = void 0;
const rpio_1 = __importDefault(require("rpio"));
const COOLER_RELAY_GPIO = 4;
const toggleRelay = () => {
    setRelay(!readRelay());
};
exports.toggleRelay = toggleRelay;
const readRelay = () => rpio_1.default.read(COOLER_RELAY_GPIO);
const setRelay = (state) => {
    rpio_1.default.write(COOLER_RELAY_GPIO, state ? 1 : 0);
};
