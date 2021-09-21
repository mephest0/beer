import admin from 'firebase-admin'
import { Settings } from './thermostat'

const creds = require('../firebase-creds.json');

admin.initializeApp({
  credential: admin.credential.cert(creds)
});

export interface Entry {
  humidity: number;
  /**
   * If `true` this was logged for `Thermostat`'s initial check
   */
  initial?: boolean;
  /**
   * Is the compressor running?
   */
  cooling: boolean;
  temperature: number;
  time: number;
}

const getFirestore = () => admin.firestore();

export const sendEntry = (entry: Omit<Entry, 'time'>) : Promise<any> =>
  getFirestore()
    .collection('entries')
    .add({
      time: Date.now(),
      ...entry,
    } as Entry);

export const getSettings = async (): Promise<Settings> => {
  const settingsSnap = await getFirestore().doc('control/panel').get();
  
  if (!settingsSnap.exists) throw new Error('Settings document does not exist');
  
  return settingsSnap.data() as Settings;
}
