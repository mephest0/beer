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
exports.handleApi = void 0;
const thermostat_1 = require("./thermostat");
const handleApi = (request) => __awaiter(void 0, void 0, void 0, function* () {
    let ret;
    try {
        switch (request) {
            case 'get_running':
                ret = { running: thermostat_1.thermostat.isRunning() };
                break;
            case 'get_sensors':
                ret = thermostat_1.thermostat.getSensorData();
                break;
            case 'get_settings':
                ret = thermostat_1.thermostat.getSettings();
                break;
            case 'start':
                yield thermostat_1.thermostat.start();
                ret = { ok: true };
                break;
            case 'start_force':
                yield thermostat_1.thermostat.start(true);
                ret = { ok: true };
                break;
            case 'stop':
                yield thermostat_1.thermostat.stop();
                ret = { ok: true };
                break;
            default:
                throw new Error(`API call for unsupported request [${request}]`);
        }
    }
    catch (e) {
        console.error('! Error in API handler.', e);
        ret = { handled: false, error: e };
    }
    return ret;
});
exports.handleApi = handleApi;
