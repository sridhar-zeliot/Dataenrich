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

/**
 * Equivalent of RandomCarDataGenerator.java.
 */
class RandomCarDataGenerator {
  constructor() {
    this.carMap = new Map(); // ✅ store carId → carNumber
  }

  generateRandomCar() {
    const randomCarId = this._randomCarId();

    // ✅ check if already exists
    if (!this.carMap.has(randomCarId)) {
      this.carMap.set(randomCarId, this._generateCarNumber());
    }

    const carNumber = this.carMap.get(randomCarId);

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

  // ✅ Random Car Number Generator
  _generateCarNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const state = 'KA';
    const rto = Math.floor(10 + Math.random() * 90); // 10–99

    const series =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)];

    const number = Math.floor(1000 + Math.random() * 9000); // 1000–9999

    return `${state}${rto}${series}${number}`;
  }

  // ✅ Random carId with env range + padding
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