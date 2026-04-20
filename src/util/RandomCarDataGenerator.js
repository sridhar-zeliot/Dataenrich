'use strict';

const Car      = require('../models/Car');
const Location = require('../models/Location');
const config = require('../config/config');

// ✅ ENV config (keep outside class)
const CAR_ID_MIN = config.carRange.min;
const CAR_ID_MAX = config.carRange.max;

// ✅ Validation
if (CAR_ID_MIN > CAR_ID_MAX) {
  throw new Error('CAR_ID_MIN cannot be greater than CAR_ID_MAX');
}

class RandomCarDataGenerator {

  generateRandomCar() {
    const randomCarId = this._randomCarId();

    // ✅ deterministic carNumber (NO Map, NO randomness)
    const carNumber = this._generateCarNumber(randomCarId);

    return new Car(
      randomCarId,
      carNumber,
      this._randomSpeed(),
      this._randomFuelLevel(),
      this._randomHeadlight(),
      this._randomEngineTemp(),
      new Location(this._randomLatitude(), this._randomLongitude())
    );
  }

  // ✅ FIXED car number (same for same carId ALWAYS)
  _generateCarNumber(carId) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numId = parseInt(carId, 10);

    const state = 'KA';

    // deterministic RTO
    const rto = (10 + (numId % 90)).toString().padStart(2, '0');

    // deterministic letters
    const first = letters[numId % 26];
    const second = letters[(numId * 3) % 26];

    // deterministic number
    const number = (1000 + (numId * 137) % 9000);

    return `${state}${rto}${first}${second}${number}`;
  }

  // ✅ Random carId (same as before)
  _randomCarId() {
    const num = Math.floor(Math.random() * (CAR_ID_MAX - CAR_ID_MIN + 1)) + CAR_ID_MIN;
    return num.toString().padStart(2, '0');
  }

  _randomSpeed() {
    return Math.random() * 180;
  }

  _randomFuelLevel() {
    return Math.floor(Math.random() * 100);
  }

  _randomHeadlight() {
    return Math.random() > 0.5;
  }

  _randomEngineTemp() {
    return 70 + Math.random() * 50;
  }

  _randomLatitude() {
    return -90 + Math.random() * 180;
  }

  _randomLongitude() {
    return -180 + Math.random() * 360;
  }
}

module.exports = RandomCarDataGenerator;