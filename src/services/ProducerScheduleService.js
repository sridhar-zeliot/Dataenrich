'use strict';

const config = require('../config/config');

/**
 * Equivalent of ProducerScheduleService.java.
 *
 * Runs on a fixed interval (default 10s) — equivalent of @Scheduled(fixedRate = 10000).
 *
 * Active producers (matches Java):
 *   ✅ AvroProducer
 *   ✅ ProtobufProducer
 *   ✅ StringProducer
 *   ❌ JSONProducerService  ← commented out in Java, same here
 *
 * All three run concurrently — equivalent of:
 *   Executors.newVirtualThreadPerTaskExecutor() + three executorService.submit() calls.
 */
class ProducerScheduleService {
  /**
   * @param {import('../util/RandomCarDataGenerator')} carDataGenerator
   * @param {import('./AvroProducer')}                 avroProducer
   * @param {import('./ProtobufProducer')}             protobufProducer
   * @param {import('./StringProducer')}               stringProducer
   * @param {import('./JSONProducerService')}          jsonProducer
   */
  constructor(carDataGenerator, avroProducer, protobufProducer, stringProducer, jsonProducer) {
    this.carDataGenerator = carDataGenerator;
    this.avroProducer     = avroProducer;
    this.protobufProducer = protobufProducer;
    this.stringProducer   = stringProducer;
    this.jsonProducer     = jsonProducer;
    this._timer           = null;
  }

  start() {
    const intervalMs = config.scheduler.intervalMs;
    console.log(`[Scheduler] Starting — interval = ${intervalMs}ms`);
    this._produce();
    this._timer = setInterval(() => this._produce(), intervalMs);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
      console.log('[Scheduler] Stopped.');
    }
  }

  /**
   * Equivalent of produceCarToBothFormats() in Java.
   * Generates one Car and fires all active producers concurrently.
   */
  async _produce() {
    const car = this.carDataGenerator.generateRandomCar();
    console.log(
      `[Scheduler] New car → id=${car.carId} name=${car.carName}` +
      ` speed=${car.speed.toFixed(2)}` +
      ` lat=${car.location.latitude.toFixed(4)} lng=${car.location.longitude.toFixed(4)}`
    );

    console.log(`📌 Active Message Format: ${config.messageformat.MESSAGE_FORMAT}`);

    try {
      const format = config.messageformat.MESSAGE_FORMAT.toLowerCase();

      switch (format) {
        case 'avro':
          console.log('Producing AVRO message...');
          await this.avroProducer.produceCarAvro(car);
          break;

        case 'protobuf':
          console.log('Producing PROTOBUF message...');
          await this.protobufProducer.produceCarProto(car);
          break;

        case 'string':
          console.log('Producing STRING message...');
          await this.stringProducer.produceCarString(car);
          break;

        case 'json':
          console.log('Producing JSON message...');
          await this.jsonProducer.produceCarJson(car);
          break;

        default:
          console.error(`❌ Invalid MESSAGE_FORMAT: ${format}`);
      }
    } catch (err) {
      console.error('❌ Producer error:', err.message);
    }
    // Promise.allSettled — each producer handles its own errors internally,
    // so one failure does not cancel the others (same as separate virtual thread submits in Java)
    // await Promise.allSettled([
    //   // this.jsonProducerService.produceCarJson(car),  // commented out, same as Java
    //   this.avroProducer.produceCarAvro(car),
    //   this.protobufProducer.produceCarProto(car),
    //   this.stringProducer.produceCarString(car),
    // ]);
  }
}

module.exports = ProducerScheduleService;
