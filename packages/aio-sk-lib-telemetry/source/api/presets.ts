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

/** The preset to use for the telemetry module setup. */
type TelemetryPreset = "simple" | "full";

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
 * @param preset - The preset to get the instrumentations for.
 */
export function getPresetInstrumentations(preset: TelemetryPreset) {
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
