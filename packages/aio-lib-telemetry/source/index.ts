// This file collects and exports all the public API of the telemetry module.

export { getAioRuntimeAttributes } from "./api/attributes";
export { getLogger } from "./api/logging";
export {
  serializeContextIntoCarrier,
  deserializeContextFromCarrier,
} from "./api/propagation";

export { getPresetInstrumentations } from "./api/presets";
export {
  getActiveSpan,
  tryGetActiveSpan,
  addEventToActiveSpan,
} from "./api/global";

export { defineTelemetryConfig, defineMetrics } from "./core/config";
export { getApplicationMonitor } from "./core/monitor";
export {
  instrument,
  instrumentEntrypoint,
  getInstrumentationHelpers,
} from "./core/instrumentation";

export * from "./types";
