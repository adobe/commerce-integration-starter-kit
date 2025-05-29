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

import type { TelemetryInstrumentationPreset } from "~/types";

import {
  HttpInstrumentation,
  type HttpInstrumentationConfig,
} from "@opentelemetry/instrumentation-http";

import {
  UndiciInstrumentation,
  type UndiciInstrumentationConfig,
} from "@opentelemetry/instrumentation-undici";

import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const httpInstrumentationConfig = {
  // Prevent traces from being created by the un-managed logic of `aio app dev`.
  requireParentforIncomingSpans: true,
} satisfies HttpInstrumentationConfig;

const undiciInstrumentationConfig = {
  // Prevent traces from being created by the un-managed logic of `aio app dev`.
  requireParentforSpans: true,
} satisfies UndiciInstrumentationConfig;

/**
 * Get the instrumentations for a given preset.
 * 
 * @param preset - The preset to get the instrumentations for.
 * @returns The instrumentations for the given preset:
 * - `full`: All the Node.js [auto-instrumentations](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node)
 * - `simple`: Instrumentations for:
 *   [Http](https://www.npmjs.com/package/@opentelemetry/instrumentation-http),
 *   [GraphQL](https://www.npmjs.com/package/@opentelemetry/instrumentation-graphql),
 *   [Undici](https://www.npmjs.com/package/@opentelemetry/instrumentation-undici), and
 *   [Winston](https://www.npmjs.com/package/@opentelemetry/instrumentation-winston)
 * 
 * @example
 * ```ts
 * const instrumentations = getPresetInstrumentations("simple");
 * // instrumentations = [HttpInstrumentation, GraphQLInstrumentation, UndiciInstrumentation, WinstonInstrumentation]
 * ```
 */
export function getPresetInstrumentations(preset: TelemetryInstrumentationPreset) {
  switch (preset) {
    case "simple": {
      return [
        new HttpInstrumentation(httpInstrumentationConfig),
        new GraphQLInstrumentation(),
        new UndiciInstrumentation(undiciInstrumentationConfig),
        new WinstonInstrumentation(),
      ];
    }

    case "full": {
      return getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-http": httpInstrumentationConfig,
        "@opentelemetry/instrumentation-undici": undiciInstrumentationConfig,
      });
    }
  }
}
