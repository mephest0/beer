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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.sendEntry = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const creds = require('../firebase-creds.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(creds)
});
const getFirestore = () => firebase_admin_1.default.firestore();
const sendEntry = (entry) => getFirestore()
    .collection('entries')
    .add(Object.assign({ time: Date.now() }, entry));
exports.sendEntry = sendEntry;
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const settingsSnap = yield getFirestore().doc('control/panel').get();
    if (!settingsSnap.exists)
        throw new Error('Settings document does not exist');
    return settingsSnap.data();
});
exports.getSettings = getSettings;
