---
id: dispatcher-ko-KR
title: Dispatcher
layout: docs
category: Reference
permalink: docs/dispatcher-ko-KR.html
next: videos-ko-KR
lang: ko-KR
---

Dispatcher는 등록된 callback에 데이터를 중계할 때 사용된다. 일반적인 pub-sub 시스템과는 다음 두 항목이 다르다:

- 콜백은 이벤트를 개별적으로 구독하지 않는다. 모든 데이터 변동은 등록된 모든 콜백에 전달된다.
- 콜백이 실행될 때 콜백의 전체나 일부를 중단할 수 있다.

소스 코드를 보려면 [Dispatcher.js](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)에서 확인할 수 있다.

## API

- **register(function callback): string**
모든 데이터 변동이 있을 때 실행될 콜백을 등록한다. `waitFor()`에서 사용 가능한 토큰을 반환한다.

- **unregister(string id): void**
토큰으로 콜백을 제거한다.

- **waitFor(array<string> ids): void**
현재 실행한 콜백이 진행되기 전에 특정 콜백을 지연하게 한다. 데이터 변동에 응답하는 콜백에만 사용해야 한다.

- **dispatch(object payload): void** 등록된 모든 콜백에 데이터를 전달한다.

- **isDispatching(): boolean** 이 Dispatcher가 지금 데이터를 전달하고 있는지 확인한다.

## 예시

가상의 비행 목적지 양식에서 국가를 선택했을 때 기본 도시를 선택하는 예를 보자:

```
var flightDispatcher = new Dispatcher();

// 어떤 국가를 선택했는지 계속 추적한다
var CountryStore = {country: null};

// 어느 도시를 선택했는지 계속 추적한다
var CityStore = {city: null};

// 선택된 도시의 기본 항공료를 계속 추적한다
var FlightPriceStore = {price: null};
```

사용자가 선택한 도시를 변경하면 데이터를 전달한다:

```
flightDispatcher.dispatch({
  actionType: 'city-update',
  selectedCity: 'paris'
});
```

이 데이터 변동은 `CityStore`가 소화한다:

```
flightDispatcher.register(function(payload) {
  if (payload.actionType === 'city-update') {
    CityStore.city = payload.selectedCity;
  }
});
```

사용자가 국가를 선택하면 데이터를 전달한다:

```
flightDispatcher.dispatch({
  actionType: 'country-update',
  selectedCountry: 'australia'
});
```

이 데이터는 두 store에 의해 소화된다:

```
 CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    CountryStore.country = payload.selectedCountry;
  }
});
```
`CountryStore`가 등록한 콜백을 업데이트 할 때 반환되는 토큰을 참조값으로 저장했다. 이 토큰은 `waitFor()`
에서 사용할 수 있고 `CityStore`가 갱신하는 것보다 먼저 `CountryStore`를 갱신하도록 보장할 수 있다.

```
CityStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    // `CountryStore.country`는 업데이트 되지 않는다
    flightDispatcher.waitFor([CountryStore.dispatchToken]);
    // `CountryStore.country`는 업데이트가 될 수 있음이 보장되었다

    // 새로운 국가의 기본 도시를 선택한다
    CityStore.city = getDefaultCityForCountry(CountryStore.country);
  }
});
```

`waitFor()`는 다음과 같이 묶을 수 있다:

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

`country-update`는 콜백이 등록된 순서 즉 `CountryStore`, `CityStore`, `FlightPriceStore` 순서로 실행되도록 보장된다.
