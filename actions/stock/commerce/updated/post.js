/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

/**
 * This function hold any logic needed post sending information to external backoffice application
 *
 * @param {object} data - data received before transformation
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 * @param {object} result - result data from the sender
 */
function postProcess (data, transformed, preProcessed, result) {
  // @TODO Here implement any preprocessing needed
}

module.exports = {
  postProcess
}
