---
id: dispatcher
title: Dispatcher
layout: docs
category: Reference
permalink: docs/dispatcher.html
next: flux-utils
---

Dispatcher is used to broadcast payloads to registered callbacks. This is
different from generic pub-sub systems in two ways:

- Callbacks are not subscribed to particular events. Every payload is
     dispatched to every registered callback.
- Callbacks can be deferred in whole or part until other callbacks have
     been executed.

Check out [Dispatcher.js](https://github.com/facebook/flux/blob/master/src/Dispatcher.js) for the source code.

## API

- **register(function callback): string**
Registers a callback to be invoked with every dispatched payload. Returns a token that can be used with `waitFor()`.

- **unregister(string id): void**
Removes a callback based on its token.

- **waitFor(array<string> ids): void**
Waits for the callbacks specified to be invoked before continuing execution of the current callback. This method should only be used by a callback in response to a dispatched payload.

- **dispatch(object payload): void** Dispatches a payload to all registered callbacks.

- **isDispatching(): boolean** Is this Dispatcher currently dispatching.

## Example

For example, consider this hypothetical flight destination form, which
selects a default city when a country is selected:

```
var flightDispatcher = new Dispatcher();

// Keeps track of which country is selected
var CountryStore = {country: null};

// Keeps track of which city is selected
var CityStore = {city: null};

// Keeps track of the base flight price of the selected city
var FlightPriceStore = {price: null};
```

When a user changes the selected city, we dispatch the payload:

```
flightDispatcher.dispatch({
  actionType: 'city-update',
  selectedCity: 'paris'
});
```

This payload is digested by `CityStore`:

```
flightDispatcher.register(function(payload) {
  if (payload.actionType === 'city-update') {
    CityStore.city = payload.selectedCity;
  }
});
```

When the user selects a country, we dispatch the payload:

```
flightDispatcher.dispatch({
  actionType: 'country-update',
  selectedCountry: 'australia'
});
```

This payload is digested by both stores:

```
 CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    CountryStore.country = payload.selectedCountry;
  }
});
```

When the callback to update `CountryStore` is registered, we save a reference
to the returned token. Using this token with `waitFor()`, we can guarantee
that `CountryStore` is updated before the callback that updates `CityStore`
needs to query its data.

```
CityStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    // `CountryStore.country` may not be updated.
    flightDispatcher.waitFor([CountryStore.dispatchToken]);
    // `CountryStore.country` is now guaranteed to be updated.

    // Select the default city for the new country
    CityStore.city = getDefaultCityForCountry(CountryStore.country);
  }
});
```

The usage of `waitFor()` can be chained, for example:

```
FlightPriceStore.dispatchToken =
  flightDispatcher.register(function(payload) {
    switch (payload.actionType) {
      case 'country-update':
      case 'city-update':
        flightDispatcher.waitFor([CityStore.dispatchToken]);
        FlightPriceStore.price =
          getFlightPriceStore(CountryStore.country, CityStore.city);
        break;
  }
});
```

The `country-update` payload will be guaranteed to invoke the stores'
registered callbacks in order: `CountryStore`, `CityStore`, then
`FlightPriceStore`.
