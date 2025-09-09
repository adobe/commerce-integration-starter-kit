const { getEventName } = require("./naming");

function transformSubscriptions(
  { eventing: { subscriptions = [] } },
  environment,
) {
  return subscriptions.map((sub) => {
    const { event, ...restSub } = sub;
    const { name, ...rest } = event;

    return {
      ...restSub,
      event: {
        name: getEventName(name, environment),
        parent: name,
        ...rest,
      },
    };
  });
}

function transformProviders({ eventing: { providers = [] } }, environment) {
  return providers.map((provider) => {
    let id = provider.id;
    const { eventsMetadata = [], ...rest } = provider;

    if (!id && rest.providerMetadata === "dx_commerce_events") {
      id = environment.COMMERCE_PROVIDER_ID;
    }

    if (!id && rest.providerMetadata === "3rd_party_custom_events") {
      id = environment.BACKOFFICE_PROVIDER_ID;
    }

    const mappedMetaData = eventsMetadata.map((event) => {
      const { eventCode, ...eventRest } = event;
      return {
        eventCode: getEventName(eventCode, environment),
        ...eventRest,
      };
    });
    return {
      ...rest,
      ...(id ? { id } : {}),
      eventsMetadata: mappedMetaData,
    };
  });
}

const defineConfig = (config, environment) => {
  return {
    ...config,
    eventing: {
      providers: transformProviders(config, environment),
      subscriptions: transformSubscriptions(config, environment),
    },
  };
};

module.exports = {
  defineConfig,
};
