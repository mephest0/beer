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

## On the roadmap

* Support for multiple temperature sensors
* Logging of error rate, etc, available in web interface
* Better sensory readings
* Vev code to more easily show temps and statuses online
* Door sensor
* Environment variables for GPIO ports, Firebase creds
* (Optional) ditching of Firestore for settings, could be set via environment variables or local defaults-file
