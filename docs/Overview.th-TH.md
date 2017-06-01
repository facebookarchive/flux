---
id: overview-th-TH
title: Overview
layout: docs
category: Quick Start
permalink: docs/overview-th-TH.html
next: todo-list-th-TH
lang: th-TH
---

Flux คือหลักการออกแบบโครงสร้างแอพพลิเคชั่นที่ Facebook ใช้สร้าง web applications ที่ฝั่ง client โดยใช้ประโยชน์จากการที่ข้อมูลเดินทางในทิศทางเดียวซึ่งเหมาะกับ view components ของ React ที่สามารถประกอบกันได้ โดยที่ Flux เป็นเหมือนกับรูปแบบการทำงานมากกว่าจะเรียกว่าเป็น framework ซึ่งคุณสามารถเริ่มต้นใช้ Flux ได้เลยโดยไม่ต้องเขียนโค้ดเพิ่มมากนัก

<figure class="video-container disassociated-with-next-sibling">
  <iframe src="//www.youtube.com/embed/nYkdrAPrdcw?list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v&start=621" frameborder="0" allowfullscreen></iframe>
</figure>

Flux applications ประกอบไปด้วย 3 ส่วนหลัก: Dispatcher, Stores และ Views (React components) ซึ่งแตกต่างจากรูปแบบ Model-View-Controller  โดยที่ใน Flux ก็มี Controllers เหมือนกันแต่เป็น controller-views — ซึ่งเป็น views ที่มักจะอยู่ชั้นบนสุดของระดับชั้น (hierarchy) ทำหน้าที่ดึงข้อมูลจาก Stores และส่งข้อมูลเหล่านี้ลงไปยังลูกที่อยู่ชั้นล่างลงไป  นอกจากนั้นยังมี Action Creators ที่เป็น helper methods ของ Dispatcher ที่มีชื่อเรียก method ที่เข้าใจง่ายและสื่อถึงการใช้งาน ซึ่งใช้บอกสิ่งที่สามารถเปลี่ยนแปลงได้ทั้งหมดในแอพพลิเคชั่น  เปรียบ Action Creators ได้กับส่วนที่ 4 ในวัฏจักรของ Flux

ไอเดียของ Flux แตกต่างจาก MVC ตรงที่ข้อมูลเดินทางในทิศทางเดียว  นั่นคือเมื่อ user ทำอะไรบางอย่างกับ React view, View นั้นจะส่งต่อ Action ผ่านตัวกลางคือ Dispatcher, ไปยัง Stores ทั้งหลายที่เก็บข้อมูลและ business logic ของแอพพลิเคชั่นเพื่อประมวลผล, จากนั้นจะทำการอัพเดท View ทั้งหมดที่เกี่ยวข้อง และจบวัฏจักรการอัพเดท ซึ่งวัฏจักรแบบนี้เองที่ทำงานเข้าขากันกับสไตล์การเขียนโค้ดแบบ Declarative ของ React view ที่อนุญาตให้ Store สามารถส่งข้อมูลอัพเดทต่างๆ โดยที่ไม่ต้องระบุว่า views นั้นจะต้องเปลี่ยนแปลงอย่างไร

ในตอนแรก เราพยายามหาวิธีจัดการกับข้อมูลที่เกี่ยวเนื่อง (derived data) เช่น เราต้องการแสดงตัวเลขที่บอกจำนวนข้อความที่ยังไม่ได้อ่าน (Unread count) ของแต่ละกระทู้  (Thread) โดยที่มี View อีกตัวแสดงกระทู้ทั้งหมดโดยที่มีไฮไลท์สำหรับกระทู้ที่ยังไม่ได้อ่าน ใน MVC ทั่วไปสิ่งนี้ถือว่ายาก — เพราะว่าเมื่อมีการอ่านเกิดขึ้น เราต้องอัพเดท Thread model จากนั้นเรายังต้องอัพเดท Unread count model อีกด้วย การเปลี่ยนแปลงที่ขึ้นอยู่กับส่วนอื่นๆ ในแอพพลิเคชั่น (dependencies) และการอัพเดทต่อกันไปเป็นทอดๆ (cascading updates) แบบนี้เกิดขึ้นตลอดเวลาในแอพพลิเคชั่น MVC ใหญ่ๆ ซึ่งทำให้การเดินทางของข้อมูลพันยุ่งเหยิงไม่เป็นระเบียบ ก่อให้เกิดผลลัพธ์ที่คาดเดายาก

