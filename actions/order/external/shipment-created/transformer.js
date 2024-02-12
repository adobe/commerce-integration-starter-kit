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
 * Transforms incoming items
 * @param {Array} items - incoming items
 * @returns {Array} - transformed items
 */
function transformItems (items) {
  return items.map(item => (
    {
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
