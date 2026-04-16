'use strict';

const config = require('../config/config');

const TOPIC   = config.topics.json;
const SUBJECT = config.subjects.json;

/**
 * Equivalent of JSONProducerService.java.
 *
 * NOTE: This producer is intentionally NOT wired into ProducerScheduleService —
 * it is commented out in the Java scheduler too:
 *   //executorService.submit(()->jsonProducerService.produceCarJson(car));
 *
 * Kept here for completeness. Can be enabled in ProducerScheduleService if needed.
 */
class JSONProducerService {
  /**
   * @param {import('@kafkajs/confluent-schema-registry').SchemaRegistry} registry
   * @param {import('kafkajs').Producer} producer
   */
  constructor(registry, producer) {
    this.registry  = registry;
    this.producer  = producer;
    this._schemaId = null;
  }

 async _getSchemaId() {
  if (!this._schemaId) {
    try {
      this._schemaId = await this.registry.getLatestSchemaId(SUBJECT);

      console.log(
        `[JSONProducer] Cached schema id=${this._schemaId} for subject "${SUBJECT}"`
      );
    } catch (err) {
      console.error('[JSONProducer] Failed to fetch schema ID:', err.message);
      throw err;
    }
  }
  return this._schemaId;
}

  /**
   * @param {import('../models/Car')} car
   */
    async produceCarJson(car) {
      try {
        const schemaId = await this._getSchemaId();

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

        const encodedValue = await this.registry.encode(schemaId, payload);

        const result = await this.producer.send({
          topic: TOPIC,
          messages: [
            {
            key: String(payload.carId), // ✅ FIX: always string
              value: encodedValue,
            },
          ],
        });

        const [{ partition, baseOffset }] = result;

        console.log(
          `[JSONProducer] Produced → topic=${TOPIC} partition=${partition} offset=${baseOffset}`
        );

      } catch (err) {
        console.error('[JSONProducer] Error producing JSON message:', err.message);
      }
    }
}

module.exports = JSONProducerService;
