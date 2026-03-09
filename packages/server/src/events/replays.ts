import EventEmitter from "events";
import {
  ReplayCreatedEvent,
  ReplayDeleteEvent,
  ReplayEvent,
  ReplayLogEvent,
  ReplayPatchEvent,
  ReplayStatusEvent,
} from "shared";

//! Distributes replay logs events
const logEvents = new EventEmitter();

//! Registers a listener for the logs of a particular replay job
const subscribeLogs = (
  id: string,
  listener: (event: ReplayLogEvent) => void,
) => {
  logEvents.on(id, listener);
  return {
    unsubscribe: () => logEvents.off(id, listener),
  };
};

//! Broadscasts a log event to all the listeners
const emitLogEvent = (event: ReplayLogEvent) => {
  logEvents.emit(event.data.id, event);
};

const emitLogEventData = (data: ReplayLogEvent["data"]) => {
  emitLogEvent({ topic: "replay", operation: "log", data });
};

//! Distributes events for the whole collection of replays
const collectionEvents = new EventEmitter();
const EVENT_NAME_COLLECTION = "replays-collection";

//! Registers a listener for the mutations on the collection/list of all events
const subscribeCollection = (listener: (event: ReplayEvent) => void) => {
  collectionEvents.on(EVENT_NAME_COLLECTION, listener);
  return {
    unsubscribe: () => collectionEvents.off(EVENT_NAME_COLLECTION, listener),
  };
};

//! Distributes events for individual replays
const itemEvents = new EventEmitter();

const subscribeSingleReplay = (
  id: string,
  listener: (event: ReplayEvent) => void,
) => {
  itemEvents.on(id, listener);
  return {
    unsubscribe: () => itemEvents.off(id, listener),
  };
};

// Emitters

const emitReplayEvent = (event: ReplayEvent) => {
  collectionEvents.emit(EVENT_NAME_COLLECTION, event);
  itemEvents.emit(event.data.id, event);
};

const emitReplayCreatedEvent = (data: ReplayCreatedEvent["data"]) =>
  emitReplayEvent({ topic: "replay", operation: "create", data });

const emitReplayDeletedEvent = (data: ReplayDeleteEvent["data"]) =>
  emitReplayEvent({ topic: "replay", operation: "delete", data });

const emitReplayPatchEvent = (data: ReplayPatchEvent["data"]) =>
  emitReplayEvent({ topic: "replay", operation: "patch", data });

const emitReplayStatusEvent = (data: ReplayStatusEvent["data"]) =>
  emitReplayEvent({ topic: "replay", operation: "status", data });

export const ReplayEvents = {
  // Logs
  subscribeLogs,
  emitLogEvent,
  emitLogEventData,
  // Collection
  subscribeCollection,
  // Single item
  subscribeSingleReplay,
  // Emitters
  emitReplayCreatedEvent,
  emitReplayDeletedEvent,
  emitReplayPatchEvent,
  emitReplayStatusEvent,
};
