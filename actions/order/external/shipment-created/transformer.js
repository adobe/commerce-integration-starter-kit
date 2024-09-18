/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Transforms incoming items
 * @param {Array} items - incoming items
 * @returns {Array} - transformed items
 */
function transformItems (items) {
  return items.map(item => (
    {
      order_item_id: item.id,
      qty: item.qty
    }
  ))
}

/**
 * Transforms incoming tracks
 * @param {number} orderId - order id
 * @param {Array} tracks - incoming tracks
 * @returns {Array} - transformed tracks
 */
function transformTracks (orderId, tracks) {
  return tracks.map(track => (
    {
      track_number: track.number,
      title: track.carrier.title,
      carrier_code: track.carrier.code
    }
  ))
}

/**
 * Transforms incoming comment
 * @param {string} comment - incoming comment
 * @returns {object} - transformed comment
 */
function transformComment (comment) {
  return {
    comment: comment,
    is_visible_on_front: 1
  }
}

/**
 * This function transform the received shipment data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns {object} - Returns transformed data object
 */
function transformData (params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  // @TODO Notice that the attribute_set_id may need to be changed

  return {
    items: transformItems(params.data.items),
    tracks: transformTracks(params.data.orderId, params.data.tracks),
    comment: transformComment(params.data.comment),
    extension_attributes: {
      source_code: params.data.inventoryCode
    }
  }
}

module.exports = {
  transformData
}
