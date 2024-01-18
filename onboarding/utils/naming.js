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

const SEPARATOR = '-'

function labelSuffix(runtimeNamespace) {
    return runtimeNamespace.substring(runtimeNamespace.indexOf(SEPARATOR) + 1);
}

function addSuffix(labelPrefix, environment) {
    if (!labelPrefix) {
        throw Error('Cannot add suffix to undefined label')
    }
    if (!environment?.AIO_runtime_namespace) {
        throw Error('Unable to add suffix. AIO_runtime_namespace is undefined in the environment')
    }
    return `${labelPrefix} - ${labelSuffix(environment.AIO_runtime_namespace)}`
}

module.exports = {
    addSuffix
}
