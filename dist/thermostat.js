"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thermostat = void 0;
const firebase_1 = require("./firebase");
const sensors_1 = require("./sensors");
const relay_1 = require("./relay");
class Thermostat {
    constructor() {
        /**
         * Is cooling turned on?
         * @private
         */
        this.cooling = false;
        /**
         * @see isRunning
         * @private
         */
        this.running = false;
        /**
         * Is this `Thermostat` running?
         */
        this.isRunning = () => this.running;
        /**
         * Returns the sensor data, updated last time thermostat updated
         */
        this.getSensorData = () => this.sensorData;
        /**
         * Returns the settings used for thermostat's last update
         */
        this.getSettings = () => this.settings;
        /**
         * Starts the thermostat logic and makes sure it keeps on running
         * @param force
         */
        this.start = (force) => __awaiter(this, void 0, void 0, function* () {
            console.log('### Thermostat.start()');
            if (this.running && !force)
                throw new Error('Thermostat is already running');
            try {
                yield this.tick();
                console.log('+ Started successfully');
            }
            catch (e) {
                console.error('- Failed to start :(');
                console.error(e);
                throw e;
            }
        });
        /**
         * Stops the thermostat from running and makes sure cooling is turned off
         */
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            clearTimeout(this.timeout);
            this.running = false;
            if (this.cooling)
                yield (0, relay_1.setRelay)(0);
            return true;
        });
        /**
         * Updates settings and sensor data. Turns on/off cooling based on this.
         */
        this.tick = () => __awaiter(this, void 0, void 0, function* () {
            console.log('### Thermostat.tick()');
            if (this.timeout)
                clearTimeout(this.timeout);
            yield Promise.all([this.updateSensorData(), this.updateSettings()]);
            // Sanity checks
            if (!this.sensorData)
                throw new Error('Missing sensor data');
            if (!this.settings)
                throw new Error('Missing settings');
            // Magic
            const needCooling = this.cooling ?
                // if compressor is running, run until temperature is AT target temperature
                this.sensorData.temperature > this.settings.targetTemp :
                // else, let the temperature run up to targetTemp + maxDelta
                this.sensorData.temperature > this.settings.targetTemp + this.settings.maxDelta;
            // Update Firestore and clean up
            const entry = this.sensorData;
            entry.cooling = needCooling;
            if (!this.running)
                entry.initial = true;
            yield (0, firebase_1.sendEntry)(entry);
            this.running = true;
            yield (0, relay_1.setRelay)(needCooling);
            this.cooling = needCooling;
            // tick tock
            this.timeout = setTimeout(this.tick, needCooling ? this.settings.runFor : this.settings.pollingRate);
        });
        this.updateSensorData = () => __awaiter(this, void 0, void 0, function* () {
            this.sensorData = yield (0, sensors_1.getSensors)();
            console.log('. Thermostat.updateSensorData()', this.sensorData);
        });
        this.updateSettings = () => __awaiter(this, void 0, void 0, function* () {
            this.settings = yield (0, firebase_1.getSettings)();
            console.log('. Thermostat.updateSettings()', this.settings);
        });
    }
}
exports.thermostat = new Thermostat();
