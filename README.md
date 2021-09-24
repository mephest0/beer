# Fridge controller

Add `firebase-creds.json` for your Firebase Project to the root dir, and you're all set. Firestore needs to have already been enabled for your Project.

## Node scripts

* `start` Runs the project
* `ip` Prints the devices IP address. Uses netplan (Ubuntu Server 21).

## Firestore

### Settings

The target temperature and polling rate is set in a Firestore document at `control/panel`, which is fetched every time the thermostat ticks.

### Logging

Every time the temperature and humidity is read, the results are stored in the `entries` collection in Firestore.

### Electronics

`todo`

## License

Do whatever you wish. MIT License or whatever 🤷‍♀️
