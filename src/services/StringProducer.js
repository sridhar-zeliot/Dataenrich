'use strict';

const config = require('../config/config');

const TOPIC = config.topics.string;

/**
 * Equivalent of StringProducer.java.
 *
 * Serialises the Car (including nested Location) to a plain JSON string
 * and sends it to Kafka with STRING key + STRING value — no schema registry involved.
 *
 * Java flow:
 *   objectMapper.writeValueAsString(car)  →  JSON.stringify(car)
 *   ProducerRecord<String, String>        →  { key: car.carId, value: carJson }
 */
class StringProducer {
  /**
   * @param {import('kafkajs').Producer} producer
   */
  constructor(producer) {
    this.producer = producer;
  }

  /**
   * @param {import('../models/Car')} car
   */
  async produceCarString(car) {
    try {
      // ✅ build clean payload
      const payload = {
        carId: String(car.carId),
        carName: car.carName,
        speed: Number(car.speed),

        fuelLevel: Number(car.fuelLevel),
        headlight: Boolean(car.headlight),
        engineTemp: Number(car.engineTemp),

        location: {
          latitude: Number(car.location?.latitude),
          longitude: Number(car.location?.longitude),
        },
      };

      const carJson = JSON.stringify(payload);

      console.log(`[StringProducer] Producing → ${carJson}`);

      const result = await this.producer.send({
        topic: TOPIC,
        messages: [
          {
            key: String(payload.carId),
            value: carJson,
          },
        ],
      });

      const [{ partition, baseOffset }] = result;

      console.log(
        `[StringProducer] Produced → topic=${TOPIC} partition=${partition} offset=${baseOffset}`
      );

    } catch (err) {
      console.error('[StringProducer] Error producing String message:', err.message);
    }
  }
}

module.exports = StringProducer;
