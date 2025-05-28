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

import { context, trace, type Attributes } from "@opentelemetry/api";

/**
 * Gets the active span from the given context.
 * @param ctx - The context to get the span from.
 * @throws {Error} An error if no span is found.
 */
export function getActiveSpan(ctx = context.active()) {
  const span = trace.getSpan(ctx);
  if (!span) {
    throw new Error("No active span found");
  }

  return span;
}

/**
 * Tries to get the active span from the given context.
 * @param ctx - The context to get the span from.
 */
export function tryGetActiveSpan(ctx = context.active()) {
  const span = trace.getSpan(ctx);
  if (!span) {
    return null;
  }

  return span;
}

/**
 * Adds an event to the given span.
 * @param event - The event name to add.
 * @param attributes - The attributes to add to the event.
 */
export function addEventToActiveSpan(event: string, attributes?: Attributes) {
  const span = getActiveSpan();
  span.addEvent(event, attributes);
}

/**
 * Tries to add an event to the active span.
 * @param event - The event name to add.
 * @param attributes - The attributes to add to the event.
 */
export function tryAddEventToActiveSpan(
  event: string,
  attributes?: Attributes,
) {
  const span = tryGetActiveSpan();
  if (span) {
    span.addEvent(event, attributes);
  }
}
