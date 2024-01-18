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

require('dotenv').config();
const fetch = require("node-fetch");

function buildProviderData(providerEvents) {
    const events = [];

    if (providerEvents.length > 0) {
        for (const event of providerEvents) {
            events.push({
                event_code: event,
                label: event,
                description: event
            })
        }
    }

    return events;
}


async function addEventCodeToProvider(metadata, providerId, envConfigs, accessToken) {
    console.log(`Trying to create metadata for ${metadata?.event_code} to provider ${providerId}`)
    const addEventMetadataReq = await fetch(
        `${envConfigs.IO_MANAGEMENT_BASE_URL}${envConfigs.IO_CONSUMER_ID}/${envConfigs.IO_PROJECT_ID}/${envConfigs.IO_WORKSPACE_ID}/providers/${providerId}/eventmetadata`,
        {
            method: 'POST',
            headers: {
                'x-api-key': `${envConfigs.OAUTH_CLIENT_ID}`,
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json',
                'Accept': 'application/hal+json'
            },
            body: JSON.stringify(
                {
                    ...(metadata?.event_code ? {event_code: `${metadata?.event_code}`} : null),
                    ...(metadata?.label ? {label: `${metadata?.label}`} : null),
                    ...(metadata?.description ? {description: `${metadata?.description}`} : null),
                }
            )
        }
    )

    const result = await addEventMetadataReq.json();
    if (result?.reason) {
        return {
            success: false,
            error: {
                reason: result?.reason,
                message: result?.message
            }
        }
    }
    return {
        success: true
    };
}

async function addMetadataToProvider(providerEvents, providerId, envConfigs, accessToken) {
    const commerceProviderMetadata = buildProviderData(providerEvents);
    for (const metadata of commerceProviderMetadata) {
        const result = await addEventCodeToProvider(metadata, providerId, envConfigs, accessToken);
        if (!result.success) {
            const errorMessage = `Unable to add event metadata: reason = '${result.error?.reason}', message = '${result.error?.message}'`;

            console.log(errorMessage)

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    return {
        success: true
    }
}

async function getExistingMetadata(providerId, envConfigs, accessToken, next = null) {
    const url = `${envConfigs.IO_MANAGEMENT_BASE_URL}providers/${providerId}/eventmetadata`;

    const getExistingMetadataReq = await fetch(
        next ? next: url,
        {
            method: 'GET',
            headers: {
                'x-api-key': `${envConfigs.OAUTH_CLIENT_ID}`,
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json',
                'Accept': 'application/hal+json'
            }
        }
    )
    const getExistingMetadataResult = await getExistingMetadataReq.json()
    const existingMetadata = [];
    if (getExistingMetadataResult?._embedded?.eventmetadata) {
        getExistingMetadataResult._embedded.eventmetadata.forEach(event => {
            existingMetadata[event.event_code] = event
        })
    }
    if (getExistingMetadataResult?._links?.next) {
        const data = await getExistingMetadata(providerId, envConfigs, accessToken, getExistingMetadataResult._links.next);
        existingMetadata.push(...data);
    }
    return existingMetadata;
}

async function main(clientRegistrations, providers, accessToken) {

    try {
        const envConfigs = process.env;
        const providersEventsConfig = require("./config/events.json");
        const providersEvents = [];

        const result = [];
        for (const provider of providers) {
            const existingMetadata = await getExistingMetadata(provider.id, envConfigs, accessToken);

            for (const [entityName, options] of Object.entries(clientRegistrations)) {
                if (options !== undefined && options.includes(provider.key)) {
                    if (providersEventsConfig[entityName]) {
                        for (const event of providersEventsConfig[entityName][provider.key]) {
                            if (existingMetadata[event]) {
                                console.log(`Skipping, Metadata event code ${event} already exists!`)
                                continue;
                            }
                            providersEvents.push(event);
                        }
                        result.push({
                            entity: entityName,
                            label: provider.label
                        })
                    }
                }
            }

            const addMetadataResult = await addMetadataToProvider(providersEvents, provider.id, envConfigs, accessToken);
            if (!addMetadataResult.success) {
                return {
                    code: 500,
                    success: false,
                    error: addMetadataResult.error
                };
            }
        }

        const response = {
            code: 200,
            success: true,
            result
        }

        console.log(`${response.code}: Process of adding metadata to provider done successfully`)
        return response
    } catch (error) {
        let errorMessage = `Unable to complete the process of adding metadata to provider: ${error.message}`;
        console.log(errorMessage)
        return {
            code: 500,
            success: false,
            error: errorMessage
        }
    }
}

exports.main = main
