// This file collects and exports all the public API of the telemetry module.

export { getLogger } from "./api/logging";
export { getApplicationMonitor } from "./core/monitor";
export {
  instrument,
  instrumentEntrypoint,
  getInstrumentationHelpers,
} from "./core/instrumentation";

export {
  serializeContextIntoCarrier,
  deserializeContextFromCarrier,
} from "./api/propagation";

export {
  getActiveSpan,
  tryGetActiveSpan,
  addEventToActiveSpan,
} from "./api/global";

export { defineTelemetryConfig } from "./core/config";
export { getPresetInstrumentations } from "./api/presets";
export { getAioRuntimeAttributes } from "./api/runtime";

export * from "./types";
