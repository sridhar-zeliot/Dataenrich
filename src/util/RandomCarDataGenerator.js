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
    const carId = this._randomCarId();

    // ✅ FIXED: deterministic carNumber based on carId
    const carNumber = this._generateCarNumber(carId);

    return new Car(
      carId,
      carNumber,
      this._randomSpeed(),
      this._randomFuelLevel(),
      this._randomHeadlight(),
      this._randomEngineTemp(),
      new Location(this._randomLatitude(), this._randomLongitude())
    );
  }

  // ✅ FIXED carNumber logic (same input → same output always)
  _generateCarNumber(carId) {
    const num = Number(carId);

    const prefix = 'KA07JB';

    // always padded to 3 digits
    const suffix = String(num).padStart(3, '0');

    return `${prefix}${suffix}`;
  }

  // ✅ random carId based on range
  _randomCarId() {
    const num =
      Math.floor(Math.random() * (CAR_ID_MAX - CAR_ID_MIN + 1)) + CAR_ID_MIN;

    return String(num).padStart(2, '0');
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