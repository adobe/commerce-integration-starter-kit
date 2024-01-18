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

const naming = require('../../../onboarding/utils/naming.js')

describe('Throws error', () => {

    test('when label is undefined', () => {
        const label = null
        const environment = {AIO_runtime_namespace: '1340225-testProject-testWorkspace'}
        expect(() => {
            naming.addSuffix(label, environment)
        }).toThrow(Error)

    })

    test('when environment is undefined', () => {
        const label = 'Label'
        const environment = null
        expect(() => {
            naming.addSuffix(label, environment)
        }).toThrow(Error)
    })

    test('when runtime namespace is undefined in the environment', () => {
        const label = 'Label'
        const environment = {}
        expect(() => {
            naming.addSuffix(label, environment)
        }).toThrow(Error)
    })
})

describe('Adds suffix', () => {

    test('when runtime namespace is defined in the environment', () => {
        const label = 'Label'
        const environment = {AIO_runtime_namespace: '1340225-testProject-testWorkspace'}
        expect(naming.addSuffix(label, environment)).toEqual('Label - testProject-testWorkspace')
    })
})
