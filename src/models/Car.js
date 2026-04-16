'use strict';

/**
 * Equivalent of Car.java POJO (nested-message-format version).
 *
 * Fields:
 *   carId    — String
 *   carName  — String  (was carNumber in the flat version)
 *   speed    — double
 *   location — Location  ← nested object (new in this version)
 */
class Car {
  constructor(carId, carName, speed, fuelLevel, headlight, engineTemp, location) {
    this.carId = carId;
    this.carName = carName;
    this.speed = speed;
    this.fuelLevel = fuelLevel;       // integer
    this.headlight = headlight;       // boolean
    this.engineTemp = engineTemp;     // float/double
    this.location = location;         // Location object
  }
}

module.exports = Car;
