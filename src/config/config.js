'use strict';

require('dotenv').config();

const config = {
  kafka: {
    bootstrapServer:   process.env.KAFKA_BOOTSTRAP_SERVER || 'my-cluster-kafka-bootstrap.kafka:9092',
    username:          process.env.KAFKA_USERNAME         || '',
    password:          process.env.KAFKA_PASSWORD         || '',
    clientId:          'car-nested-producer',             // matches Java CLIENT_ID
    retries:           0,
    connectionTimeout: 3000,
  },
  schemaRegistry: {
    url:      process.env.SCHEMA_REGISTRY_URL || 'http://karapace-schema-registry.schema-registry:8081',
    username: process.env.KAFKA_USERNAME      || 'ewaed6hp3rkggqk477ng4zas1',
    password: process.env.KAFKA_PASSWORD      || 'MrSV45FrMCa36Y7',
  },
  car: {
    id:     process.env.CAR_ID     || '007',
    number: process.env.CAR_NUMBER || 'KA07JB007',
  },
  scheduler: {
    intervalMs: parseInt(process.env.SCHEDULE_INTERVAL_MS || '10000', 10),
  },

  // Topic names — match Java constants exactly
  topics: {
    string:   'test-car-nested-string',
    avro:     'test-car-nested-avro',
    protobuf: 'test-car-nested-protobuf',
    json:     'test-schema-car-json',       // kept but not used in scheduler (commented out in Java too)
  },

  // Subject names used to look up schemas in the registry
  subjects: {
    avro:             'test-car-nested-avro-value',
    avroLocation:     'test-location-avro',      // SchemaReference in AvroProducer.java
    protobuf:         'test-car-nested-protobuf-value',
    protobufLocation: 'location.proto',          // SchemaReference in ProtobufProducer.java
    json:             'test-schema-car-json-value',
  },
};

module.exports = config;
