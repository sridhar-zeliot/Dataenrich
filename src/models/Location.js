'use strict';

/**
 * Equivalent of Location.java POJO.
 * Nested inside Car — represents lat/lng coordinates.
 */
class Location {
  constructor(latitude, longitude) {
    this.latitude  = latitude;
    this.longitude = longitude;
  }
}

module.exports = Location;
