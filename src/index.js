'use strict';

const { createProducer }             = require('./kafkaClient/KafkaProducerClient');
const { createSchemaRegistryClient } = require('./kafkaClient/KarapaceClient');
const RandomCarDataGenerator         = require('./util/RandomCarDataGenerator');
const AvroProducer                   = require('./services/AvroProducer');
const ProtobufProducer               = require('./services/ProtobufProducer');
const StringProducer                 = require('./services/StringProducer');
const ProducerScheduleService        = require('./services/ProducerScheduleService');
const config                         = require('./config/config');

// Kept available if you want to enable JSON production
// const JSONProducerService = require('./services/JSONProducerService');

let producer  = null;
let scheduler = null;

async function main() {
  // 1. Schema Registry client (KarapaceClient)
  const registry = createSchemaRegistryClient();

  // 2. Kafka producer (shared across all services)
  producer = await createProducer();

  // 3. Wire up services (equivalent of Spring @Service bean injection)
  const carDataGenerator = new RandomCarDataGenerator( config.car.number);
  const avroProducer     = new AvroProducer(registry, producer);
  const protobufProducer = new ProtobufProducer(registry, producer);
  const stringProducer   = new StringProducer(producer);
  // const jsonProducerService = new JSONProducerService(registry, producer);  // disabled like Java

  // 4. Scheduler — equivalent of @Scheduled(fixedRate = 10000)
  scheduler = new ProducerScheduleService(
    carDataGenerator,
    avroProducer,
    protobufProducer,
    stringProducer,
  );
  scheduler.start();
}

// Graceful shutdown (SIGINT = Ctrl+C, SIGTERM = Docker/k8s stop)
async function shutdown(signal) {
  console.log(`\n[Main] ${signal} received — shutting down…`);
  if (scheduler) scheduler.stop();
  if (producer)  await producer.disconnect();
  console.log('[Main] Producer disconnected. Bye!');
  process.exit(0);
}

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[Main] Unhandled rejection:', reason);
});

main().catch((err) => {
  console.error('[Main] Fatal startup error:', err.message);
  process.exit(1);
});
