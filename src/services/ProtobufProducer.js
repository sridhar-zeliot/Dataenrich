'use strict';

const config = require('../config/config');

const TOPIC            = config.topics.protobuf;
const SUBJECT          = config.subjects.protobuf;
const LOCATION_SUBJECT = config.subjects.protobufLocation;  // 'location.proto'

/**
 * Equivalent of ProtobufProducer.java (nested-message-format version).
 *
 * Key difference from the flat version:
 *   Java used DynamicMessage + JsonFormat.parser().merge(carJson, builder)
 *   to dynamically encode Protobuf from a JSON string with a nested Location.
 *   It also required a SchemaReference to 'location.proto'.
 *
 *   In Node.js, @kafkajs/confluent-schema-registry handles:
 *     - Fetching the Car Protobuf schema (subject: test-car-nested-protobuf-value)
 *     - Resolving the 'location.proto' reference from the registry
 *     - Encoding the plain JS object with nested location into Protobuf binary
 *       via protobufjs (equivalent of DynamicMessage + JsonFormat.parser())
 *     - Adding Confluent magic-byte framing
 *
 * Subjects:
 *   Car schema subject:      test-car-nested-protobuf-value
 *   Location schema subject: location.proto   ← SchemaReference in Java
 */
class ProtobufProducer {
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
        `[ProtobufProducer] Cached schema id=${this._schemaId} for subject "${SUBJECT}"`
      );
    } catch (err) {
      console.error('[ProtobufProducer] Failed to fetch schema ID:', err.message);
      throw err;
    }
  }
  return this._schemaId;
}

  /**
   * Equivalent of produceCarProto(Car car) in Java.
   *
   * Java used:
   *   DynamicMessage.newBuilder(descriptor) + JsonFormat.parser().merge(carJson, builder)
   *
   * Node.js equivalent:
   *   registry.encode(schemaId, plainJsObject)
   *   — protobufjs resolves the location.proto reference and encodes the nested struct.
   *
   * @param {import('../models/Car')} car
   */
  async produceCarProto(car) {
    try {
      const schemaId = await this._getSchemaId();

      // Nested payload — field names must match the proto message field names exactly
      // Equivalent of objectMapper.writeValueAsString(car) in Java (used by JsonFormat.parser)
      const encodedValue = await this.registry.encode(schemaId, {
        carId:    car.carId,
        carName:  car.carName,
        speed:    car.speed,
        location: {
          latitude:  car.location.latitude,
          longitude: car.location.longitude,
        },
      });
          console.log("[AvroProducer] Payload:", encodedValue);

      const result = await this.producer.send({
        topic:    TOPIC,
        messages: [{ key: car.carId, value: encodedValue }],
      });

      const [{ partition, baseOffset }] = result;
      console.log(`[ProtobufProducer] Produced → topic=${TOPIC} partition=${partition} offset=${baseOffset}`);
    } catch (err) {
      console.error('[ProtobufProducer] Error producing Protobuf message:', err.message);
    }
  }
}

module.exports = ProtobufProducer;
