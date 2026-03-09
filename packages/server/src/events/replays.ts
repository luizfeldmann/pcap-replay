import EventEmitter from "events";
import { ReplayLogEvent } from "shared";

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

export const ReplayEvents = {
  subscribeLogs,
  emitLogEvent,
  emitLogEventData,
};
