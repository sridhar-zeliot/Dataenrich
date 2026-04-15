'use strict';

const Car      = require('../models/Car');
const Location = require('../models/Location');

/**
 * Equivalent of RandomCarDataGenerator.java.
 * Generates a Car with a nested Location object (new in this version).
 */
class RandomCarDataGenerator {
  constructor(carId, carNumber) {
    this.carId     = carId     || 'default-car-id';
    this.carNumber = carNumber || 'default-car-number';
  }

  generateRandomCar() {
    return new Car(
      this.carId,
      this.carNumber,                              // maps to car.setCarName(carNumberString) in Java
      this._randomSpeed(),
      new Location(this._randomLatitude(), this._randomLongitude())  // nested Location
    );
  }

  _randomSpeed()     { return Math.random() * 180; }          // 0 – 180 km/h
  _randomLatitude()  { return -90  + Math.random() * 180; }   // -90  to  90
  _randomLongitude() { return -180 + Math.random() * 360; }   // -180 to 180
}

module.exports = RandomCarDataGenerator;
