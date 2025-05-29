# Consumer action with Infinite Loop Breaker

## Infinite Loop Breaker

This action implement a Infinite Loop Breaker for Adobe Commerce product events with a third party backoffice.

Infinite Loop occurs for when a entity is updated in Adobe Commerce, this update is propagated to a 3rd party backoffice,
which send a new event about the update. This event is again prograpated to Adobe Commerce, where the process starts againg

```mermaid
---
title: Infinite Loop
---
sequenceDiagram
participant Adobe Commerce
box rgb(234, 240, 247) Runtime AppBuilder
participant commerce/consumer
participant external/consumer
end
participant Backoffice System

Adobe Commerce-->>commerce/consumer: Commerce Product Update
commerce/consumer-->>Backoffice System: Propagate Update Product
activate Backoffice System
Backoffice System->>Backoffice System: Updated
deactivate Backoffice System
Backoffice System-->>external/consumer: Backoffice Product Update
external/consumer-->>Adobe Commerce: Propagate Update Product
Note over external/consumer, Adobe Commerce: Loop is started here. This is an update caused by Commerce.Product Update
activate Adobe Commerce
Adobe Commerce->>Adobe Commerce: Updated
deactivate Adobe Commerce
Adobe Commerce-->>commerce/consumer: Commerce Product Update
Note over Adobe Commerce: Infinite loop in progress
```

## How to avoid the infinite loop

To avoid the infinite loop we should track which changes in a product entity have been caused a product update event. To do this:

1. Define a key for indentifying an entity.
2. Define a fingerprint to check when there is a change in an entity.
3. When an update for an entity arrives to our app, calculate the key and the fingerprint
4. We check if we have tracked this entity check, buy searching the key in our app.
   1. If the key does not exists we prograpage the update
   2. If the key exists compare the received figerprint compare with the stored one.
      1. If fingerprints are the same --> discard the event, as it's already processed
      2. If different propagate the event.


```mermaid
---
title: Infinite Loop 2
---
sequenceDiagram
participant Adobe Commerce
box rgb(234, 240, 247) Runtime AppBuilder Runtime AppBuilder
participant commerce/consumer
participant LibState
participant external/consumer
end
participant Backoffice System

Adobe Commerce-->>commerce/consumer: Commerce Product Update
activate commerce/consumer
commerce/consumer-->>LibState: Search entity key
LibState-->>commerce/consumer: Not found
commerce/consumer-->>LibState: Store key fingerprint
deactivate commerce/consumer

commerce/consumer-->>Backoffice System: Propagate Update Product
activate Backoffice System
Backoffice System->>Backoffice System: Updated
deactivate Backoffice System
Backoffice System-->>external/consumer: Backoffice Product Update
activate external/consumer
external/consumer-->>LibState: Search entity key
LibState-->>external/consumer: Found
break when fingerprint is the same
external/consumer-->external/consumer: Check fingerprint
end
deactivate external/consumer


```


## Implementation example

Implementation uses ```@adobe/aio-lib-state``` to maintain events that have been received in the AppBuilder app.

```javascript

// Import lib-state and infinite loop breaker
const stateLib = require('@adobe/aio-lib-state')
const { isAPotentialInfiniteLoop } = require('../../../infiniteLoopBreaker')

```

The consumer add the list of events we want to avoid infinite loops.

```javascript

 // Detect infinite loop and break it
    const infiniteLoopEventTypes = [
      'com.adobe.commerce.observer.catalog_product_save_commit_after',
      'com.adobe.commerce.observer.catalog_product_delete_commit_after'
    ]
```

Define two functions:
1. fnInfiniteLoopKey: Define a function to generate a key to identify that the event its related to an entity.

2. fnFingerprint: Define a function to generate an object that would be used as fingerprint. It should includes data that may change.

```javascript
  /**
   * This function generates afunction to genereate fingerprint for the data to be
   * used in infinite loop detection based on params.
   * @param {object} params Data received from the event
   * @returns {Function} the function that generates the fingerprint
   */
  function fnFingerprint (params) {
    return () => { return { product: params.data.value.sku, description: params.data.value.description } }
  }

  /**
   * This function generates a function to create a key for the infinite loop
   * detection based on params.
   * @param {object} params Data received from the event
   * @returns {Function} the function that generates the keu
   */
  function fnInfiniteLoopKey (params) {
    return () => { return `ilk_${params.data.value.sku}` }
  }

```

Check for infinite loop this way.

```javascript

    if (await isAPotentialInfiniteLoop(
      state,
      fnInfiniteLoopKey(params),
      fnFingerprint(params),
      infiniteLoopEventTypes,
      params.type)) {
      logger.info(`Infinite loop break for event ${params.type}`)
      }
```


Infinite loops can be initiated from commerce updates or third party updates. So this mechanism should be implemented in both agents receiving updates.