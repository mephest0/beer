import admin from 'firebase-admin'
import creds from '../firebase-creds.json'

admin.initializeApp({
  credential: admin.credential.cert(creds)
})

const firestore = admin.firestore()

const getFirestore = () => firestore

export const sendEntry = (entry) =>
  getFirestore()
    .collection('entries')
    .add({
      time: Date.now(),
      ...entry
    })

export const getSettings = async () => {
  const settingsSnap = await getFirestore().doc('control/panel').get()
  
  if (!settingsSnap.exists)
    throw new Error('Settings document does not exist')
  
  const data = settingsSnap.data()
  
  if (!data.targetTemp)
    throw new Error('Missing targetTemp field in settings')
  if (!data.maxDelta)
    throw new Error('Missing maxDelta field in settings')
  if (!data.runFor)
    throw new Error('Missing runFor field in settings')
  if (!data.pollingRate)
    throw new Error('Missing pollingRate field in settings')
  
  return data
}

(async () => {
  console.log('performing test read/write')
  const settings = await getSettings()
  console.log('### settings')
  console.log(settings)
  
  await sendEntry({ humidity: 1337, temperature: 69, cooling: false })
})()
