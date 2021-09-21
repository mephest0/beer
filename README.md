# Fridge controller

Add `firebase-creds.json` for your Firebase Project to the root dir, and you're all set. Firestore needs to have been enabled.

## Firestore

### Settings

The target temperature and polling rate is set in a Firestore document at `control/panel`, which is fetched every time the thermostat ticks.

### Logging

Every time the temperature and humidity is read, the results are stored in the `entries` collection in Firestore.

## License

Do whatever you wish. MIT License or whatever 🤷‍♀️
