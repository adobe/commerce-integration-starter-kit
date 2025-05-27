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

import { propagation, context, SpanKind } from "@opentelemetry/api";

/**
 * Determines if the context should be propagated for a given span kind.
 * @param spanKind - The span kind to check.
 */
export function shouldSerializeContext(spanKind: SpanKind) {
  // PRODUCER is used when a service is sending an event
  // CLIENT is used when a service is sending a request to another service
  // In both cases, we'd normally want to propagate the context of the span
  return spanKind === SpanKind.PRODUCER || spanKind === SpanKind.CLIENT;
}

/**
 * Determines if the context should be read for a given span kind.
 * @param spanKind - The span kind to check.
 */
export function shouldDeserializeContext(spanKind: SpanKind) {
  // CONSUMER is used when a service is receiving an event
  // SERVER is used when a service is handling a request
  // In both cases, we'd normally want to read the context of the span
  return spanKind === SpanKind.CONSUMER || spanKind === SpanKind.SERVER;
}

/**
 * Serializes the current context into a carrier.
 * @param carrier - The carrier object to inject the context into.
 * @param ctx - The context to serialize. Defaults to the active context.
 */
export function serializeContextIntoCarrier<
  Carrier extends Record<string, string>,
>(carrier?: Carrier, ctx = context.active()) {
  propagation.inject(ctx, carrier ?? {});
  return carrier;
}

/**
 * Deserializes the context from a carrier and augments the given base context with it.
 * @param carrier - The carrier object to extract the context from.
 * @param baseCtx - The base context to augment. Defaults to the active context.
 */
export function deserializeContextFromCarrier<
  Carrier extends Record<string, string>,
>(carrier: Carrier, baseCtx = context.active()) {
  return propagation.extract(baseCtx, carrier);
}
