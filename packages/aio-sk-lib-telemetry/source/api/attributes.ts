import { resourceFromAttributes } from "@opentelemetry/resources";
import { inferTelemetryAttributesFromRuntimeMetadata } from "~/helpers/runtime";

/** Infers some useful attributes for the current action from the Adobe I/O Runtime. */
export function getAioRuntimeAttributes() {
  return inferTelemetryAttributesFromRuntimeMetadata();
}

/** Creates a resource from the attributes inferred from the Adobe I/O Runtime. */
export function getAioRuntimeResource() {
  return resourceFromAttributes(getAioRuntimeAttributes());
}

/**
 * Combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.
 * @param attributes - The attributes to combine with the attributes inferred from the Adobe I/O Runtime.
 */
export function getAioRuntimeResourceWithAttributes(
  attributes: Record<string, string>,
) {
  return resourceFromAttributes({
    ...getAioRuntimeAttributes(),
    ...attributes,
  });
}
