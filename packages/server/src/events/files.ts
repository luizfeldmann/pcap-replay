import EventEmitter from "events";
import {
  FileCreatedEvent,
  FileDeletedEvent,
  FileEvent,
  FilePatchEvent,
} from "shared";

//! Distributes events for all files
const allFiles = new EventEmitter();
const EVENT_NAME = "files";

//! Subscribes to events from all files
const subscribeToAllFiles = (listener: (event: FileEvent) => void) => {
  allFiles.on(EVENT_NAME, listener);
  return {
    unsubscribe: () => allFiles.off(EVENT_NAME, listener),
  };
};

//! Broadscasts a file event to all the listeners
const emitFileEvent = (event: FileEvent) => {
  allFiles.emit(EVENT_NAME, event);
};

const emitFileCreatedEvent = (data: FileCreatedEvent["data"]) =>
  emitFileEvent({
    topic: "file",
    operation: "create",
    data,
  });

const emitFileDeletedEvent = (data: FileDeletedEvent["data"]) =>
  emitFileEvent({
    topic: "file",
    operation: "delete",
    data,
  });

const emitFilePatchEvent = (data: FilePatchEvent["data"]) =>
  emitFileEvent({
    topic: "file",
    operation: "patch",
    data,
  });

export const FileEvents = {
  subscribeToAllFiles,
  emitFileCreatedEvent,
  emitFileDeletedEvent,
  emitFilePatchEvent,
};
