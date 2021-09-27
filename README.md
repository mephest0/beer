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

## Big ups

This project was built with a lot of inspiration* from the Intertubes. Here is a short list of our sources of inspiration:

* [Hackaday](https://hackaday.com)
  * For general encouragement of the hacking spirit
* [BrewPi](https://www.brewpi.com)
  * For setting a great example of what the limits are and how TF refrigerators work
* GitHub's [jperkin](https://github.com/jperkin)
  * And their library [RPIO](https://www.npmjs.com/package/rpio), without which cooling wouldn't at all be possible (so cool)
* GitHub's [momenso](https://github.com/momenso)
  * Whose node-dht-sensor library and documentation has saved us a lot of time on both electronics and coding!
* [The Raspberry Pi Foundation](https://www.raspberrypi.org/)
  * ...where to even start?!

## Notes

The unit we used, an the 512 mb RPI 3A+, didn't have enough mbs. Creating a swap partition on the memory card (not recommended!) solved this. Here's how to set that up (using Ubuntu Server 21):
* `sudo fallocate -l 1G /swapspace`
  * To set up 1 gig of swap
* `sudo chmod 600 /swapspace`
  * So read/write permissions are as they should
* `sudo mkswap /swapspace`
  * ..or else the swap area would not be used for just that
* `sudo swapon /swapspace`
  * ..or else the swap area would not be used
* Add the line `/swapspace swap swap defaults 0 0` to the file `/etc/swap`
  * So that it is used again after reboot

To verify that a swap area has been created and is in use, run the command `sudo swapon --show`. If you can not see it, try rebooting.

## License

Do what you wish. MIT License or whatever 🤷‍♀️

## On the roadmap

* Support for multiple temperature sensors
* Logging of error rate, etc, available in web interface
* Better sensory readings
* Vev code to more easily show temps and statuses online
* Door sensor
* Environment variables for GPIO ports, Firebase creds
* (Optional) ditching of Firestore for settings, could be set via environment variables or local defaults-file
* Turn off compressor when shutting down
