---
id: dispatcher-th-TH
title: Dispatcher
layout: docs
category: Reference
permalink: docs/dispatcher-th-TH.html
next: videos-th-TH
lang: th-TH
---

Dispatcher เป็นกลไกที่ใช้ส่งต่อข้อมูล payload ไปยัง callbacks ที่ถูกลงทะเบียนไว้ ซึ่งแตกต่างจากระบบ pub-sub โดยทั่วไป 2 ข้อ:

- Callbacks ไม่ได้ถูกผูกติดไว้กับ event ใด event หนึ่ง ข้อมูล payload ทั้งหมดถูกส่งต่อไปยัง callback ทุกตัว
- Callbacks สามารถหยุดรอได้ โดยที่สามารถทำได้ทั้ง callback หรือแค่บางส่วนจนกว่า callback ตัวอื่นๆ ทำงานเสร็จ

ลองดูโค้ดใน [Dispatcher.js](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)

## API

- **register(function callback): string**
ลงทะเบียน callback เพื่อเอาไว้เรียกใช้งานด้วยข้อมูล payload ที่ถูกส่งต่อมา ส่งค่า token คืนมาให้ซึ่งสามารถนำไปใช้กับคำสั่ง `waitFor()`

- **unregister(string id): void**
ลบ callback ตัวที่ระบุจาก token ทิ้งออกจากทะเบียน

- **waitFor(array<string> ids): void**
สั่งให้ callback ตัวปัจจุบันรอให้ callbacks ตัวที่ระบุทำงานก่อน คำสั่งนี้ควรเรียกใช้ใน callback ที่ทำงานเพื่อตอบสนองต่อข้อมูล payload

- **dispatch(object payload): void** ส่งข้อมูล payload ไปยัง callbacks ทุกตัวที่ลงทะเบียนไว้

- **isDispatching(): boolean** ตรวจสอบว่า Dispatcher ตัวนี้กำลังอยู่ระหว่างการส่งข้อมูลอยู่หรือไม่

## ตัวอย่าง

สมมติว่าเรามีแบบฟอร์มการเลือกสถานที่หมายของสายการบิน ซึ่งจะเลือกเมืองตั้งต้นให้อัตโนมัติหลังจากเลือกประเทศ:

```
var flightDispatcher = new Dispatcher();

// เก็บประเทศที่ถูกเลือก
var CountryStore = {country: null};

// เก็บเมืองที่ถูกเลือก
var CityStore = {city: null};

// เก็บราคาของเที่ยวบินสำหรับเมืองที่เลือก
var FlightPriceStore = {price: null};
```

เมื่อ user เลือกเมือง เราส่งค่า (dispatch) ข้อมูล payload ดังนี้:

```
flightDispatcher.dispatch({
  actionType: 'city-update',
  selectedCity: 'paris'
});
```

ข้อมูล payload นี้จะถูกประมวลผลโดย `CityStore`:

```
flightDispatcher.register(function(payload) {
  if (payload.actionType === 'city-update') {
    CityStore.city = payload.selectedCity;
  }
});
```

เมื่อ user เลือกประเทศ เรา dispatch ข้อมูล payload ดังนี้:

```
flightDispatcher.dispatch({
  actionType: 'country-update',
  selectedCountry: 'australia'
});
```

ข้อมูล payload นี้จะถูกประมวลผลโดยทั้งสอง stores:

```
 CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    CountryStore.country = payload.selectedCountry;
  }
});
```

ตอนที่เราลงทะเบียน callback เพื่อใช้อัพเดท `CountryStore` เราเก็บ token ที่ได้คืนมาจากการลงทะเบียนไว้ด้วยเพื่อใช้กับคำสั่ง `waitFor()` เพื่อประกันว่า `CountryStore` นั้นอัพเดทตัวเองเรียบร้อยแล้วก่อนที่ callback ที่จะอัพเดท `CityStore` ทำการดึงข้อมูลของมันมาใช้

```
CityStore.dispatchToken = flightDispatcher.register(function(payload) {
  if (payload.actionType === 'country-update') {
    // `CountryStore.country` อาจจะยังไม่อัพเดท
    flightDispatcher.waitFor([CountryStore.dispatchToken]);
    // `CountryStore.country` อัพเดทเรียบร้อยแล้ว

    // เลือกเมืองตั้งต้นให้โดยอัตโนมัติสำหรับประเทศที่เลือก
    CityStore.city = getDefaultCityForCountry(CountryStore.country);
  }
});
```

การใช้งานคำสั่ง `waitFor()` สามารถใช้ต่อกันได้ ตัวอย่างเช่น:

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

ถ้ามีข้อมูล payload ประเภท `country-update` เข้ามาเราสามารถมั่นใจได้ว่ามันจะเรียก callbacks ของ stores ต่างๆ ตามลำดับดังนี้: `CountryStore`, `CityStore` และ `FlightPriceStore` ตามลำดับ

