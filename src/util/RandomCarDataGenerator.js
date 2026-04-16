'use strict';

const Car      = require('../models/Car');
const Location = require('../models/Location');

/**
 * Equivalent of RandomCarDataGenerator.java.
 * Generates a Car with a nested Location object (new in this version).
 */
class RandomCarDataGenerator {
  constructor(carNumber) {
    this.carNumber = carNumber || 'KA07JB007';
  }

  generateRandomCar() {
    const randomCarId = this._randomCarId();
    return new Car(
      randomCarId,
      this.carNumber,                              // maps to car.setCarName(carNumberString) in Java
      this._randomSpeed(),
      new Location(this._randomLatitude(), this._randomLongitude())  // nested Location
    );
  }

   _randomCarId() {
    const num = Math.floor(Math.random() * 15) + 1;
    return num.toString().padStart(2, '0');
  }
  _randomSpeed()     { return Math.random() * 180; }          // 0 – 180 km/h
  _randomLatitude()  { return -90  + Math.random() * 180; }   // -90  to  90
  _randomLongitude() { return -180 + Math.random() * 360; }   // -180 to 180
}

module.exports = RandomCarDataGenerator;
