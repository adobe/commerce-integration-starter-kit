require('dotenv').config();
const {checkMissingRequestInputs, errorResponse, objectContainsValue} = require("../actions/utils");
const fetch = require('node-fetch')


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

async function getExistingProviders(envConfigs, accessToken) {
    const getCreatedProvidersReq = await fetch(
        `${envConfigs.IO_MANAGEMENT_BASE_URL}${envConfigs.IO_CONSUMER_ID}/providers`,
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
    const getCreatedProvidersResult = await getCreatedProvidersReq.json()
    const existingProviders = [];
    if (getCreatedProvidersResult?._embedded?.providers) {
        getCreatedProvidersResult._embedded.providers.forEach(provider => {
            existingProviders[provider.label] = provider;
        })
    }
    return existingProviders;
}

async function createProvider(envConfigs, accessToken, provider) {
    const createCustomEventProviderReq = await fetch(
        `${envConfigs.IO_MANAGEMENT_BASE_URL}${envConfigs.IO_CONSUMER_ID}/${envConfigs.IO_PROJECT_ID}/${envConfigs.IO_WORKSPACE_ID}/providers`,
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
                    // read here about the use of the spread operator to merge objects: https://dev.to/sagar/three-dots---in-javascript-26ci
                    ...(provider?.label ? {label: `${provider?.label}`} : null),
                    ...(provider?.description ? {description: `${provider?.description}`} : null),
                    ...(provider?.docs_url ? {docs_url: `${provider?.docs_url}`} : null)
                }
            )
        }
    )
    const result = await createCustomEventProviderReq.json()
    if (!result?.id) {
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
        provider: result
    };
}


function hasSelection(selection, clientRegistrations) {
    for (const [entityName, options] of Object.entries(clientRegistrations)) {
        return !!(options !== undefined && options.includes(selection));
    }
    return false;
}

async function main(registrations = null) {
    // Load predefined provider, providerEvents and clientRegistrations
    const providersList = require("./config/providers.json");
    const providersEventsConfig = require("./config/events.json");
    let clientRegistrations = require("./custom/registrations.json");
    const envConfigs = process.env;

    if (registrations) {
        clientRegistrations = registrations;
    }

    try {
        // 'info' is the default level if not set
        console.log('Start process of creating providers: ', providersEventsConfig)

        // Validate client registration selection
        const requiredRegistrations = ['product', 'customer', 'order', 'stock', 'shipment']
        const errorMessage = checkMissingRequestInputs(clientRegistrations, requiredRegistrations, [])
        if (errorMessage) {
            // return and log client errors
            return {
                code: 400,
                error: errorMessage
            }
        }

        // Generate Adobe OAuth access token
        const generateAccessTokenResult = await getAccessToken(envConfigs);

        if (!generateAccessTokenResult?.success) {
            return {
                code: 500,
                error: `Unable to generate oauth token: ${generateAccessTokenResult.error}`
            };
        }

        const accessToken = generateAccessTokenResult.token;
        console.log('Even access token generated correctly.')

        // Load the existing providers in org
        const existingProviders = await getExistingProviders(envConfigs, accessToken);

        const result = [];

        // Loop over the predefined providers and create the provider in the System
        for (const provider of providersList) {
            const isProviderSelectedByClient = hasSelection(provider.key, clientRegistrations);
            if (isProviderSelectedByClient) {
                // Check if provider is already created
                const persistedProvider = existingProviders[provider.label];
                // persistedProvider = { value, expiration }
                if (persistedProvider) {
                    console.log(`persisted provider: ${JSON.stringify(persistedProvider)}`)
                    console.log(`Skipping creation of "${provider.label}" creation`)

                    result.push({
                        key: provider.key,
                        id: persistedProvider.id,
                        label: provider.label
                    })
                    continue
                }

                console.log(`Creating provider with: ` + provider.label)
                console.log(`provider information: ${JSON.stringify(provider)}`)

                const createProviderResult = await createProvider(envConfigs, accessToken, provider);
                if (!createProviderResult?.success) {
                    let errorMessage = `Unable to create provider: reason = '${createProviderResult.error?.reason}', message = '${createProviderResult.error?.message}'`;
                    console.log(errorMessage)
                    return {
                        code: 500,
                        error: errorMessage
                    };
                }

                result.push({
                    key: provider.key,
                    id: createProviderResult.provider?.id,
                    label: provider.label
                });
            }
        }

        result.forEach(provider => console.log(`Defining the ${provider.key} provider id as : ${provider.id}`));

        const response = {
            code: 200,
            result
        }

        // log the response status code
        console.log(`${response.code}: Process of creating providers done successfully`)
        return response
    } catch (error) {
        let errorMessage = `Unable to complete the process of creating providers: ${error.message}`;
        console.log(errorMessage)
        return {
            code: 500,
            error: errorMessage
        }
    }
}

exports.main = main
