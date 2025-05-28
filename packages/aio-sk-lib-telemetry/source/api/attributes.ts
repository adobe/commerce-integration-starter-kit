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
