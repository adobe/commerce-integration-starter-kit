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

const crypto = require('crypto')

const { Core } = require('@adobe/aio-sdk')

/** @constant {string} FINGERPRINT_ALGORITHM - The algorithm used to generate the fingerprint */
const FINGERPRINT_ALGORITHM = 'sha256'

/** @constant {string} FINGERPRINT_ENCODING - The encoding used to generate the fingerprint */
const FINGERPRINT_ENCODING = 'hex'

/** @constant {number} DEFAULT_INFINITE_LOOP_BREAKER_TTL - The default time to live for the fingerprint in the lib state */
const DEFAULT_INFINITE_LOOP_BREAKER_TTL = 60 // seconds

/**
 * This function checks if there is a potential infinite loop
 *
 * @param {object} state - The state object
 * @param {Function} keyFn - Funtion to generate the key for the fingerprint
 * @param {Function} fingerPrintFn - Function to generate the fingerprint
 * @param {Array} eventTypes - The event types to include in the infinite loop check
 * @param {string} event - The event to check for potential infinite loops
 * @returns {boolean} - Returns true if the event is a potential infinite loop
 */
async function isAPotentialInfiniteLoop (state, keyFn, fingerPrintFn, eventTypes, event) {
  const logLevel = process.env.LOG_LEVEL || 'debug'

  const logger = Core.Logger('infiniteLoopBreaker', { level: logLevel })

  logger.debug(`Checking for potential infinite loop for event: ${event}`)

  if (!eventTypes.includes(event)) {
    logger.debug(`Event type ${event} is not in the infinite loop event types list`)
    return false
  }

  const key = typeof keyFn === 'function' ? keyFn() : keyFn
  const data = typeof fingerPrintFn === 'function' ? fingerPrintFn() : fingerPrintFn

  const persistedFingerPrint = await state.get(key) // { value, expiration }
  if (!persistedFingerPrint) {
    logger.debug(`No persisted fingerprint found for key ${key}`)
    return false
  }
  logger.debug(`Persisted fingerprint found for key ${key}: ${persistedFingerPrint.value}`)
  logger.debug(`Generated fingerprint: ${fingerPrint(data)}`)

  return persistedFingerPrint && persistedFingerPrint.value === fingerPrint(data)
}

/**
 * This function stores the fingerprint in the state
 *
 * @param {object} state - The state object
 * @param {string} key - The key to store the fingerprint
 * @param {object} data - The data to generate the fingerprint
 * @param {number} [ttl] - The time to live for the fingerprint in the lib state
 */
async function storeFingerPrint (state, key, data, ttl) {
  await state.put(key, fingerPrint(data), { ttl: ttl || DEFAULT_INFINITE_LOOP_BREAKER_TTL })
}

/**
 * This function generates a fingerprint for the data
 *
 * @param {object} data - The data to generate the fingerprint
 * @returns {string} - The fingerprint
 */
function fingerPrint (data) {
  const hash = crypto.createHash(FINGERPRINT_ALGORITHM)
  hash.update(JSON.stringify(data))
  return hash.digest(FINGERPRINT_ENCODING)
}

module.exports = {
  isAPotentialInfiniteLoop,
  storeFingerPrint
}
