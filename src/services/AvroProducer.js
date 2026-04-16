'use strict';

const config = require('../config/config');

const TOPIC           = config.topics.avro;
const SUBJECT         = config.subjects.avro;
const LOCATION_SUBJECT = config.subjects.avroLocation;

/**
 * Equivalent of AvroProducer.java (nested-message-format version).
 *
 * Key difference from the flat version:
 *   Car now contains a nested Location object.
 *   In Java this required manually building a SchemaReference to
 *   'test-location-avro' and passing it to parseSchema().
 *
 *   In Node.js, @kafkajs/confluent-schema-registry resolves schema
 *   references automatically when encoding — it fetches the referenced
 *   Location schema from the registry and merges it into the Car schema,
 *   equivalent to Java's AvroSchema + rawSchema() approach.
 *
 * The payload passed to registry.encode() uses the nested structure:
 *   { carId, carName, speed, location: { latitude, longitude } }
 *
 * Subjects:
 *   Car schema subject:      test-car-nested-avro-value
 *   Location schema subject: test-location-avro   ← SchemaReference in Java
 */
class AvroProducer {
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
        `[AvroProducer] Cached schema id=${this._schemaId} for subject "${SUBJECT}"`
      );
    } catch (err) {
      console.error(`[AvroProducer] Failed to fetch schema ID:`, err.message);
      throw err;
    }
  }
  return this._schemaId;
}

  /**
   * Equivalent of produceCarAvro(Car car) in Java.
   *
   * @param {import('../models/Car')} car
   */
 async produceCarAvro(car) {
    try {
      const schemaId = await this._getSchemaId();

      // 🔥 IMPORTANT FIX → Convert class instance to plain object
      const payload = JSON.parse(JSON.stringify(car));

      // ✅ Optional validation (recommended)
      if (!payload.carId) throw new Error("carId is missing");
      if (!payload.carName) throw new Error("carName is missing");
      if (payload.location?.latitude == null) throw new Error("latitude missing");
      if (payload.location?.longitude == null) throw new Error("longitude missing");

      console.log("[AvroProducer] Payload:", payload);

      // ✅ Encode with schema
      const encodedValue = await this.registry.encode(schemaId, payload);

      // ✅ Send to Kafka
      const result = await this.producer.send({
        topic: TOPIC,
        messages: [
          {
            key: String(payload.carId), // ensure string
            value: encodedValue,
          },
        ],
      });

      const [{ partition, baseOffset }] = result;

      console.log(
        `[AvroProducer] Produced → topic=${TOPIC} partition=${partition} offset=${baseOffset}`
      );

    } catch (err) {
      console.error('[AvroProducer] Error producing Avro message:', err.message);
    }
  }
}

module.exports = AvroProducer;
