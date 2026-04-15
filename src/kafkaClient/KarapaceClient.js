'use strict';

const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry');
const config              = require('../config/config');

/**
 * Equivalent of KarapaceClient.java.
 *
 * Creates a Confluent-compatible Schema Registry client with:
 *   - basic.auth.credentials.source = USER_INFO
 *   - Supports AVRO, JSON_SCHEMA, PROTOBUF (same as the three SchemaProviders in Java)
 *
 * The registry library automatically resolves SchemaReferences when encoding —
 * equivalent to passing SchemaReference lists in the Java parseSchema() calls.
 */
function createSchemaRegistryClient() {
  return new SchemaRegistry({
    host: config.schemaRegistry.url,
    auth: {
      username: config.schemaRegistry.username,
      password: config.schemaRegistry.password,
    },
  });
}

module.exports = { createSchemaRegistryClient };
