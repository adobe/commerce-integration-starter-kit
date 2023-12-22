const fetch = require("node-fetch");
const registrations = require("./custom/registrations.json");
require('dotenv').config();

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

async function main() {
    const environment = process.env;
    const registrations = require('./custom/registrations.json');

    console.log('Starting the process of on-boarding based on you registration choice');

    const generateAccessTokenResult = await getAccessToken(environment);

    if (!generateAccessTokenResult?.success) {
        return {
            code: 500,
            error: `Unable to generate oauth token: ${generateAccessTokenResult.error}`
        };
    }

    const accessToken = generateAccessTokenResult.token;

    const createProvidersResult = await require('./providers').main(registrations, accessToken);

    if (!createProvidersResult.success) {
        const errorMessage = `Process of on-boarding (providers) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    const providers = createProvidersResult.result;
    const createProvidersMetadataResult = await require('./metadata').main(registrations, providers, accessToken);

    if (!createProvidersMetadataResult.success) {
        const errorMessage = `Process of on-boarding (metadata) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    const registerEntityEventsResult = await require('./registrations').main(registrations, providers, accessToken);
    if (!registerEntityEventsResult.success) {
        const errorMessage = `Process of on-boarding (registrations) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    console.log('Process of On-Boarding done successfully:', providers)

    return {
        code: 200,
        success: true,
        providers,
        registrations: registerEntityEventsResult.registrations
    }
}

exports.main = main;