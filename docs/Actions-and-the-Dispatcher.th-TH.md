---
id: actions-and-the-dispatcher-th-TH
title: Actions และ Dispatcher
layout: docs
category: Guides
permalink: docs/actions-and-the-dispatcher-th-TH.html
next: testing-flux-applications-th-TH
lang: th-TH
---

บทความนี้ดั้งเดิมถูกเขียนไว้เป็น [post](http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html) ที่ [React blog](http://facebook.github.io/react/blog/) และได้ถูกแก้ไขเรียบเรียงและอัพเดทไว้ใหม่ที่นี่


Dispatcher
--------------

Dispatcher มีเพียงหนึ่งเดียว (singleton) และทำงานเป็นเหมือนศูนย์กลางการเดินทางของข้อมูลทั้งหมดในแอพ Flux โดยที่ Dispatcher คือสำนักทะเบียนที่เก็บ callbacks ของ Stores เอาไว้ และสามารถเรียก callbacks เหล่านี้ได้ในลำดับที่ต้องการ _Store_ แต่ละตัวลงทะเบียน callback ไว้กับ dispatcher เมื่อมีข้อมูลใหม่เดินทางเข้ามาใน dispatcher มันจะใช้ callbacks เหล่านี้เพื่อกระจายข้อมูลนั้นไปยัง Stores ทุกๆ ตัว ซึ่งขั้นตอนของการเรียก callbacks เหล่านี้ถูกเริ่มต้นขึ้นจากคำสั่ง dispatch() ซึ่งรับข้อมูล payload เป็นเพียง argument เป็นหนึ่งเดียวเท่านั้น โดยทีปกติแล้ว่ข้อมูล payload นีสอดคล้องกับ _action_.

<figure class="diagram">
  <img src="/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png" alt="data flow in Flux with data originating from user interactions" width=650 />
</figure>


Actions และ Action Creators
---------------------------

เมื่อมีข้อมูลใหม่เข้ามาในระบบ ไม่ว่าจะมาจาก interaction ของ user หรือจาก web api ที่เรียก ข้อมูลนั้นจะถูกทำให้เป็น _action_ — ซึ่งเป็นเพียง object ที่มีเพียง field ข้อมูลและประเภทของข้อมูลนั้น โดยที่ส่วนใหญ่แล้วเรามักจะสร้างชุดของคำสั่ง helper ที่เรียกว่า _action creators_ ที่ทำหน้าที่ทั้งสร้าง action object และยังส่งต่อ action นั้นไปยัง dispatcher อีกด้วย

Action ที่แตกต่างกันจะมีประเภทของ action (type) ที่แตกต่างกัน ซึ่งเมื่อ Store รับค่า action เข้ามา มันจะตรวจสอบประเภทว่า action นี้เป็นประเภทใด และประมวลผลข้อมูลแยกตาม type ของ action ในแอพ Flux ทั้ง Stores และ Views ควบคุมตัวเองเป็นอิสระ โดยที่ object อื่นภายนอกไม่สามารถเข้ามายุ่งได้ Actions จะถูกส่งต่อเข้ามายัง Stores ด้วยวิธีการเรียกผ่าน callbacks ที่มันลงทะเบียนเอาไว้ก่อนหน้า ไม่ใช่โดย setter methods

การที่ Stores อัพเดทตัวเองแบบนี้ช่วยป้องกันไม่ให้เกิดความซับซ้อนยุ่งเหยิงแบบที่เกิดขึ้นในระบบแบบ MVC ทั่วไปที่การอัพเดทแบบต่อเนื่องเป็นทอดๆ ระหว่าง models ส่งผลให้เกิดความไม่แน่นอนของ state ซึ่งทำให้เทสยากมากขึ้น Objects ต่างๆ ในแอพ Flux เป็น objects ที่มักจะเป็นอิสระต่อกัน และยึดหลัก [Law of Demeter](http://en.wikipedia.org/wiki/Law_of_Demeter) ซึ่งบอกไว้ว่า Object แต่ละตัวภายในระบบหนึ่งๆ ควรจะรู้จักกันให้น้อยที่สุดเท่าที่จะเป็นไปได้ ซึ่งส่งผลให้ software ง่ายต่อการจัดการ บำรุงรักษา ปรับปรุงเปลี่ยนแปลงได้ง่าย อีกทั้งยังเทสได้ง่าย ส่งผลให้สมาชิกใหม่ในทีมเข้าใจระบบง่ายขึ้นด้วย


เหตุผลที่เราต้องใช้ Dispatcher
------------------------

เมื่อแอพมีขนาดใหญ่ขึ้น จะเกิดเหตุการณ์ที่ Stores เริ่มทำงานโดยขึ้นอยู่กับ stores อื่นๆ (dependencies) เช่น Store A จำเป็นต้องรอให้ Store B อัพเดทตัวเองให้เสร็จก่อน เพื่อที่ Store A จะได้รู้ว่าจะอัพเดทตัวเองต่ออย่างไร ดังนั้น Dispatcher จำเป็นต้องสามารถเรียก callback ไปหา Store B และทำงานใน callback นั้นให้เสร็จเรียบร้อยก่อน Store A จึงจะทำงานต่อได้ การที่จะประกันว่าเราต้องการ dependencies แบบนี้ Store ต้องสามารถบอกกับ dispatcher ได้ว่า "ฉันจำเป็นต้องรอ Store B ก่อนที่จะประมวลผล action นี้ให้เสร็จ" ซึ่ง Dispatcher ให้ความสามารถนี้กับเราผ่านคำสั่ง waitFor()

คำสั่ง dispatch() เป็นกลไกการวนลูปง่ายๆ โดยวนลูปและเรียกใช้ callbacks ทั้งหมด เมื่อไหร่ก็ตามที่เจอคำสั่ง waitFor() ใน callback การทำงานของ callback นั้นจะหยุดค้างไว้ก่อน และคำสั่ง waitFor() จะทำหน้าที่เริ่มต้นลูปใหม่กับ stores ตัวอื่นที่เป็น dependencies และจะกลับมาทำงานต่อจากจุดที่หยุดค้างไว้ก็ต่อเมื่อทำงานในลูปของ dependencies สำเร็จ

ไม่เพียงแค่นั้น เรายังสามารถใช้คำสั่ง waitFor() ได้กับหลาย actions ใน callback ของ Store เดียวกัน ในสถานการณ์หนึ่ง Store A อาจต้องรอ Store B ขณะที่อีกสถานการณ์หนึ่ง ต้องรอ Store C ดังนั้นการใช้ waitFor() ใน action ที่แตกต่างกันส่งผลให้เราสามารถควบคุมจัดการ dependencies ได้อย่างละเอียด

ปัญหาหนึ่งที่เกิดขึ้นได้คือ circular dependencies นั่นคือ เมื่อ Store A รอ Store B และ Store B ก็รอ Store A กลายเป็นลูปที่ไม่มีวันจบ ซึ่งโค้ด Dispatcher ตอนนี้ใน Flux repo ป้องกันปัญหานี้โดยการแจ้งข้อความ Error เพื่อบอก developer เมื่อเกิดปัญหานี้ขึ้น ซึ่ง developer สามารถสร้าง Store ที่สามเพื่อแก้ปัญหา circular dependency นี้ได้
