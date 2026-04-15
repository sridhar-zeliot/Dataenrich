'use strict';

const { Kafka, logLevel } = require('kafkajs');
const config              = require('../config/config');

/**
 * Equivalent of KafkaProducerClient.java.
 *
 * Creates a KafkaJS producer with:
 *   - SASL_PLAINTEXT security protocol
 *   - SCRAM-SHA-512 mechanism
 *   - clientId = 'car-nested-producer'
 *   - retries  = 0
 *   - connectionTimeout = 3000ms
 *
 * A single producer instance is shared across all services (StringProducer,
 * AvroProducer, ProtobufProducer) — value bytes are pre-encoded by each
 * service before being handed to producer.send().
 */
async function createProducer() {
  const kafka = new Kafka({
    clientId: config.kafka.clientId,
    brokers:  [config.kafka.bootstrapServer],
    logLevel: logLevel.WARN,
    ssl:  false,
    sasl: {
      mechanism: 'scram-sha-512',
      username:  config.kafka.username,
      password:  config.kafka.password,
    },
    retry: {
      retries: config.kafka.retries,
    },
    connectionTimeout: config.kafka.connectionTimeout,
  });

  const producer = kafka.producer();
  await producer.connect();
  console.log('[KafkaProducerClient] Connected to', config.kafka.bootstrapServer);
  return producer;
}

module.exports = { createProducer };
