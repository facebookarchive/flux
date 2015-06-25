---
id: todo-list-th-TH
title: Tutorial – Todo List
layout: docs
category: Quick Start
permalink: docs/todo-list-th-TH.html
next: chat-th-TH
lang: th-TH
---

เพื่อสาธิตคอนเซ็ปต์ของ Flux ด้วยโค้ดตัวอย่าง เรามาลองสร้างแอพพลิเคชั่น TodoMVC กัน โดยที่คุณสามารถดูโค้ดทั้งหมดที่ GitHub repo ของ React ที่ [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) ได้ แต่ลองมาพัฒนาไปด้วยกันทีละขั้นตอนดีกว่า

มาเริ่มต้นกันด้วยโค้ดต้นแบบที่สามารถรันระบบโมดูลได้ ระบบโมดูล CommonJS ของ Node เหมาะกับงานนี้เป็นอย่างดีโดยที่เราสามารถใช้ [react-boilerplate](https://github.com/petehunt/react-boilerplate) เป็นต้นแบบในการเริ่มต้นพัฒนาได้อย่างรวดเร็ว คาดว่าคุณมี npm ติดตั้งอยู่ในคอมพิวเตอร์ของคุณอยู่แล้ว เรามาเริ่มจาก clone โค้ด react-boilerplate จาก GitHub และเปลี่ยน directory ไปที่ directory ที่โคลนมาโดยใช้ Terminal (หรือโปรแกรม CLI ที่คุณใช้อยู่) จากนั้นรันสคริปต์ของ npm เพื่อเริ่มต้นพัฒนา: `npm install` ต่อด้วย `npm run build` และท้ายสุดรัน `npm start` เพื่อใช้ Browserify ในการเขียนโค้ดอย่างต่อเนื่อง

โค้ดตัวอย่าง TodoMVC มีทุกอย่างที่เราจะพัฒนากันเรียบร้อยแล้ว แต่ถ้าคุณเลือกเริ่มต้นด้วย react-boilerplate ขอให้ตรวจสอบว่าไฟล์ package.json ของคุณตรงกันกับไฟล์ตัวอย่าง [package.json](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/package.json) ของ TodoMVC ไม่เช่นนั้นโค้ดของคุณจะทำงานได้ไม่ตรงตามคำอธิบายต่อจากนี้


โครงสร้าง Source Code
---------------------
ไฟล์ index.html คือจุดเริ่มต้นของแอพพลิเคชั่นของเราซึ่งทำการโหลดไฟล์ bundle.js ที่ได้จากสคริปต์ npm แต่เราจะเขียนโค้ดส่วนใหญ่ในไดเรคทอรี่ 'js' ในตอนนี้หน้าต่าง Terminal ปัจจุบันควรจะเป็นการทำงานของ Browserify โดยที่เราจะเปิด Terminal แท็บใหม่เพื่อไปที่ไดเรคทอรี่แอพของเรา โดยที่มีโครงสร้างไฟล์ตามนี้:

```
myapp
  |
  + ...
  + js
    |
    + app.js
    + bundle.js // สร้างมาโดยอัตโนมัติโดย Browserify ทุกครั้งที่เราเซฟไฟล์
  + index.html
  + ...
```

และในไดเรคทอรี่ js ให้เราสร้างไดเรคทอรี่หลักตามโครงสร้างต่อไปนี้:

```
myapp
  |
  + ...
  + js
    |
    + actions
    + components // React components ทั้งหมด, ทั้ง views และ controller-views
    + constants
    + dispatcher
    + stores
    + app.js
    + bundle.js
  + index.html
  + ...
```

สร้าง Dispatcher
---------------------

มาเริ่มต้นสร้าง dispatcher กันดีกว่า โดยที่โค้ดนี้เป็นตัวอย่างแบบง่ายๆ ของคลาส Dispatcher ซึ่งเขียนด้วย JavaScript promises โดยที่ polyfilled ด้วยโมดูล [ES6-Promises](https://github.com/jakearchibald/ES6-Promises) ของ Jake Archibald

```javascript
var Promise = require('es6-promise').Promise;
var assign = require('object-assign');

var _callbacks = [];
var _promises = [];

var Dispatcher = function() {};
Dispatcher.prototype = assign({}, Dispatcher.prototype, {

  /**
   * ลงทะเบียน callback ของ Store เอาไว้เพื่อที่ให้เราเรียกใช้งานได้โดย action
   * @param {function} callback นี่คือ callback ที่เราจะลงทะเบียน
   * @return {number} ค่า index ของ callback ที่เก็บไว้ใน array ชื่อ _callbacks
   */
  register: function(callback) {
    _callbacks.push(callback);
    return _callbacks.length - 1; // index
  },

  /**
   * dispatch
   * @param  {object} payload ข้อมูลจาก action
   */
  dispatch: function(payload) {
    // ก่อนอื่นสร้าง array ที่เก็บ promises สำหรับ callback เพื่อเอาไว้อ้างอิงต่อไป
    var resolves = [];
    var rejects = [];
    _promises = _callbacks.map(function(_, i) {
      return new Promise(function(resolve, reject) {
        resolves[i] = resolve;
        rejects[i] = reject;
      });
    });
    // Dispatch ไปให้ callbacks ที่มีทั้งหมดและ resolve หรือ reject promises
    _callbacks.forEach(function(callback, i) {
      // Callback สามารถส่งคืน Object กลับมาให้ resolve หรือส่งคืน promise มาให้ chain ต่อ
      // ดูรายละเอียดเกี่ยวกับ waitFor() เพื่อศึกษาว่าทำไมต้องทำแบบนี้
      Promise.resolve(callback(payload)).then(function() {
        resolves[i](payload);
      }, function() {
        rejects[i](new Error('Dispatcher callback unsuccessful'));
      });
    });
    _promises = [];
  }
});

module.exports = Dispatcher;
```

API ของ Dispatcher แบบง่ายๆ นี้ประกอบไปด้วย 2 method เท่านั้น: register() และ dispatch() เราจะเรียกใช้ register() ใน stores ของเราเพื่อลงทะเบียน callback ของแต่ละ store และเราจะเรียกใช้ dispatch() ใน actions เพื่อเรียก callbacks

ถึงตอนนี้เราพร้อมแล้วที่จะสร้าง dispatcher ที่ใช้สำหรับแอพของเรา ซึ่งเราจะเรียกมันว่า AppDispatcher

```javascript
var Dispatcher = require('./Dispatcher');
var assign = require('object-assign');

var AppDispatcher = assign({}, Dispatcher.prototype, {

  /**
   * ฟังก์ชันที่เป็นตัวเชื่อมระหว่าง views และ dispatcher โดยระบุว่า action นี้
   * เป็น action จาก view  ซึ่งเราอาจมีฟังก์ชันอีกตัวที่ชื่อ handleServerAction
   * @param  {object} action ข้อมูลที่มาจาก view
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }

});

module.exports = AppDispatcher;
```

ตอนนี้เราได้เขียนโค้ด dispatcher ที่ตรงกับความต้องการของเราเรียบร้อยแล้ว โดยที่เรามี helper function ที่สามารถนำไปใช้ได้ใน actions ที่มาจาก event handlers ใน views ซึ่งในอนาคตเราอาจจะเพิ่ม helper สำหรับ action ที่มาจากการอัพเดทฝั่ง server ได้ แต่สำหรับตอนนี้ถือว่าเพียงพอแล้วกับสิ่งที่เราต้องการ


สร้าง Stores
----------------

เราสามารถเริ่มต้นสร้าง store ด้วย EventEmitter ของ Node โดยเราจะใช้ EventEmitter ทำการกระจาย 'change' event ไปยัง  controller-views มาลองดูโค้ดกันดีกว่าว่าหน้าตาเป็นอย่างไร ในโค้ดด้านล่างนี้ได้ตัดทอนบางส่วนออกไปเพื่อความกระชับ แต่คุณสามารถดูโค้ดแบบเต็มๆ ได้ที่ [TodoStore.js](https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/stores/TodoStore.js) ในโค้ดตัวอย่าง TodoMVC

```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {}; // collection ของ todo items

/**
 * สร้าง TODO item
 * @param {string} text ข้อความของ TODO
 */
function create(text) {
  // ใช้ timestamp ปัจจุบันแทน id จริงๆ
  var id = Date.now();
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * ลบ TODO item
 * @param {string} id
 */
function destroy(id) {
  delete _todos[id];
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * ดึง TODOs ทั้งหมด
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {
      case TodoConstants.TODO_CREATE:
        text = action.text.trim();
        if (text !== '') {
          create(text);
          TodoStore.emitChange();
        }
        break;

      case TodoConstants.TODO_DESTROY:
        destroy(action.id);
        TodoStore.emitChange();
        break;

      // สามารถเพิ่มประเภทของ action ได้เช่น TODO_UPDATE, etc.
    }

    return true; // ไม่มี errors (จำเป็นต้องมีเพราะ promise ใน Dispatcher)
  })

});

module.exports = TodoStore;
```

จากโค้ดด้านบน มีจุดสำคัญอยู่บางจุด เริ่มต้นจากเราจะเก็บข้อมูลแบบ private ไว้ในตัวแปรชื่อ _todos ซึ่ง object นี้เก็บ to-do items ทั้งหมดเอาไว้ เนื่องจากว่าตัวแปรนี้อยู่ด้านนอก class แต่อยู่ภายใน closure ของโมดูล ตัวแปรนี้จึงมีสภาวะ private — โค้ดต่างๆ ภายนอกโมดูลนี้ไม่สามารถเปลี่ยนแปลงค่าของตัวแปรนี้ได้ตรงๆ ซึ่งสิ่งนี้ช่วยให้เราควบคุมแพทเทิร์นการเดินทางของข้อมูลให้เป็นทิศทางเดียวได้ ทำให้เป็นไม่ได้เลยที่จะอัพเดท store โดยที่ไม่ใช้ action

อีกส่วนสำคัญคือการลงทะเบียน callback ของ store ไว้กับ dispatcher ซึ่งเราทำได้โดยการส่งต่อ callback ที่รับข้อมูล payload ให้กับ dispatcher และเก็บ index ที่ใช้อ้างอิงถึง store นี้จากทะเบียนของ dispatcher จะเห็นว่าฟังก์ชั่น callback ของเราใช้ตอบสนองกับ action เพียงแค่ 2 ประเภทเท่านั้น ในอนาคตเราสามารถเพิ่มได้มากเท่าที่เราต้องการ


ตอบสนองต่อการเปลี่ยนแปลงของข้อมูลด้วย Controller-View
-------------------------------------------

เราต้องการให้ React component อยู่ในตำแหน่งบนๆ ของระดับชั้น component ของเราเพื่อที่จะคอยฟังการเปลี่ยนแปลงของข้อมูลใน store ซึ่งในแอพที่ใหญ่กว่านี้เราอาจจะมี component ประเภทนี้มากกว่านี้ เช่น 1 component สำหรับทุกๆ ส่วนที่แบ่งไว้ใน 1 หน้า ตัวอย่างจากในแอพ Ads Creation Tool ของ Facebook เรามี views ที่เป็นเหมือน controller แบบนี้อยู่มากมาย ทำการควบคุมแต่ละส่วนของ UI, ใน Lookback Video Editor เรามีแค่ 2 components เท่านั้น: หนึ่งอันสำหรับตัวพรีวิววีดิโอ และอีกอันสำหรับเครื่องมือเลือกรูปภาพ และโค้ดด้านล่างนี้คืออันที่เราต้องการสำหรับแอพ TodoMVC ซึ่งเราตัดโค้ดมาอย่างย่อโดยที่คุณสามารถดูโค้ดเต็มๆ ได้ที่ไฟล์ [TodoApp.react.js](https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/TodoApp.react.js) ของ TodoMVC

```javascript
var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../stores/TodoStore');

function getTodoState() {
  return {
    allTodos: TodoStore.getAll()
  };
}

var TodoApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <Header />
        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer allTodos={this.state.allTodos} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
  }

});

module.exports = TodoApp;
```

เราคงคุ้นเคยกับโค้ด React ด้านบนนี้อยู่แล้วที่ใช้ประโยชน์คำสั่ง lifecycle ต่างๆของ React เริ่มที่เราเซทอัพ state ตั้งต้นของ controller-view ตัวนี้ด้วยคำสั่ง getInitialState() จากนั้นลงทะเบียน event listener ในคำสั่ง componentDidMount() และยกเลิกการลงทะเบียนไว้ในคำสั่ง componentWillUnmount() โดยที่ในคำสั่ง render เราแสดงผล div หลักและส่งค่า states ต่างๆที่เราได้จาก TodoStore ลงไปใน component ชั้นล่าง

Header component ประกอบไปด้วยกล่องข้อความ text input หลักสำหรับแอพพลิเคชั่น แต่จะสังเกตุว่ามันไม่จำเป็นต้องรู้ค่า state ของ store เลย ในขณะที่ MainSection และ Footer จำเป็นต้องรู้ข้อมูล state เหล่านี้เราจึงส่งค่าลงไปให้

Views อื่นๆ
----------
ในภาพรวมระดับชั้นของ React component ของแอพเราเป็นดังต่อไปนี้:

```javascript
<TodoApp>
  <Header>
    <TodoTextInput />
  </Header>

  <MainSection>
    <ul>
      <TodoItem />
    </ul>
  </MainSection>

</TodoApp>
```
ถ้า TodoItem อยู่ในโหมดแก้ไข มันจะแสดง TodoTextInput เป็น component ลูก ลองมาดูว่า component เหล่านี้แสดงผลข้อมูลที่ตัวเองได้รับมาจาก props ได้อย่างไร และพวกมันสื่อสารกับ dispatcher ด้วย actions ได้อย่างไรบ้าง

MainSection จำเป็นต้องวนลูป collection ของ to-do items ที่ตัวเองได้รับมาจาก TodoApp เพื่อสร้างลิสต์ของ TodoItems ซึ่งในคำสั่ง render() ของ component เราสามารถวนลูปได้ดังนี้:

```javascript
var allTodos = this.props.allTodos;

for (var key in allTodos) {
  todos.push(<TodoItem key={key} todo={allTodos[key]} />);
}

return (
  <section id="main">
    <ul id="todo-list">{todos}</ul>
  </section>
);
```
ถึงตอนนี้ TodoItem แต่ละตัวสามารถแสดงข้อความของตัวเองได้แล้ว และสามารถเรียกใช้ actions ได้ด้วย ID ของตัวเอง ถ้าจะให้อธิบาย actions ทั้งหมดของ TodoItem นั้นคงเกินขอบเขตของบทความนี้ แต่เราลองมาดูตัวอย่าง action ที่ใช้ลบ to-do item กันดีกว่า โค้ดด้านล่างตัดมาจาก TodoItem:

```javascript
var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');

var TodoItem = React.createClass({

  propTypes: {
    todo: React.PropTypes.object.isRequired
  },

  render: function() {
    var todo = this.props.todo;

    return (
      <li
        key={todo.id}>
        <label>
          {todo.text}
        </label>
        <button className="destroy" onClick={this._onDestroyClick} />
      </li>
    );
  },

  _onDestroyClick: function() {
    TodoActions.destroy(this.props.todo.id);
  }

});

module.exports = TodoItem;
```

เมื่อเรามี action destroy อยู่ใน TodoActions และ store ก็พร้อมที่จะตอบสนอง action นี้ การเชื่อมโยง interaction ของ user กับการเปลี่ยนแปลง state ของแอพนั้นจึงง่ายมากๆ ซึ่งทำได้โดยการเรียก destroy action ผ่าน onClick handler โดยส่งผ่านค่า id เท่านี้เอง จากนี้ user ก็สามารถคลิกปุ่ม destroy และโค้ดของเราจะเริ่มต้นวัฏจักรของ Flux เพื่ออัพเดทส่วนที่เหลือของแอพพลิเคชั่น

ในขณะที่กล่องข้อความ Text input จะซับซ้อนกว่าเล็กน้อยเนื่องจากเราจำเป็นต้องมี state ของกล่องข้อความภายใน React component ลองมาดูกันว่า TodoTextInput ทำงานอย่างไร

จากโค้ดด้านล่างนี้จะเห็นว่า ทุกครั้งที่กล่องข้อความมีการเปลี่ยนแปลง React ต้องการให้เราอัพเดท state ของ component และเมื่อไหร่ก็ตามที่เราพร้อมจะเซฟข้อความนั้น เราจะนำค่าที่อยู่ใน state ส่งไปใน payload ของ action ซึ่งนี่คือ UI state ไม่ใช่ state ของแอพพลิเคชั่น โดยที่การแยกความแตกต่างของ state เหล่านี้คือเคล็บลับในการตัดสินใจว่า state ควรเก็บอยู่ที่ไหน โดยที่ state ของแอพพลิเคชั่นทั้งหมดควรเก็บอยู่ใน store ในขณะที่บางครั้ง component จำเป็นต้องเก็บ UI state ไว้กับตัวเอง React component ในอุดมคติควรเก็บ state เอาไว้ให้น้อยที่สุดเท่าที่จะเป็นไปได้

เนื่องจากว่า TodoTextInput ถูกนำไปใช้ในหลายที่ในแอพของเรา นอกจากนั้นในแต่ละที่ก็ยังมีพฤติกรรมที่แตกต่างกันอีกด้วย เราจึงจำเป็นต้องส่งต่อคำสั่ง onSave ไปเป็น prop จาก component แม่ ซึ่งทำให้คำสั่ง onSave สามารถเรียกใช้ actions ที่แตกต่างกันขึ้นอยู่กับว่าถูกนำไปใช้ที่ไหน

```javascript
var React = require('react');
var ReactPropTypes = React.PropTypes;

var ENTER_KEY_CODE = 13;

var TodoTextInput = React.createClass({

  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    onSave: ReactPropTypes.func.isRequired,
    value: ReactPropTypes.string
  },

  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    );
  },

  /**
   * เรียกใช้ callback onSave จาก props ซึ่งทำให้เราสามารถนำ component ตัวนี้
   * ไปใช้ได้หลายวิธี
   */
  _save: function() {
    this.props.onSave(this.state.value);
    this.setState({
      value: ''
    });
  },

  /**
   * @param {object} event
   */
  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  /**
   * @param {object} event
   */

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }

});

module.exports = TodoTextInput;
```

Header component ส่งต่อคำสั่ง onSave เป็น prop เพื่อให้ TodoTextInput สามารถสร้าง to-do item ใหม่ได้:

```javascript
var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  },

  /**
   * Event handler ถูกเรียกจากภายใน TodoTextInput
   * การประกาศฟังก์ชันไว้ที่นี่ทำให้เราสามารถนำ TodoTextInput ไปใช้ได้หลายที่
   * ในหลากหลายวิธี
   * @param {string} text
   */
  _onSave: function(text) {
    TodoActions.create(text);
  }

});

module.exports = Header;
```

ในสถานการณ์อื่นเช่น ในโหมดแก้ไข เราอาจจะส่งต่อคำสั่ง onSave ที่เรียกใช้ `TodoActions.update(text)` แทน


สร้าง Actions ที่มีความหมาย เข้าใจง่าย
-------------------------

นี่เป็นโค้ดพื้นฐานสำหรับ actions 2 ตัวที่เราใช้ในโค้ดด้านบนใน views:

```javascript
/**
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var TodoActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: TodoConstants.TODO_CREATE,
      text: text
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: TodoConstants.TODO_DESTROY,
      id: id
    });
  },

};

module.exports = TodoActions;
```

จริงๆ แล้วจะเห็นว่าเราไม่จำเป็นต้องมี helpers ฟังก์ชั่น AppDispatcher.handleViewAction() หรือ TodoActions.create() เลยด้วยซ้ำ ในทางทฤษฎีแล้วเราสามารถเรียกใช้คำสั่ง AppDispatcher.dispatch() ได้โดยตรงและส่งข้อมูล payload เข้าไปเลย แต่เมื่อแอพของเรามีขนาดใหญ่ขึ้น helpers เหล่านี้ช่วยให้โค้ดของเราชัดเจนและเข้าใจง่าย ซึ่งมันเข้าใจง่ายกว่ามากที่จะเขียนโค้ดว่า TodoActions.destroy(id) แทนที่จะเป็นโค้ดอื่นๆ อีกมากมายที่ TodoItem ของเราไม่ควรจะต้องรู้

ข้อมูล payload ที่ถูกสร้างขึ้นจากคำสั่ง TodoActions.create() หน้าตาเป็นดังนี้:

```javascript
{
  source: 'VIEW_ACTION',
  action: {
    type: 'TODO_CREATE',
    text: 'Write blog post about Flux'
  }
}
```

ข้อมูล payload นี้จะถูกส่งต่อไปให้กับ TodoStore ผ่าน callback ที่ลงทะเบียนไว้ จากนั้น TodoStore จะประกาศ 'change' event โดยที่ MainSection จะตอบสนองด้วยการดึงข้อมูล to-do items ใหม่จาก TodoStore และอัพเดท state ของตัวเอง เมื่อ state มีการอัพเดทเปลี่ยนแปลง TodoApp component จะรันคำสั่ง render() ของตัวเองและของลูกทั้งหมดด้านล่างของระดับชั้น

Start Me Up
-----------

ไฟล์ตั้งต้นของแอพเราคือ app.js ซึ่งง่ายมากๆ เพียงแค่สั่ง render เพื่อแสดงผล TodoApp component ใน element ตั้งต้นของแอพ

```javascript
var React = require('react');

var TodoApp = require('./components/TodoApp.react');

React.render(
  <TodoApp />,
  document.getElementById('todoapp')
);
```

เพิ่มการจัดการ Dependency ให้กับ Dispatcher
----------------------------------------------

จากที่กล่าวไว้ก่อนหน้านี้ โค้ด Dispatcher ของเรานั้นง่ายมากๆ ซึ่งถือว่าใช้งานได้แต่ยังไม่เพียงพอสำหรับใช้ในแอพพลิเคชั่นส่วนมาก เพราะเราต้องการวิธีการจัดการ dependencies ระหว่าง Stores ดังนั้นเราลองมาเพิ่มความสามารถนั้นด้วยคำสั่ง waitFor() ในคลาส Dispatcher กันดีกว่า

เราต้องการคำสั่ง public เพิ่มอีก 1 คำสั่ง นั่นคือคำสั่ง waitFor() สังเกตุว่ามันส่งค่า Promise คืนกลับมาซึ่งสุดท้ายแล้วถูกรีเทิร์นจาก callback ของ Store ที่เรียกใช้

```javascript
  /**
   * @param  {array} promiseIndexes
   * @param  {function} callback
   */
  waitFor: function(promiseIndexes, callback) {
    var selectedPromises = promiseIndexes.map(function(index) {
      return _promises[index];
    });
    return Promise.all(selectedPromises).then(callback);
  }
```

ถึงตรงนี้ ใน callback ของ TodoStore เราสามารถประกาศว่าให้รอ Stores อื่นๆ ให้อัพเดทให้เสร็จก่อนที่ตัวเองจะทำอะไรต่อไป อย่างไรก็ตาม ถ้า Store A รอ Store B, และ B ก็รอ A เหตุการณ์นี้เรียกว่า circular dependency  ซึ่ง dispatcher ที่มีประสิทธิภาพมากกว่านี้จะต้องคอยระวังและส่งคำเตือนไปใน console เวลาที่เกิดเหตุการณ์นี้ขึ้น

อนาคตของ Flux
------------------

หลายคนถามว่า Facebook จะพัฒนา Flux ให้เป็น open source framework หรือไม่ จริงๆ แล้ว Flux เป็นเพียงแค่ architecture ไม่ใช่ framework อย่างไรก็ตามโค้ดต้นแบบเพื่อการเริ่มต้นพัฒนา Flux (Flux boilerplate) อาจจะเป็นไอเดียที่ไม่เลวถ้าคุณสนใจ กรุณาบอกเราถ้าคุณอยากให้เราลองทำแบบนั้น

ขอบคุณที่สละเวลาอ่านวิธีที่เราใช้พัฒนาแอพพลิเคชั่นฝั่ง client ที่ Facebook เราหวังเป็นอย่างยิ่งว่า Flux จะเป็นประโยชน์กับคุณเหมือนกับที่มันเป็นประโยชน์กับเรา