Stores ใน Flux ทำงานตรงกันข้าม นั่นคือ Stores รับข้อมูลอัพเดทและประมวลผลข้อมูลนั้นตามความเหมาะสม แทนที่จะให้ส่วนอื่นในแอพพลิเคชั่นอัพเดทข้อมูลของตัวเอง  ภายนอก Store จะไม่รู้เลยว่า Store จัดการกับข้อมูลของตัวเองอย่างไร เป็นการช่วยแบ่งแยกหน้าที่ในแอพพลิเคชั่นได้ชัดเจน  ซึ่ง Stores ไม่มี setter methods ตรงๆ เช่น `setAsRead()` แต่มีวิธีการรับข้อมูลเข้ามาใน Store เพียงวิธีเดียวเท่านั้น คือ ผ่านทาง callback ที่ตัวเองลงทะเบียนไว้กับ Dispatcher


## Structure และ Data Flow

<p class="associated-with-next-sibling">
ข้อมูลใน Flux เดินทางในทิศทางเดียวเท่านั้น:
</p>

<figure class="diagram associated-with-next-sibling">
  <img src="/flux/img/flux-simple-f8-diagram-1300w.png" alt="unidirectional data flow in Flux" />
</figure>

การเดินทางของข้อมูลทางเดียวเป็นหัวใจหลักของ Flux โดยที่ภาพ Diagram ด้านบนควรเป็น __แผนภาพในใจของโปรแกรมเมอร์ Flux__ ซึ่ง Dispatcher, Stores และ ​Views เป็นหน่วยที่อิสระต่อกัน โดยแต่ละหน่วยมี inputs และ outputs ที่แตกต่างกันเฉพาะตัว และมี Actions เป็น objects ง่ายๆ ที่ประกอบด้วยข้อมูลและ_ประเภท_ของข้อมูลเท่านั้น

<p class="associated-with-next-sibling">
Views ก็สามารถก่อให้เกิด action ใหม่ในระบบได้จาก interaction ของ user:
</p>

<figure class="diagram">
  <img src="/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png" alt="data flow in Flux with data originating from user interactions" />
</figure>

<p class="associated-with-next-sibling">
ข้อมูลทั้งหมดเดินทางผ่าน Dispatcher ซึ่งถือว่าเป็นศูนย์กลาง โดยที่ Actions ที่ส่งให้ Dispatcher ถูกสร้างจาก method ที่เรียกว่า <em>action creator</em>, ซึ่งส่วนใหญ่แล้วเกิดมาจาก interactions ของ user ที่ Views  จากนั้น Dispatcher ทำการเรียก callbacks ที่ Stores ได้ลงทะเบียนไว้ก่อนหน้า ซึ่งทำให้เกิดการส่งต่อ (dispatch) actions ไปยัง Stores ทั้งหมดทุกตัว ซึ่งใน callbacks นี้เองที่ Stores ทำการประมวลผลและตอบสนองกับ actions ที่เกี่ยวข้องกับข้อมูล (state) ที่ตัวเองจัดการอยู่  เมื่อประมวลผลเสร็จเรียบร้อย Stores จะยิง <em>change</em> event เพื่อบอก controller-views ว่าข้อมูลได้มีการเปลี่ยนแปลงเกิดขึ้น  Controller-views จะคอยฟัง events เหล่านี้และทำการเรียกข้อมูลจาก Stores ใน event handler สุดท้าย Controller-views จะสั่งคำสั่งที่ชื่อว่า <code>setState()</code> ของตัวเอง ซึ่งส่งผลให้ตัวเองและลูกๆ ในชั้นล่างลงไปของระดับชั้นเกิดการเรนเดอร์ใหม่อีกครั้ง
</p>

<figure class="diagram">
  <img src="/flux/img/flux-simple-f8-diagram-explained-1300w.png" alt="varying transports between each step of the Flux data flow" />
</figure>

