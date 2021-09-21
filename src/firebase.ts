import admin from 'firebase-admin';

const creds = require('../firebase-creds.json');

admin.initializeApp({
  credential: admin.credential.cert(creds)
});

export interface Settings {
  /**
   * Interval in ms between every time the sensors are read and results sent to Firestore
   */
  pollingRate: number;
  /**
   * Temperature control for the thermostat
   */
  targetTemp: number;
}

export interface Entry {
  humidity: number;
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
