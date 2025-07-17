/*
  Copyright 2025 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { resourceFromAttributes } from "@opentelemetry/resources";
import { inferTelemetryAttributesFromRuntimeMetadata } from "~/helpers/runtime";

/**
 * Infers some useful attributes for the current action from the Adobe I/O Runtime
 * and returns them as a record of key-value pairs.
 *
 * @example
 * ```ts
 * const attributes = getAioRuntimeAttributes();
 * // attributes = { action.namespace: "my-namespace", action.name: "my-action", ... }
 * ```
 */
export function getAioRuntimeAttributes() {
  return inferTelemetryAttributesFromRuntimeMetadata();
}

/**
 * Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html)
 * from the attributes inferred from the Adobe I/O Runtime and returns it as an OpenTelemetry Resource object.
 *
 * @see https://opentelemetry.io/docs/languages/js/resources/
 * @example
 * ```ts
 * const resource = getAioRuntimeResource();
 * // use this resource in your OpenTelemetry configuration
 * ```
 */
export function getAioRuntimeResource() {
  return resourceFromAttributes(getAioRuntimeAttributes());
}

/**
 * Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html)
 * that combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.
 * @param attributes - The attributes to combine with the attributes inferred from the Adobe I/O Runtime.
 *
 * @see https://opentelemetry.io/docs/languages/js/resources/
 * @example
 * ```ts
 * const resource = getAioRuntimeResourceWithAttributes({ foo: "bar" });
 * // resource = { action.namespace: "my-namespace", action.name: "my-action", foo: "bar", ... }
 * // use this resource in your OpenTelemetry configuration
 * ```
 */
export function getAioRuntimeResourceWithAttributes(
  attributes: Record<string, string>,
) {
  return resourceFromAttributes({
    ...getAioRuntimeAttributes(),
    ...attributes,
  });
}
