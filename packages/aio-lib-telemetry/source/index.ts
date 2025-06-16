// This file collects and exports all the public API of the telemetry module.

export {
  getAioRuntimeAttributes,
  getAioRuntimeResource,
  getAioRuntimeResourceWithAttributes,
} from "./api/attributes";

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
export { getLogger } from "./core/logging";
export { getGlobalTelemetryApi } from "./core/telemetry-api";
export {
  instrument,
  instrumentEntrypoint,
  getInstrumentationHelpers,
} from "./core/instrumentation";

export * from "./types";
