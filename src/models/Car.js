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
  constructor(carId, carName, speed, location) {
    this.carId    = carId;
    this.carName  = carName;
    this.speed    = speed;
    this.location = location;   // instance of Location
  }
}

module.exports = Car;