โครงสร้างการทำงานแบบนี้ช่วยให้เข้าใจแอพพลิเคชั่นของเราได้ง่ายขึ้น คล้ายกับ _functional reactive programming_, หรือใกล้เคียงกับ _data-flow programming_ หรือ _flow-based programming_ ที่ข้อมูลในแอพพลิเคชั่นเดินทางในทิศทางเดียว — ไม่มีการเชื่อมของข้อมูลแบบ 2 ทาง หรือที่เรียกว่า two-way bindings  เพราะข้อมูลของแอพพลิเคชั่น (Application state) ถูกจัดการอยู่ใน Stores เท่านั้น ทำให้ส่วนอื่นๆ ของแอพพลิเคชั่นเป็นอิสระต่อกัน อย่างไรก็ตามการเปลี่ยนแปลงของข้อมูลใน Stores หนึ่งก็อาจขึ้นอยู่กับ Stores อื่นๆ ได้ (dependencies) แต่ก็ถูกจัดการอยู่ในระดับชั้นที่เป็นระเบียบและเคร่งครัด ด้วยการอัพเดทแบบ synchronous ของ Dispatcher

เราพบว่า two-way bindings ก่อให้เกิดการอัพเดทแบบที่ต่อกันไปเป็นทอดๆ โดยที่เมื่อ object หนึ่งมีเปลี่ยนแปลงจะก่อให้เกิดการเปลี่ยนแปลงของอีก object หนึ่ง ซึ่งอาจจะก่อให้เกิดการอัพเดทต่อไปอีก เมื่อแอพพลิเคชั่นใหญ่ขึ้น การอัพเดทต่อกันเป็นทอดๆ แบบนี้ทำให้ยากที่จะคาดเดาว่าจะมีอะไรเปลี่ยนบ้างเมื่อเกิด interaction ของ user ขึ้น แต่เมื่อข้อมูลมีการเปลี่ยนแปลงจากการอัพเดทในรอบเดียว ระบบทั้งระบบก็ง่ายต่อการคาดเดามากขึ้น

ลองดูส่วนประกอบต่างๆ ของ Flux อย่างละเอียดมากขึ้นอีกหน่อยดีกว่า เริ่มต้นที่ Dispatcher


### Dispatcher เพียงหนึ่งเดียว

Dispatcher เป็นศูนย์กลางที่จัดการการเดินทางของข้อมูลใน Flux ทั้งหมด Dispatcher คือสำนักทะเบียนที่เก็บ callbacks ของ Stores เท่านั้นและไม่ได้มีความสามารถพิเศษอะไรมาก — เป็นเพียงกลไกง่ายๆ ในการกระจาย actions ไปให้ stores เท่านั้น โดย Store แต่ละตัวทำการลงทะเบียนตัวเองและยื่น callback ให้ Dispatcher เก็บไว้ เมื่อ Action Creator ส่ง action มาให้ Dispatcher, Stores ทุกตัวในแอพพลิเคชั่นก็จะได้รับ action จาก callback ที่ได้ลงทะเบียนไว้

เมื่อแอพพลิเคชั่นมีขนาดใหญ่ขึ้น Dispatcher ก็ยิ่งมีความสำคัญมากขึ้น เพราะว่าเราสามารถจัดการกับ dependencies ระหว่าง Stores ได้ด้วยการเรียก callbacks ต่างๆ ตามลำดับความสัมพันธ์ของ Stores ส่งผลให้ Stores สามารถแสดงตนว่าต้องรอให้ Stores อื่นอัพเดทเสร็จก่อนจึงจะอัพเดทตัวเองได้ตามลำดับ

