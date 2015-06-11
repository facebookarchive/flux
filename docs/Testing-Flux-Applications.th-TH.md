---
id: testing-flux-applications-th-TH
title: เทส Flux Applications
layout: docs
category: Guides
permalink: docs/testing-flux-applications-th-TH.html
next: dispatcher-th-TH
---

บทความนี้ดั้งเดิมถูกเขียนไว้เป็น [post](http://facebook.github.io/react/blog/2014/09/24/testing-flux-applications.html) ที่ [React blog](http://facebook.github.io/react/blog/) และได้ถูกแก้ไขเรียบเรียงและอัพเดทไว้ใหม่ที่นี่

ในบทความก่อนหน้า เราได้เล่าถึง [ภาพรวมโครงสร้างพื้นฐานและการเดินทางของข้อมูล](http://facebook.github.io/flux/docs/overview.html) อธิบาย [dispatcher และ action creators](http://facebook.github.io/flux/docs/actions-and-the-dispatcher.html) อย่างละเอียดมากขึ้น และแสดงให้เห็นว่านำแต่ละส่วนมาใช้ร่วมกันอย่างไรใน [tutorial](http://facebook.github.io/flux/docs/todo-list.html) ตอนนี้ลองมาดูกันว่าเราจะทำ unit testing แอพ Flux อย่างไรด้วย [Jest](http://facebook.github.io/jest/) ซึ่งเป็น framework สำหรับ auto-mocking testing ของ Facebook


เริ่มต้นเทสด้วย Jest
-----------------

การทำ unit test ที่สามารถแยกส่วนแอพเป็น _unit_ ได้จริงๆ เราต้องสามารถจำลอง (mock) โมดูลอื่นๆ ทุกตัวยกเว้นตัวที่เราต้องการจะเทสได้ Jest ช่วยทำให้การ mock ส่วนต่างๆ ของ Flux ง่ายมากๆ เพื่อสาธิตการเทสด้วย Jest เราจะทำต่อจาก [ตัวอย่างแอพ TodoMVC](https://github.com/facebook/flux/tree/master/examples/flux-todomvc)

ขั้นตอนแรกๆ ที่เราต้องทำเป็นดังนี้:

1. ติดตั้งโมดูลที่แอพต้องใช้โดยการรัน `npm install`.
2. สร้างไดเรคทอรี่ชื่อ `__tests__/` เพื่อเก็บไฟล์เทส ในที่นี้ไฟล์ชื่อ TodoStore-test.js
3. รัน `npm install jest-cli -—save-dev`
4. เพิ่มโค้ดด้านล่างนี้ในไฟล์ package.json ของคุณ

```javascript
{
  ...
  "scripts": {
    "test": "jest"
  }
  ...
}
```

ถึงตรงนี้คุณพร้อมที่จะรันเทสจาก command line ด้วยคำสั่ง `npm test` แล้ว

โดยปกติ โมดูลทุกตัวจะถูก mock ดังนั้นโค้ดตั้งต้นที่เราต้องใช้ในไฟล์ TodoStore-test.js คือคำสั่ง `dontMock()` ของ Jest

```javascript
jest.dontMock('TodoStore');
```

โค้ดนี้สั่ง Jest ว่าให้ TodoStore เป็น object จริงที่มีคำสั่งของตัวเองจริงๆ ในขณะที่ Jest จะ mock object อื่นทุกตัวที่เกี่ยวข้องกับเทสนี้


เทส Stores
--------------

ที่ Facebook เราเทส Flux stores กันอย่างละเอียดเนื่องจากเป็นที่ที่เก็บ state และ logic ต่างๆ ของแอพ Stores จึงเรียกได้ว่าเป็นที่ที่สำคัญที่สุดในแอพ Flux ที่ต้องเทสอย่างละเอียด แต่วิธีการเทส Stores อาจจะไม่ค่อยชัดเจนเมื่อมองเผินๆ

Stores ถูกออกแบบมาไม่ให้ภายนอกเข้ามาแก้ไขเปลี่ยนแปลงได้ ไม่มี setters วิธีเดียวที่ Store ปล่อยให้ข้อมูลเข้ามาภายในคือผ่าน callback ที่ได้ลงทะเบียนเอาไว้กับ dispatcher

ดังนั้นเราจึงจำเป็นต้องจำลองการเดินทางของข้อมูลของ Flux ด้วย _เทคนิคแปลกๆ ดังนี้_.

```javascript
var mockRegister = MyDispatcher.register;
var mockRegisterInfo = mockRegister.mock;
var callsToRegister = mockRegisterInfo.calls;
var firstCall = callsToRegister[0];
var firstArgument = firstCall[0];
var callback = firstArgument;
```

ถึงตรงนี้เราได้ callback ของ store มาเรียบร้อยแล้ว ซึ่ง callback นี้เองที่เป็นเพียงวิธีเดียวที่ข้อมูลเดินทางเข้าไปยัง Store

สำหรับคนที่ยังใหม่กับ Jest หรือการจำลอง (mock) โดยทั่วๆ ไป โค้ดด้านบนอาจจะยังไม่ชัดเจนว่าทำงานอย่างไร ดังนั้นเรามาลองไล่ดูแต่ละส่วนกัน เริ่มต้นด้วยคำสั่ง `register()` ของ dispatcher ในแอพของเรากันก่อนซึ่งเป็นคำสั่งที่ store ใช้ลงทะเบียน callback เอาไว้กับ dispatcher เนื่องจาก Jest จะทำการ mock ตัว dispatcher ของเราโดยอัตโนมัติ ดังนั้นเราจึงได้คำสั่ง `register()` เวอร์ชั่นจำลองมาโดยปริยายเหมือนกับคำสั่งเวอร์ชันจริงที่เราได้จากโค้ดจริงๆ ใน production เพียงแต่เรายังสามารถเข้าถึงข้อมูลอื่นๆ เพิ่มเติมเกี่ยวกับคำสั่งนั้นด้วย _property_ ที่ชื่อว่า `mock` ของคำสั่งนั้นๆ โดยปกติแล้วเรามักจะไม่ได้คิดว่าคำสั่ง (method) จะมี property แต่ใน Jest ความคิดนี้ถือว่าสำคัญมาก เพราะทุกคำสั่งของ object ที่เราจำลองจะมี property ตัวนี้ซึ่งประกอบไปด้วยข้อมูลที่บอกเราว่าคำสั่งนี้ถูกเรียกใช้อย่างไรระหว่างการเทส จากตัวอย่าง property ชื่อ `calls` ของ `mock` ประกอบไปด้วยข้อมูลการเรียกใช้งานคำสั่ง `register()` ตามลำดับเวลา ซึ่งในข้อมูลนี้จะมีข้อมูล arguments ที่ถูกใช้เรียกอยู่ด้วย

ดังนั้นโค้ดของเราแปลได้ว่า "ส่ง argument ตัวแรกของคำสั่ง `register()` ของ MyDispatcher ที่ถูกเรียกใช้ครั้งแรกให้หน่อย" ซึ่ง argument ตัวแรกที่ว่านี้คือ callback ของ store นั่นเอง จากตรงนี้เรามีทุกอย่างที่เราต้องการใช้เทสแล้ว แต่ก่อนอื่นเราสามารถลดการใช้เครื่องหมาย semicolons แล้วย่อโค้ดให้เหลือเพียง 1 บรรทัดได้ดังนี้:

```javascript
callback = MyDispatcher.register.mock.calls[0][0];
```

จากนี้เราสามารถเรียกใช้ callback นี้เมื่อไหร่ก็ได้ โดยที่ไม่ต้องยุ่งเกี่ยวกับ dispatcher ของแอพหรือ action creators เลย จริงๆ แล้วเราตั้งใจจะจำลองพฤติกรรมของ dispatcher และ action creators ด้วยการเรียกใช้ callback นี้ด้วย action ที่เราจะสร้างขึ้นมาเองในเทสของเรานั่นแหล่ะ

```javascript
var action = {
  actionType: TodoConstants.TODO_CREATE,
  text: 'foo'
};
callback(action);
var all = TodoStore.getAll();
var keys = Object.keys(all);
expect(all[keys[0]].text).toEqual('foo');
```

รวมทุกอย่างเข้าด้วยกัน
----------------------

ในโค้ดตัวอย่างแอพ Flux TodoMVC มีตัวอย่างเทสสำหรับ TodoStore อยู่แล้ว แต่เรามาดูโค้ดฉบับย่อที่ใช้เทสกันดีกว่า ในเทสนี้สิ่งที่น่าสนใจที่สุดคือการที่เราเก็บ reference ของ callback ไว้ใน closure ของเทส และการที่เราสร้าง store ขึ้นใหม่ทุกครั้งก่อนที่จะรันเทสแต่ละส่วนเพื่อล้าง state ของ store ให้หมดก่อน

```javascript
jest.dontMock('../TodoStore');
jest.dontMock('object-assign');

describe('TodoStore', function() {

  var TodoConstants = require('../../constants/TodoConstants');
  var AppDispatcher;
  var TodoStore;
  var callback;

  // จำลอง actions
  var actionTodoCreate = {
    actionType: TodoConstants.TODO_CREATE,
    text: 'foo'
  };
  var actionTodoDestroy = {
    actionType: TodoConstants.TODO_DESTROY,
    id: 'replace me in test'
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    TodoStore = require('../TodoStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no to-do items', function() {
    var all = TodoStore.getAll();
    expect(all).toEqual({});
  });

  it('creates a to-do item', function() {
    callback(actionTodoCreate);
    var all = TodoStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    expect(all[keys[0]].text).toEqual('foo');
  });

  it('destroys a to-do item', function() {
    callback(actionTodoCreate);
    var all = TodoStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    actionTodoDestroy.id = keys[0];
    callback(actionTodoDestroy);
    expect(all[keys[0]]).toBeUndefined();
  });

});
```

คุณสามารถดูโค้ดทั้งหมดนี้ได้ใน [โค้ดเทส TodoStore ที่ GitHub](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/js/stores/__tests__/TodoStore-test.js)


จำลองข้อมูลที่มาจาก Stores ตัวอื่น
--------------------------------------

ในบางครั้ง Stores ของเราจำเป็นต้องอาศัยข้อมูลจาก Stores อื่นๆ เนื่องจากโมดูลทุกตัวของเราถูก mock อยู่แล้ว เราจึงจำเป็นต้องจำลองข้อมูลพวกนั้นที่มาจาก store ตัวอื่น ซึ่งทำได้โดยการเรียกใช้ฟังก์ชันจำลองแล้วใส่ข้อมูลที่ต้องการลงไป

```javascript
var MyOtherStore = require('../MyOtherStore');
MyOtherStore.getState.mockReturnValue({
  '123': {
    id: '123',
    text: 'foo'
  },
  '456': {
    id: '456',
    text: 'bar'
  }
});
```

ตอนนี้เรามีข้อมูลจำลองที่จะได้จาก MyOtherStore เมื่อไหร่ก็ตามที่เราเรียกใช้คำสั่ง MyOtherStore.getState() ในเทสแล้ว จริงๆ แล้ว state ของแอพพลิเคชั่นสามารถถูกจำลองได้ด้วยการใช้เทคนิคนี้ร่วมกับเทคนิคก่อนหน้าที่จำลอง callback ของ store

ตัวอย่างสั้นๆ ของเทคนิคนี้อยู่บน GitHub ในตัวอย่างแอพ Flux Chat ไฟล์ [UnreadThreadStore-test.js](https://github.com/facebook/flux/tree/master/examples/flux-chat/js/stores/__tests__/UnreadThreadStore-test.js)

เข้าไปอ่านข้อมูลเพิ่มเติมเกี่ยวกับ property `mock` ของคำสั่งจำลอง หรือ ความสามารถของ Jest ในการจำลองข้อมูลได้ที่ documentation หัวข้อ [mock functions](http://facebook.github.io/jest/docs/mock-functions.html)


ย้าย Logic จาก React ไปไว้ที่ Stores
---------------------------------

ปกติแล้ว logic นิดหน่อยที่เราเพิ่มเข้าไปใน React components มักจะก่อให้เกิดปัญหาตอนเราเขียนเทส unit test เนื่องจากเราต้องการเขียนเทสที่เป็นเหมือนตัวแทน spec บรรยายความสามารถแอพของเรา แต่เมื่อ logic ของแอพไปอยู่ที่ view ปัญหาจึงเริ่มเกิดขึ้น

ตัวอย่างเช่น เมื่อ user ติ๊ก to-do items ทุกอันว่า complete เอกสารของ TodoMVC ระบุไว้ว่าเราควรจะเปลี่ยนสถานะของ checkbox  "Mark all as complete" โดยอัตโนมัติเพื่อสื่อว่า item ทุกอันทำเสร็จแล้ว ซึ่งเราอาจจะอยากเขียนโค้ดลักษณะนี้ในคำสั่ง `render()` ของ MainSection:

```javascript
var allTodos = this.props.allTodos;
var allChecked = true;
for (var id in allTodos) {
  if (!allTodos[id].complete) {
    allChecked = false;
    break;
  }
}
...

return (
  <section id="main">
  <input
    id="toggle-all"
    type="checkbox"
    checked={allChecked ? 'checked' : ''}
  />
  ...
  </section>
);
```

ในขณะที่ดูเหมือนเป็นเรื่องง่ายๆ ที่ทำกันตามปกติ นี่คือตัวอย่างของการที่ logic ของแอพพลิเคชั่นหลุดไปอยู่ใน views ส่งผลให้เราไม่สามารถเขียนบรรยายความสามารถนี้ได้ในโค้ดเทสของ TodoStore ดังนั้นเราลองย้าย logic นั้นไปไว้ใน store กันดีกว่า ขั้นตอนแรกเราจะสร้างคำสั่งใหม่ใน store ที่เก็บ logic นี้เอาไว้:

```javascript
areAllComplete: function() {
  for (var id in _todos) {
    if (!_todos[id].complete) {
      return false;
    }
  }
  return true;
},
```

ตอนนี้ logic ของแอพเข้าไปอยู่ในที่ที่มันควรอยู่แล้ว ดังนั้นเราจึงสามารถเขียนเทสได้ดังนี้:

```javascript
it('determines whether all to-do items are complete', function() {
  var i = 0;
  for (; i < 3; i++) {
    callback(mockTodoCreate);
  }
  expect(TodoStore.areAllComplete()).toBe(false);

  var all = TodoStore.getAll();
  for (key in all) {
    callback({
      source: 'VIEW_ACTION',
      action: {
        actionType: TodoConstants.TODO_COMPLETE,
        id: key
      }
    });
  }
  expect(TodoStore.areAllComplete()).toBe(true);

  callback({
    source: 'VIEW_ACTION',
    action: {
      actionType: TodoConstants.TODO_UNDO_COMPLETE,
      id: key
    }
  });
  expect(TodoStore.areAllComplete()).toBe(false);
});
```

ต่อมาเราปรับโค้ดใน view ของเราโดยการสั่งเรียกข้อมูลนั้นใน controller-view ของเรา ซึ่งคือไฟล์ TodoApp.js และส่งค่านี้ต่อลงไปที่ component ชื่อ MainSection

```javascript
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoApp = React.createClass({
...

  /**
   * @return {object}
   */
  render: function() {
    return (
      ...
      <MainSection
        allTodos={this.state.allTodos}
        areAllComplete={this.state.areAllComplete}
      />
      ...
    );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});
```

จากนั้นเราจะนำค่านั้นมาใช้จาก property ที่ได้รับมาเพื่อแสดงผล checkbox ของเรา

```javascript
render: function() {
  ...

  return (
    <section id="main">
    <input
      id="toggle-all"
      type="checkbox"
      checked={this.props.areAllComplete ? 'checked' : ''}
    />
    ...
    </section>
  );
},
```

ศึกษาวิธีการเทส React components ได้ที่ [Jest tutorial สำหรับ React](http://facebook.github.io/jest/docs/tutorial-react.html) และ [ReactTestUtils documentation](http://facebook.github.io/react/docs/test-utils.html).


อ่านต่อ
---------------

- [Mocks Aren't Stubs](http://martinfowler.com/articles/mocksArentStubs.html) by Martin Fowler
- [Jest API Reference](http://facebook.github.io/jest/docs/api.html)
