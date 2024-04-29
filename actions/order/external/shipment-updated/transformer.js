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
      entity_id: item.entityId,
      order_item_id: item.orderItemId,
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
      entity_id: track.entityId,
      order_id: orderId,
      track_number: track.trackNumber,
      title: track.title,
      carrier_code: track.carrierCode
    }
  ))
}

/**
 * Transforms incoming comments
 * @param {Array} comments - incoming comments
 * @returns {Array} - transformed comments
 */
function transformComments (comments) {
  return comments.map(comment => (
    {
      entity_id: comment.entityId,
      is_customer_notified: comment.notifyCustomer ? 1 : 0,
      comment: comment.comment,
      is_visible_on_front: comment.visibleOnFront ? 1 : 0
    }
  ))
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
    entity: {
      entity_id: params.data.id,
      order_id: params.data.orderId,
      items: transformItems(params.data.items),
      tracks: transformTracks(params.data.orderId, params.data.tracks),
      comments: transformComments(params.data.comments),
      extension_attributes: {
        source_code: params.data.stockSourceCode
      }
    }
  }
}

module.exports = {
  transformData
}
