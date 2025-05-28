import type { NodeSDK } from "@opentelemetry/sdk-node";
import type { TelemetryApi } from "./source/types";

// These need to be globals, so they can survive across the hot reloads of `aio app dev`.
// Otherwise their values are lost, and the underlying OpenTelemetry singletons are initialized twice (which leads to errors).
declare global {
  /** The global OpenTelemetry SDK instance. */
  var __OTEL_SDK__: NodeSDK | null;

  /** The global OpenTelemetry telemetry API instance. */
  var __OTEL_TELEMETRY_API__: TelemetryApi | null;
}
