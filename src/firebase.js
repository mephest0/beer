import firebase from 'firebase-admin'
import creds from '../firebase-creds.json'

firebase.initializeApp({
  credential: firebase.credential.cert(creds)
})
const firestore = firebase.firestore()

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
  
  if (!settingsSnap.exists) throw new Error('Settings document does not exist')
  
  return settingsSnap.data()
}

(async () => {
  console.log('performing test read/write')
  const settings = await getSettings()
  console.log('### settings')
  console.log(settings)
  
  await sendEntry({ humidity: 1337, temperature: 69, cooling: false })
})()
