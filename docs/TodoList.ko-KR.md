---
id: todo-list-ko-KR
title: 튜토리얼 – 할 일 목록
layout: docs
category: Quick Start
permalink: docs/todo-list-ko-KR.html
next: chat-ko-KR
lang: ko-KR
---

Flux 아키텍처를 설명하기 위해 전형적인 TodoMVC 애플리케이션을 만들려고 한다. 이 애플리케이션 전체는 React GitHub 리포지터리 [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) 예제 폴더에서 받을 수 있지만, 이 예제에서 개발 단계를 하나씩 살펴보도록 하자.

처음 시작할 때에 모듈을 구동하기 위해 기본적인 구조가 필요하다. CommonJS를 기반으로 한 Node의 모듈 시스템은 상황에 잘 맞고 [react-boilerplate](https://github.com/petehunt/react-boilerplate)를 활용해 빠르게 설정하고 구동할 수 있다. npm이 설치되어 있다는 가정하에 react-boilerplate를 GitHub에서 복제한 후 해당 디렉토리에 터미널로(또는 본인이 사용하고 싶은 CLI 애플리케이션으로) 이동한다. 그리고 다음 npm 스크립트를 통해 환경을 만들고 구동한다. `npm install`, `npm run build` 그리고 마지막에 `npm start`로 Browserify를 이용한 지속적인 빌드를 시작한다.

TodoMVC 예제를 사용한다면 이미 포함된 내용이지만, react-boilerplate를 사용한다면 package.json을 수정해서 파일 구조와 의존성에 관한 내용을 TodoMVC의 예제에 포함된 [package.json](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/package.json)에 맞춰준다. 이 작업을 하지 않으면 여기서 설명하는 내용과 다를 수 있다.


소스 코드 구조
-----------
index.html 파일이 바로 앱의 시작점이다. 이 파일에서는 Browserify에 의해 만들어진 bundle.js를 불러오는 역할을 하고 있으며 이제부터 작성하는 코드 대부분은 'js' 디렉토리에 넣을 예정이다. Browserify가 이 작업을 하게 두고 새로운 터미널 또는 GUI 파일 브라우저를 열어 디렉토리를 살펴보면 다음과 같은 구조로 구성되어 있다:

```
myapp
  |
  + ...
  + js
    |
    + app.js
    + bundle.js // 파일을 변경하면 Browserify가 자동으로 생성함
  + index.html
  + ...
```

js 디렉토리를 살펴보면 다음과 같은 초기 디렉토리 구조로 구성되어 있다:

```
myapp
  |
  + ...
  + js
    |
    + actions
    + components // 모든 React 컴포넌트 즉 view와 controller-views가 들어있음
    + constants
    + dispatcher
    + stores
    + app.js
    + bundle.js
  + index.html
  + ...
```

Dispatcher 생성하기
-----------------

이제 dispatcher를 만들 준비가 되었다. Dispatcher 클래스에 대한 작은 예제가 여기에 있다. JavaScript의 promise 패턴으로 작성되어 있고, Jake Archibald의 [ES6-Promises](https://github.com/jakearchibald/ES6-Promises) 변환 모듈로 구현되어(polyfilled) 있다.

```javascript
var Promise = require('es6-promise').Promise;
var assign = require('object-assign');

var _callbacks = [];
var _promises = [];

var Dispatcher = function() {};
Dispatcher.prototype = assign({}, Dispatcher.prototype, {

  /**
   * Store의 콜백을 Dispatcher에 등록하면 action에 의해 실행됨.
   * @param {function} callback 등록하려고 하는 콜백
   * @return {number} _cllbacks 배열에 포함될 콜백에 대한 인덱스
   */
  register: function(callback) {
    _callbacks.push(callback);
    return _callbacks.length - 1; // index
  },

  /**
   * dispatch
   * @param  {object} payload action으로 넘어온 데이터
   */
  dispatch: function(payload) {
    // 콜백을 참조하기 위해 promise 배열을 생성
    var resolves = [];
    var rejects = [];
    _promises = _callbacks.map(function(_, i) {
      return new Promise(function(resolve, reject) {
        resolves[i] = resolve;
        rejects[i] = reject;
      });
    });
    // 콜백에 데이터를 전파해 promise를 해결(resolve)하거나 거절(reject)함
    _callbacks.forEach(function(callback, i) {
      // 콜백은 객체를 반환해 해결하거나 Promise 방식으로 체이닝 할 수 있음
      // waitFor()를 보면 이 방식이 유용하다는 것을 알 수 있음
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
기본적으로 Dispatcher 클래스가 제공하는 공개 API는 register()와 dispatch() 두 메소드다. 각각 store의 콜백을 등록하기 위해서 store 내에서 register() 메소드를 사용한다. 그리고 콜백을 실행하기 위해 dispatch() 메소드를 action 내에서 사용한다.

앞으로 만들 app에 적합한 dispatcher인 AppDispatcher를 다음과 같이 작성한다.

```javascript
var Dispatcher = require('./Dispatcher');
var assign = require('object-assign');

var AppDispatcher = assign({}, Dispatcher.prototype, {

  /**
   * view와 dispatcher를 연결하는 다리 함수로 view action만 action으로 표시했다.
   * 다른 변형으로는 handleServerAction이 있다.
   * @param  {object} action view로부터 오는 데이터
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

이제 좀 더 요구사항에 맞는 구현을 만들었다. view의 이벤트 핸들러에서 action을 도움 함수를 이용해 전달된다. 이후에는 이 코드를 더 확장해서 서버 갱신을 위해 분리된 코드를 만들겠지만, 지금은 이 정도로 충분하다.


Store 생성하기
------------

Store를 만들기 위해 Node의 EventEmitter를 사용한다. '변경' 이벤트를 controller-views에게 중계하기 위해 EventEmitter가 필요하다. 어떻게 만드는지 여기서 살펴보려 한다. 여기에서의 코드는 일부가 생략되었는데 전체 코드를 보고 싶다면 TodoMVC 예제 코드의 [TodoStore.js](https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/stores/TodoStore.js)를 확인하자.

```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {}; // 할 일 항목을 위한 컬랙션

/**
 * 할 일 항목을 생성함
 * @param {string} text 할 일의 내용
 */
function create(text) {
  // 실제 id 대신 현재의 타임스탬프를 사용함
  var id = Date.now();
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * 할 일 항목을 제거함
 * @param {string} id
 */
function destroy(id) {
  delete _todos[id];
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * 할 일의 전체 목록을 얻음
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

      // 다른 경우를 위한 actionTypes, 예를 들어 TODO_UPDATE 등
    }

    return true; // 이 반환은 문제가 없음. Dispatcher의 promise를 위해 필요.
  })

});

module.exports = TodoStore;
```

위에서 작성한 코드 중에는 몇 가지 중요한 부분이 있다. 맨 처음 프라이빗 데이터 구조인 _todos를 만들었다. 이 객체는 모든 개별적인 할 일 항목을 담고 있다. 이 변수는 클래스의 바깥에 있지만, 모듈의 클로저로 사용된다. 그래서 프라이빗 상태로 남아 모듈 바깥에서 직접적인 변경을 할 수 없다. 이 구조는 입출력 인터페이스를 명확하게 보존할 수 있게 해 데이터의 흐름이 action을 이용하지 않고는 store 갱신을 불가능하게 한다.

다른 중요한 부분은 store의 콜백을 dispatcher에 등록하는 부분이다. dispatcher에 데이터를 처리하는 콜백을 전달하고 dispatcher에 등록한 콜백을 store에 인덱스로 보존한다. 콜백 함수는 현재 2가지 actionType만 처리하고 있지만 차후에 필요한 만큼 더 추가할 수 있다.


Controller-View 변경 리스닝하기
----------------------------

store의 변경을 듣기 위해 컴포넌트 위계의 최상위에 놓인 React 컴포넌트가 필요하다. 앱의 규모가 크다면 리스닝 컴포넌트는 더 많이 필요하게 되고 그에 따라 페이지의 모든 섹션마다 위치하게 될 것이다. Facebook의 광고 생성 도구에서 controller를 닮은 view를 많이 포함하고 있는데 각각 상세한 영역의 UI를 운영하는 데 사용된다. 돌아보기 비디오 편집기에서는 프리뷰와 이미지 선택 인터페이스, 이 둘만 포함하고 있다. 여기에 TodoMVC 예제가 있다. 다시 말해서 이 코드는 요약본이며 모든 코드를 확인하고 싶다면 TodoMVC 예제의 [TodoApp.react.js](https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/TodoApp.react.js)를 참고하자.

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

이제 React의 영역에 들어와 React의 생명주기 메소드를 이용한다. 이 controller-view에서 getInitialState() 메소드를 활용해 초기화하고, 이벤트 리스너를 componentDidMount() 메소드로 등록하고, componentWillUnmount()로 연결을 뒷정리한다. 여기에 포함된 div를 화면에 그려내고 TodoStore에서 받은 상태의 모음을 view의 위계에 따라 흘려보낸다.

최상단 컴포넌트는 애플리케이션을 위한 텍스트 input을 포함하고 있지만, store의 상태를 알고 있을 필요는 없다. MainSection과 Footer는 이 데이터가 필요하므로 아래로 흘려보내야 한다.

더 많은 Views
------------
React 컴포넌트 위계의 상위 레벨은 다음과 같다:

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
TodoItem이 편집 모드라면 TodoTextInput을 자식으로 생성해야 한다. 프로퍼티(props)로 받은 데이터를 컴포넌트에서 어떻게 보여주는지 살펴보고 어떻게 dispatcher가 action으로 소통하는지 알아보자.

MainSection은 TodoApp에서 생성한 TodoItems서 받아온 할 일 목록을 반복해서 출력하는 데 필요하다. 컴포넌트의 render()메소드로 다음과 같이 반복 출력을 표현할 수 있다:

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
이제 TodoItem은 할 일 항목의 원문을 표시하고 자체 id를 사용한다. TodoMVC 예제에서 TodoItem이 사용하고 있는 모든 action을 설명하는 것은 이 글의 취지와는 거리가 멀지만 할 일 항목을 삭제하는 action을 살펴보려고 한다. 축약된 버전의 TodoItem은 다음과 같다:

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

TodoActions에서 action을 삭제하는 것도 가능하다. Store가 이런 방식의 핸들링에 이미 준비되어 있으므로 사용자의 상호작용과 연결해 애플리케이션의 상태를 변경하는 것은 아주 간단한 일이다. 해야 할 일은 onClick 핸들러로 제거할 action을 감싸고 id만 제공해주면 끝이다. 이제 사용자는 제거 버튼을 클릭해 Flux 사이클이 애플리케이션의 남은 부분을 갱신하게 할 수 있다.

반면 텍스트 입력은 약간 복잡한데 텍스트 입력의 상태를 React 컴포넌트 스스로가 업데이트하지 않도록 잠시 멈춰야 하기 때문이다. TodoTextInput이 어떤 방식으로 동작하는가 확인해보자. 다음 보게 될 내용에서는, 입력창에 값을 입력할 때, 값이 변하는 매 순간 React는 컴포넌트의 상태를 갱신하려고 한다. 그래서 입력창 안에 텍스트를 저장할 준비가 완료되었을 때, 컴포넌트 상태에 묶여있던 값을 action에 적재해야 한다.

이 부분은 애플리케이션의 상태가 아니라 UI의 상태인데 이 둘을 잘 구분해서 생각하면 이 상태가 어디에 보관되어 있어야 하는가에 대한 좋은 지침이 된다. 모든 애플리케이션의 상태는 store에 저장된다. 반면 UI의 상태는 때때로 컴포넌트에 저장된다. 물론 이상적으로는 React 컴포넌트는 가능한 한 작은 상태를 유지해야 한다.

애플리케이션 내에서 TodoTextInput은 여러 곳에 있을 수 있는 데다 다른 행동이 필요할 수 있기 때문인데 컴포넌트의 부모에게 물려받은 프로퍼티와 같이 onSave 메소드를 사용해야 하는 경우가 있을 것이다. 다음 구현으로 동일한 onSave 메소드를 사용하더라도 어디에 있는가에 따라 다른 action을 실행하는 것이 가능하다.

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
   * onSave 메소드를 콜백에 값을 넘겨 실행하는 방법으로 활용해
   * 컴포넌트가 다른 방식으로 사용될 수 있도록 한다.
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

TodoTextInput이 새로운 할 일 항목을 생성하는 프로퍼티로 onSave 메소드를 사용할 수 있도록 Header를 다음과 같이 작성한다:

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
   * TodoTextInput와 함께 이벤트 핸들러가 호출된다.
   * 다음과 같이 정의하는 것으로 TodoTextInput를 여러 위치에서 다양한 방법으로
   * 사용할 수 있게 된다.
   * @param {string} text
   */
  _onSave: function(text) {
    TodoActions.create(text);
  }

});

module.exports = Header;
```

다른 맥락을 예를 든다면 이미 존재하는 할 일 항목을 수정하는 경우에는 onSave 콜백에서 `TodoActions.update(text)`를 실행하는 방식으로 작성한다.

유의적 action 만들기
-----------------

위에서 만든 view에서 사용한 2가지 action을 다음 코드와 같이 만들 수 있다:

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

여기서 보는 것과 같이 AppDispatcher.handleViewAction() 헬퍼나 TodoActions.create() 메소드를 꼭 사용해야 할 필요는 없다. 이론적으로는 AppDispatcher.dispatch()를 직접 호출해서 데이터를 제공할 수 있다. 하지만 애플리케이션이 규모가 커지는 경우에 이 헬퍼는 코드를 깨끗하고 유의미하게 유지할 수 있도록 돕는다. 단순하게 봐도 TodoItem에 필요 없는 모든 코드를 작성하는 것보다 TodoActions.destroy(id)를 사용하는 쪽이 낫다.

TodoActions.create()로 적재하는 데이터는 다음과 같다:

```javascript
{
  source: 'VIEW_ACTION',
  action: {
    type: 'TODO_CREATE',
    text: 'Write blog post about Flux'
  }
}
```

이 데이터는 등록된 콜백을 통해 TodoStore에게 제공된다. TodoStore는 '변경' 이벤트를 중계하고 MainSection은 TodoStore에서 새 할 일 목록을 가져오는 것으로 응답하고 상태를 변경한다. 상태의 변화는 TodoApp 컴포넌트가 자신의 render() 메소드와 모든 자식 컴포넌트의 render()메소드를 호출하는 동기가 된다.

시작하기
------

이 애플리케이션의 시작점이 되는 파일은 app.js이다. 이 파일은 간단하게 TodoApp 컴포넌트로 애플리케이션의 최상위 엘리먼트를 구현한다.

```javascript
var React = require('react');

var TodoApp = require('./components/TodoApp.react');

React.render(
  <TodoApp />,
  document.getElementById('todoapp')
);
```

Dispatcher로 의존성 관리하기
------------------------

앞서 말한 것처럼 Dispatcher 구현은 약간 세련되지 않다. 꽤 괜찮은 편이지만 대부분의 애플리케이션에서는 충분하지 않을 것이다. 각 Store 사이의 의존성을 관리할 방법이 필요하다. 이를 위해 주요 몸체가 되는 Dispatcher 클래스에 waitFor() 메소드를 이용해 기능을 추가해보자.

필요한 것은 waitFor()를 구현하는 것이다. Store 콜백으로부터 반환해 사용할 수 있도록 Promise 패턴을 사용한다.

```javascript
  /**
   * @param  {array} promisesIndexes
   * @param  {function} callback
   */
  waitFor: function(promiseIndexes, callback) {
    var selectedPromises = promiseIndexes.map(function(index) {
      return _promises[index];
    });
    return Promise.all(selectedPromises).then(callback);
  }
```

이제 TodoStore 콜백에서 다른 의존성이 먼저 명시적으로 업데이트 될 때까지 진행되지 않고 기다릴 수 있게 되었다. 하지만 Store A가 Store B를 기다리고 B가 A를 기다리는 경우에는 순환 의존이 발생할 수 있다. 더 튼튼한 dispatcher가 필요하다면 이런 시나리오에서 콘솔에 경고를 띄우는 등 문제를 알려주는 부분도 구현해야 한다.

Flux의 미래
---------

Facebook이 Flux를 오픈소스 프레임워크로 계속 릴리즈 할 것인가를 물어본다. 사실 Flux는 아키텍처지 프레임워크가 아니다. 그 질문이 Flux를 사용하기 쉽게 도울 기반 프로젝트에 대해 궁금한 것이라면, 우리는 계속 릴리즈 할 것이다. 우리에게 더 필요한 것이 있다면 알려주길 바란다.

Facebook에서 어떤 방식으로 클라이언트-사이드 애플리케이션을 만드는지 시간을 내어 읽어줘서 고맙다. Flux가 당신이 하는 일에 도움이 되길 기대한다.