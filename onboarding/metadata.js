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

async function getAccessToken(envConfigs) {
    const scopes = envConfigs.OAUTH_SCOPES;
    const baseUrl = envConfigs.OAUTH_BASE_URL;
    const clientId = envConfigs.OAUTH_CLIENT_ID;
    const clientSecret = envConfigs.OAUTH_CLIENT_SECRET;
    const generateAccessTokenReq = await fetch(
        `${baseUrl}v3?client_id=${clientId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_secret=${clientSecret}&grant_type=client_credentials&scope=${scopes}`
        }
    )


    const result = await generateAccessTokenReq.json();

    if (!result?.access_token) {
        console.log(`Unable to generate oauth token: ${result.error}`);
        return {
            success: false,
            error: result.error
        }
    }
    return {
        success: true,
        token: result?.access_token
    }
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

async function main(clientRegistrations, providers) {
    const envConfigs = process.env;

    const providersEventsConfig = require("./config/events.json");


    const providersEvents = [];

    try {
        const generateAccessTokenResult = await getAccessToken(envConfigs);

        if (!generateAccessTokenResult?.success) {
            return {
                code: 500,
                error: `Unable to generate oauth token: ${generateAccessTokenResult.error}`
            };
        }

        const accessToken = generateAccessTokenResult.token;
        const result = [];

        for (const provider of providers) {
            for (const [entityName, options] of Object.entries(clientRegistrations)) {
                if (options !== undefined && options.includes(provider.key)) {
                    if (providersEventsConfig[entityName]) {
                        providersEvents.push(...providersEventsConfig[entityName][provider.key]);
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
                    error: addMetadataResult.error
                };
            }
        }

        const response = {
            code: 200,
            result
        }

        console.log(`${response.code}: Process of adding metadata to provider done successfully`)
        return response
    } catch (error) {
        let errorMessage = `Unable to complete the process of adding metadata to provider: ${error.message}`;
        console.log(errorMessage)
        return {
            code: 500,
            error: errorMessage
        }
    }
}

exports.main = main
