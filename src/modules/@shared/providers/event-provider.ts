
import { EventEmitter } from 'events';

export class EventEmitterSingleton {
  static eventEmitter: EventEmitter;

  public static getInstance(): EventEmitter {
    if (!EventEmitterSingleton.eventEmitter) {
        EventEmitterSingleton.eventEmitter = new EventEmitter();
    }
    return EventEmitterSingleton.eventEmitter;
  }
}

