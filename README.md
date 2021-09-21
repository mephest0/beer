# Fridge controller

Add `firebase-creds.json` for your Firebase Project to the root dir, and you're all set. Firestore needs to have been enabled.

## Node scripts

* `build` Builds the project
* `start` Runs the project, without a build
* `ip` Prints the devices IP address. Uses netplan (Ubuntu Server 21).

## Dist folder

Because of some devices with too little working memory to run TSC, the `dist` folder is also tracked. Please build locally if possible.

## Firestore

### Settings

The target temperature and polling rate is set in a Firestore document at `control/panel`, which is fetched every time the thermostat ticks.

### Logging

Every time the temperature and humidity is read, the results are stored in the `entries` collection in Firestore.

## License

Do whatever you wish. MIT License or whatever 🤷‍♀️
