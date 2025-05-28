import { inferTelemetryAttributesFromRuntimeMetadata } from "~/helpers/runtime";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

/**
 * Infers some useful attributes for the current action from the Adobe I/O Runtime.
 * @param serviceName - The service name to use.
 * @param serviceVersion - The service version to use.
 */
export function getAioRuntimeAttributes(
  serviceName?: string,
  serviceVersion?: string,
) {
  const {
    [ATTR_SERVICE_NAME]: defaultServiceName,
    [ATTR_SERVICE_VERSION]: defaultServiceVersion,
    ...telemetryAttributes
  } = inferTelemetryAttributesFromRuntimeMetadata();

  return {
    [ATTR_SERVICE_NAME]: serviceName ?? defaultServiceName,
    [ATTR_SERVICE_VERSION]: serviceVersion ?? defaultServiceVersion,
    ...telemetryAttributes,
  };
}
