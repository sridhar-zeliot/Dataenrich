'use strict';

require('dotenv').config();

const config = {
  kafka: {
    bootstrapServer:   process.env.KAFKA_BOOTSTRAP_SERVER || 'my-cluster-kafka-bootstrap.kafka:9092',
    username:          process.env.KAFKA_USERNAME         || 'ewaed6hp3rkggqk477ng4zas1',
    password:          process.env.KAFKA_PASSWORD         || 'MrSV45FrMCa36Y7',
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

messageformat: {
  MESSAGE_FORMAT: process.env.MESSAGE_FORMAT || 'string'
},
  // Topic names — match Java constants exactly
  topics: {
    string:   'car-nested-string-topic',
    avro:     'car-nested-avro-topic',
    protobuf: 'car-nested-protobuf-topic',
    json:     'car-json-topic',       // kept but not used in scheduler (commented out in Java too)
  },

  // Subject names used to look up schemas in the registry
  subjects: {
    avro:             'car-nested-avro-topic-value',
    avroLocation:     'test-location-avro',      // SchemaReference in AvroProducer.java
    protobuf:         'car-nested-protobuf-topic-value',
    protobufLocation: 'location.proto',          // SchemaReference in ProtobufProducer.java
    json:             'car-json-topic-value',
  },
};

module.exports = config;
