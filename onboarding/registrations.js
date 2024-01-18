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

const fetch = require("node-fetch");

async function getExistingRegistrationsData(environment, accessToken, next = null) {
    const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`;

    const getRegistrationsReq = await fetch(
        next ? next : url,
        {
            method: 'GET',
            headers: {
                'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json',
                'Accept': 'application/hal+json'
            }
        }
    )
    const getRegistrationsResult = await getRegistrationsReq.json()

    let existingRegistrations = [];
    if (getRegistrationsResult?._embedded?.registrations) {
        getRegistrationsResult._embedded.registrations.forEach(registration => {
            existingRegistrations.push({
                id: registration.id,
                registration_id: registration.registration_id,
                name: registration.name,
                enabled: registration.enabled
            });
        })
    }

    if (getRegistrationsResult?._links?.next) {
        existingRegistrations.push(...await getExistingRegistrationsData(environment, accessToken, getRegistrationsResult._links.next.href));
    }

    return existingRegistrations;
}

async function getExistingRegistrations(environment, accessToken) {
    const existingRegistrationsResult = await getExistingRegistrationsData(environment, accessToken);
    const existingRegistrations = [];
    existingRegistrationsResult.forEach(item => existingRegistrations[item.name] = item);
    return existingRegistrations;
}

function stringToUppercaseFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRegistrationName(providerKey, entityName) {
    return stringToUppercaseFirstChar(providerKey) + ' ' + stringToUppercaseFirstChar(entityName) + ' Synchronization';
}

async function main(clientRegistrations, providers, environment, accessToken) {
    const eventsConfig = require('./config/events.json')
    const result = [];

    try {
        const existingRegistrations = await getExistingRegistrations(environment, accessToken);
        for (const provider of providers) {
            console.log(`Start creating registrations for the provider: ${provider.label}`)

            for (const [entityName, options] of Object.entries(clientRegistrations)) {
                if (!options.includes(provider.key)) {
                    continue;
                }

                const registrationName = getRegistrationName(provider.key, entityName);
                if (existingRegistrations[registrationName]) {
                    console.log(`Registration ${registrationName} already exists for entity ${entityName} - ${provider.key}`)
                    result.push(existingRegistrations[registrationName]);
                    continue;
                }

                let events = [];
                for (const event of eventsConfig[entityName][provider.key]) {
                    events.push({
                        provider_id: provider.id,
                        event_code: event
                    });
                }
                const createEventRegistrationResult = await createRequestRegistration(accessToken, entityName, provider.key, events, environment);
                if (!createEventRegistrationResult.success) {
                    const errorMessage = `Unable to create registration for ${entityName} with provider ${provider.key} - ${provider.id}`;
                    console.log(errorMessage)
                    console.log(`Reason: ${createEventRegistrationResult.error.reason}, message: ${createEventRegistrationResult.error.message}`)
                    return {
                        code: 500,
                        success: false,
                        error: errorMessage
                    }
                }
                console.log(`Registration created for entity ${entityName} - ${provider.key}`)
                result.push(createEventRegistrationResult.result);
            }
        }
        console.log('Create registrations process done correctly!')
        console.log('Created registrations: ', result);
        return {
            code: 200,
            success: true,
            registrations: result
        }
    } catch (error) {
        let errorMessage = `Unable to complete the process of creating events registrations: ${error.message}`;
        console.log(errorMessage)
        return {
            code: 500,
            success: false,
            error: errorMessage
        }
    }
}

async function createRequestRegistration(accessToken, entityName, providerKey, events, environment) {

    let body = JSON.stringify(
        {
            client_id: `${environment.OAUTH_CLIENT_ID}`,
            runtime_action: `${entityName}/${providerKey}consumer`,
            name: getRegistrationName(providerKey, entityName),
            description: getRegistrationName(providerKey, entityName),
            events_of_interest: events,
            delivery_type: 'webhook'
        }
    )

    const createEventRegistrationReq = await fetch(
        `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`,
        {
            method: 'POST',
            headers: {
                'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json',
                'Accept': 'application/hal+json'
            },
            body: body
        }
    )

    const result = await createEventRegistrationReq.json();

    if (!result?.client_id) {
        return {
            success: false,
            error: {
                reason: result?.reason,
                message: result?.message
            }
        }
    }
    return {
        success: true,
        result: {
            id: result?.id,
            registration_id: result?.registration_id,
            name: result?.name,
            enabled: result?.enabled
        }
    };
}

exports.main = main
