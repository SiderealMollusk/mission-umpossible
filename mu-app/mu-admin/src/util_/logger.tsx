import { supabase } from "../supabase"; // Adjust the path if necessary

// --- Event Type IDs (resolved on module init) ---
let EVENT_TYPE_SYSTEM_INFO = 1;
let EVENT_TYPE_SYSTEM_WARN = 2;
let EVENT_TYPE_SYSTEM_ERROR = 22;
let EVENT_TYPE_SYSTEM_DEBUG = 23;

async function initializeEventTypeIds() {
  const { data, error } = await supabase.from("log_event_types").select("id, name");
  if (error) {
    console.warn("Could not fetch log_event_types, using fallback defaults");
    return;
  }

  for (const entry of data) {
    switch (entry.name) {
      case "system_info":
        EVENT_TYPE_SYSTEM_INFO = entry.id;
        break;
      case "system_warn":
        EVENT_TYPE_SYSTEM_WARN = entry.id;
        break;
      case "system_error":
        EVENT_TYPE_SYSTEM_ERROR = entry.id;
        break;
      case "system_debug":
        EVENT_TYPE_SYSTEM_DEBUG = entry.id;
        break;
    }
  }
}

// Fire-and-forget
initializeEventTypeIds();

import { v4 as uuidv4 } from 'uuid';

// --- Constants ---
const FLUSH_INTERVAL_MS = 500; // 0.5 seconds
const MAX_BUFFER_SIZE = 10;

// --- Internal Buffer ---
const logBuffer: {
  id: string;
  event_type_id: number;
  payload: object;
  created_at: string;
}[] = [];

// --- Core Logging Functions ---

export function log(
  event_type_id: number,
  payload: object,
  createdAtOverride?: Date
) {
  const logEntry = {
    id: uuidv4(),
    event_type_id,
    payload,
    created_at: (createdAtOverride || new Date()).toISOString(),
  };

  logBuffer.push(logEntry);

  // Also mirror to console
  if (event_type_id === EVENT_TYPE_SYSTEM_INFO) {
    console.log(`[info]`, payload);
  } else if (event_type_id === EVENT_TYPE_SYSTEM_WARN) {
    console.warn(`[warn]`, payload);
  } else if (event_type_id === EVENT_TYPE_SYSTEM_ERROR) {
    console.error(`[error]`, payload);
  }
}

// --- Convenience Shortcuts ---
log.info = (payload: object) => log(EVENT_TYPE_SYSTEM_INFO, payload);
log.warn = (payload: object) => log(EVENT_TYPE_SYSTEM_WARN, payload);
log.error = (payload: object) => log(EVENT_TYPE_SYSTEM_ERROR, payload);
log.debug = (payload: object) => log(EVENT_TYPE_SYSTEM_DEBUG, payload);
log.world = (payload: object) => log(99, payload); // Placeholder
log.character = (payload: object) => log(100, payload); // Placeholder

// --- Flush Function ---

async function flushLogBuffer() {
  if (logBuffer.length === 0) return;

  const logsToSend = [...logBuffer];
  logBuffer.length = 0;

  const { error } = await supabase
    .from("logs")
    .insert(logsToSend);

  if (error) {
    console.error("Failed to write logs to Supabase:", error);
    // Optionally could retry here
  }
}

// --- Timer Setup ---
let flushTimer: NodeJS.Timeout | null = null;

function ensureFlushLoop() {
  if (!flushTimer) {
    flushTimer = setInterval(() => {
      if (logBuffer.length >= MAX_BUFFER_SIZE || logBuffer.length > 0) {
        flushLogBuffer();
      }
    }, FLUSH_INTERVAL_MS);
  }
}

ensureFlushLoop();

// --- Flush on Browser Unload ---
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushLogBuffer();
  });
}

// --- Internal Testing Utilities ---
export const __private__ = {
  logBuffer,
  flushLogBuffer,
  getQueue: () => [...logBuffer],
  resetQueue: () => {
    logBuffer.length = 0;
  },
};
