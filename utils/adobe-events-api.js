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

module.exports = {
    getExistingRegistrations
}