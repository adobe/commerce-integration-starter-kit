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

import { propagation, context } from "@opentelemetry/api";

/**
 * Serializes the current context into a carrier.
 * @param carrier - The carrier object to inject the context into.
 * @param ctx - The context to serialize. Defaults to the active context.
 *
 * @example
 * ```ts
 * const carrier = serializeContextIntoCarrier();
 * // carrier is now a record with the context data
 * ```
 *
 * @example
 * ```ts
 * const myCarrier = { more: 'data' };
 * const carrier = serializeContextIntoCarrier(myCarrier);
 * // carrier now contains both the existing data and the context data
 * // carrier = { more: 'data', ...contextData }
 * ```
 */
export function serializeContextIntoCarrier<
  Carrier extends Record<string, string>,
>(carrier?: Carrier, ctx = context.active()) {
  const carrierObject = carrier ?? {};
  propagation.inject(ctx, carrierObject);

  return carrierObject as Carrier;
}

/**
 * Deserializes the context from a carrier and augments the given base context with it.
 * @param carrier - The carrier object to extract the context from.
 * @param baseCtx - The base context to augment. Defaults to the active context.
 *
 * @example
 * ```ts
 * const carrier = { traceparent: "...00-069ea333a3d430..." };
 * const ctx = deserializeContextFromCarrier(carrier);
 * // ctx now contains the context data from the carrier
 * ```
 */
export function deserializeContextFromCarrier<
  Carrier extends Record<string, string>,
>(carrier: Carrier, baseCtx = context.active()) {
  return propagation.extract(baseCtx, carrier);
}
