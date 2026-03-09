import { useEffect } from "react";

//! Callback signature for SSE listener
export type Listener = (e: MessageEvent) => void;

//! Options for the useSSE hook
export type OptionsUseSSE = {
  key: string;
  url: string;
  handler: Listener;
  disabled?: boolean;
};

//! Subscribes to server-sent-events
export const useSSE = ({ key, url, handler, disabled }: OptionsUseSSE) => {
  useEffect(() => {
    // No-op if disabled
    if (disabled) return () => {};

    // Subscribe and return the unsubscribe as cleanup
    subscribe(key, url, handler);
    return () => unsubscribe(key, handler);
  }, [key, url, handler, disabled]);
};

//! Stores the state of the de-dupped event source and it's subscribers
type Subscription = {
  url: string;
  evtsrc: EventSource;
  listeners: Set<Listener>;
};

//! Maps subscription keys to the state
const subscriptions = new Map<string, Subscription>();

//! Broadcasts a received event to all the listeners
const broadcast = (sub: Subscription, e: MessageEvent) => {
  // Invoke each listener with this message
  sub.listeners.forEach((listener) => listener(e));
};

//! Creates or reuses an event source to listen for the SSE events
const subscribe = (key: string, url: string, handler: Listener) => {
  // Try to find existing subscription
  let sub = subscriptions.get(key);

  if (!sub) {
    // A new subscription must be created
    sub = {
      url,
      evtsrc: new EventSource(url),
      listeners: new Set(),
    };

    // Register general handler for the event source
    sub.evtsrc.onmessage = (e) => broadcast(sub!, e);

    // Keep the subscription mapped
    subscriptions.set(key, sub);
  } else {
    // Check that the key always use the same url
    if (sub.url !== url)
      throw new Error(`SSE key '${key}' reused with different URL`);
  }

  // Register the new subscriber
  sub.listeners.add(handler);
};

//! Derefs a listener from the event source
const unsubscribe = (key: string, handler: Listener) => {
  // Find registered subscription by the key
  const sub = subscriptions.get(key);
  if (!sub) return;

  // Remove this listener
  sub.listeners.delete(handler);

  // Close subscription when there are no more consumers
  if (sub.listeners.size === 0) {
    sub.evtsrc.close();
    subscriptions.delete(key);
  }
};