Dispatcher ที่ Facebook ใช้ใน production มีให้ใช้ได้ผ่านทาง [npm](https://www.npmjs.com/package/flux), [Bower](http://bower.io/), หรือ [GitHub](https://github.com/facebook/flux).


### Stores

Stores ประกอบไปด้วยข้อมูลแอพพลิเคชั่น (application state) และ logic ต่างๆ โดยที่บทบาทของ Store คล้ายกันกับ model ใน MVC ทั่วไป แตกต่างตรงที่ Store บริหารจัดการ state ของ object ได้หลายตัว — Store ไม่เหมือนกับ ORM models ที่เปรียบเสมือนตัวแทนของ record สำหรับข้อมูลชนิดหนึ่งชนิดใด และ Store ก็ไม่เหมือนกับ collections ใน Backbone ด้วย ซึ่ง Stores ไม่ได้จัดการ collection ของ object สไตล์ ORM เท่านั้นแต่ยังบริหารจัดการ application state สำหรับ __domain__ ในแอพพลิเคชั่นอีกด้วย

ตัวอย่างเช่น [Lookback Video Editor](https://facebook.com/lookback/edit) ของ Facebook ที่มี TimeStore เพื่อคอยเก็บข้อมูลตำแหน่งเวลาของตัวเล่นวีดิโอและ state ของการเล่นวีดิโอ และยังมี ImageStore ที่คอยจัดการรูปภาพทั้งหมดในแอพพลิเคชั่น  นอกจากนั้น TodoStore ใน [ตัวอย่าง TodoMVC](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) ก็ทำหน้าที่บริหารจัดการ to-do items ทั้งหมด  Store จึงมีคุณลักษณะเป็นได้ทั้ง collection ของ models และ singleton model ของ domain นั้นๆ

จากที่กล่าวไว้ข้างต้น Store ทำการลงทะเบียนตัวเองพร้อมทั้งยื่น callback ให้ไว้กับ Dispatcher  ซึ่ง callback นี้เองที่รับ Action เป็นพารามิเตอร์ โดยที่การทำงานข้างใน callback นี้จะมีคำสั่ง switch ที่ใช้กำหนดการทำงานของ Store ด้วยคำสั่งภายในที่เกี่ยวข้องจากประเภทของ action ที่รับมา  จึงกล่าวได้ว่า Action ทำให้เกิดการเปลี่ยนแปลงของ state ใน store ผ่าน Dispatcher  และหลังจาก Stores มีการอัพเดทข้อมูลภายในเรียบร้อย จะทำการยิง event ประกาศว่า state ของตัวเองมีการเปลี่ยนแปลง เพื่อที่ views สามารถดึงข้อมูลใหม่ไปอัพเดทตัวเองได้ต่อไป


### Views และ Controller-Views

React เป็น view ที่มีความสามารถในการประกอบ ผสม และแสดงผลใหม่ (re-renderable) ซึ่งตรงกับความต้องการของเราใน Flux  โดยที่ชั้นบนๆในระดับชั้นของ views จะมี view ชนิดพิเศษที่คอยฟัง event ที่ประกาศมาจาก Stores ที่ตัวเองสนใจอยู่ เราเรียกมันว่า controller-view ทำหน้าที่เป็นตัวเชื่อมต่อ คอยเรียกข้อมูลจาก Stores และส่งข้อมูลนี้ผ่านลงไปยังลูกๆ ในชั้นล่าง ดังนั้นเราสามารถมี controller-views ลักษณะนี้อยู่ในส่วนสำคัญต่างๆ ในแต่ละหน้าได้

เมื่อได้รับ event จาก Store มันจะทำการเรียกหาข้อมูลใหม่ที่ต้องใช้ผ่านทางคำสั่ง getter ของ Stores จากนั้นมันจะเรียกคำสั่ง `setState()` หรือ `forceUpdate()` ซึ่งก่อให้เกิดการรันคำสั่ง `render()` ของตัวเองและลูกๆ ในระดับชั้นล่างๆ ลงไปโดยอัตโนมัติ

โดยปกติเราจะส่งค่า state จาก store ทั้งหมดลงไปยังลูกๆ ของ views ด้วยการใส่ลงไปใน object เพียง 1 ตัว สะดวกกับลูกแต่ละตัวเลือกข้อมูลเฉพาะที่ตัวเองต้องการใช้ได้  นอกจากการวาง controller-views ที่มีคุณสมบัติคล้ายกับ controller ไว้ที่ชั้นบนๆ และทำให้ลูกๆ ด้านล่างลงไป pure แล้ว การส่งค่า state ของ store ทั้งหมดลงไปใน object เพียง 1 ตัวนั้นยังช่วยลดจำนวนของ props ที่ต้องคอยบริหารจัดการอีกด้วย

อย่างไรก็ตาม บางครั้งเราอาจต้องเพิ่ม controller-views ที่อยู่ล่างลงไปในระดับชั้นเพื่อทำให้ components ไม่ซับซ้อนเกินไป ซึ่งอาจจะช่วยให้เราจัดกลุ่มระดับชั้นให้แยกเป็นสัดส่วนตามข้อมูลเฉพาะได้ดีขึ้น  แต่อย่างไรก็ตามเราต้องคอยระวัง ไม่ฝ่าฝืนการเดินทางของข้อมูลทางเดียวเพราะมีจุดตั้งต้นของข้อมูลจุดใหม่ที่ขัดกับทิศทางของข้อมูลเดิม  ดังนั้นก่อนตัดสินใจว่าจะเพิ่ม controller-views ในชั้นล่างลงไป เราจำเป็นต้องพิจารณาผลดีที่ทำให้ components ง่ายขึ้นคู่กับผลเสียที่เป็นความซับซ้อนจากการเดินทางของข้อมูลที่เปลี่ยนแปลงจากจุดต่างๆ ในระดับชั้น  ผลเสียนี้อาจก่อให้เกิดผลกระทบแปลกๆ เช่น method render ของ React ถูกเรียกใช้ซ้ำๆ กันเพราะมีการเปลี่ยนแปลงของข้อมูลจาก controller-views จากจุดต่างๆ สุดท้ายส่งผลให้การ debug ยากขึ้นมาก


### Actions

Dispatcher มีคำสั่งที่ให้เราส่งข้อมูลไปยัง Stores ที่เราเรียกว่า Action  การสร้าง Action อาจทำได้ด้วย helper method ที่มีชื่อที่เข้าใจง่ายซึ่งทำหน้าที่ส่ง action ให้กับ Dispatcher เช่น ถ้าเราต้องการแก้ไขข้อความของ to-do item ใน to-do แอพพลิเคชั่น เราอาจสร้าง Action ได้ด้วยฟังก์ชั่น `updateText(todoId, newText)` ในโมดูล `TodoActions` ซึ่ง method นี้อาจถูกเรียกมาจาก event handler ใน views ของเราเพื่อตอบสนองต่อ interaction ของ user  นอกจากนั้น method ที่สร้าง action นี้ยังมีการเพิ่มข้อมูล _type_ หรือประเภทให้กับ action ด้วย เพื่อให้ Stores ประมวล action นี้ได้ถูกต้อง จากตัวอย่างของเรา type ของ action นี้อาจจะชื่อว่า `TODO_UPDATE_TEXT`

Actions อาจถูกส่งมาจากที่อื่นด้วย เช่น จาก server ซึ่งเกิดขึ้นในช่วงเริ่มต้น initialize ข้อมูล หรืออาจจะตอนที่เกิด error ขึ้นที่ server หรือเมื่อเวลาที่ server ส่งอัพเดทมาให้กับแอพพลิเคชั่น


### What About that Dispatcher?

จากที่กล่าวไว้ในช่วงแรกว่า Dispatcher สามารถจัดการ dependencies ระหว่าง Stores ได้ ซึ่งความสามารถนี้อยู่ในคำสั่ง `waitFor()` ของคลาส Dispatcher ซึ่งจากตัวอย่างง่ายๆใน [แอพ TodoMVC](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) เรายังไม่จำเป็นต้องใช้คำสั่งนี้ แต่กับแอพพลิเคชั่นที่ใหญ่และซับซ้อนกว่านี้ คำสั่งนี้จะมีความสำคัญมาก

ใน callback ของ TodoStore เราสามารถประกาศให้รอ Stores อื่นอัพเดทให้เสร็จก่อนแล้วค่อยทำงานต่อได้:

```javascript
case 'TODO_CREATE':
  Dispatcher.waitFor([
    PrependedTextStore.dispatchToken,
    YetAnotherStore.dispatchToken
  ]);

  TodoStore.create(PrependedTextStore.getText() + ' ' + action.text);
  break;
```

`waitFor()` รับ array 1 ตัวเท่านั้นซึ่งประกอบไปด้วยเลขทะเบียนของ Store ที่เก็บอยู่ใน Dispatcher เรียกว่า _dispatch tokens_ ดังนั้น Store ที่เรียกใช้คำสั่ง `waitFor()` สามารถรอให้ store อื่นจัดการ state ของตัวเองให้เสร็จก่อนแล้วจึงค่อยอัพเดท state ของตัวเอง

Dispatch token ได้มาจากการเรียกใช้คำสั่ง `register()` เมื่อต้องการลงทะเบียน callback ไว้กับ Dispatcher:

```javascript
PrependedTextStore.dispatchToken = Dispatcher.register(function (payload) {
  // ...
});
```

อ่านรายละเอียดเพิ่มเติมที่เกี่ยวกับ `waitFor()`, actions, action creators และ dispatcher ได้ที่ [Flux: Actions และ the Dispatcher](http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html).
