---
id: testing-flux-applications-ko-KR
title: Flux 애플리케이션 테스팅
layout: docs
category: Guides
permalink: docs/testing-flux-applications-ko-KR.html
next: dispatcher-ko-KR
lang: ko-KR
---

이 가이드는 원래 [React 블로그](http://facebook.github.io/react/blog/)에 게시된 [포스트](http://facebook.github.io/react/blog/2014/09/24/testing-flux-applications.html)며 편집 후 여기에 추가되었다.

이전 글에서 [기본적인 구조와 데이터 흐름](http://haruair.github.io/flux/docs/overview.html)를 살펴봤고 [dispatcher와 action creators](http://haruair.github.io/flux/docs/actions-and-the-dispatcher.html)를 면밀하게 검토했으며, 이 모든 것을 어떻게 조합하는지 [튜토리얼](http://haruair.github.io/flux/docs/todo-list.html)을 통해 확인했다. 이제 Facebook의 자동-모의(mocking) 테스팅 프레임워크인 [Jest](http://facebook.github.io/jest/)와 함께 Flux 애플리케이션에서 형식에 맞는 유닛 테스트를 어떻게 하는지 확인하자.

Jest로 테스트하기
--------------

유닛 테스트를 수행하기 위해 완전히 고립된 애플리케이션의 _단위(unit)_를 만들기 위해 우리가 테스트하려고 하는 코드 외에는 모두 모의(mock)로 만들 필요가 있다. Flux 애플리케이션의 사소한 다른 부분들을 Jest가 모의하게 된다. Jest와 함께 테스트하는 방법을 확인하기 위해 [TodoMVC 애플리케이션 예제](https://github.com/facebook/flux/tree/master/examples/flux-todomvc)를 확인하자.

Jest를 시작하기 위해서는 다음 항목을 따라야 한다:

1. `npm install`로 애플리케이션에서 필요로 하는 모든 의존 모듈을 설치하자.
2. `__tests__/` 디렉토리를 생성해 테스트 파일을 넣는다. 여기서는 TodoStore-test.js을 생성했다.
3. `npm install jest-cli --save-dev`를 실행한다.
4. 다음 코드를 package.json에 추가한다.

```javascript
{
  ...
  "scripts": {
    "test": "jest"
  }
  ...
}
```

이제 `npm test` 명령어로 테스트를 실행할 준비가 끝났다.

기본적으로 모든 모듈을 모의로 불러오게 된다. TodoStore-test.js에서 필요한 부분은 명시적으로 우리가 테스트할 모듈을 선언하는 부분으로 Jest의 `dontMock()` 메소드를 다음과 같이 활용한다.

```javascript
jest.dontMock('TodoStore');
```

이 코드는 Jest에게 TodoStore가 실제 객체로써 사용될 메소드인 것을 알려준다. Jest가 실행될 때 이 모듈 외에는 모두 모의로 불러오게 된다.


Store 테스트하기
--------------

Facebook에서는, 애플리케이션의 상태와 로직이 존재하는 Flux store에 종종 많은 양의 유닛 테스트 커버리지를 필요로 한다. Store가 Flux 애플리케이션에서 가장 넓은 범위를 보장해야 하는 가장 중요한 부분이라는 점은 분명하지만, 언뜻 봐서는 store를 어떻게 테스트해야 할지 이해하기 어렵다.

Flux의 디자인 때문에 store는 외부에서 변경할 수 없다. 그리고 Store는 setter 메소드가 없다. 새로운 데이터가 store로 들어갈 방법은 dispatcher에 등록된 콜백을 사용하는 방법이 유일하다.

그래서 다음과 같은 _이상한 트릭_을 이용해 Flux에서 데이터가 흐르는 과정을 모의로 구현해야 한다.

```javascript
var mockRegister = MyDispatcher.register;
var mockRegisterInfo = mockRegister.mock;
var callsToRegister = mockRegisterInfo.calls;
var firstCall = callsToRegister[0];
var firstArgument = firstCall[0];
var callback = firstArgument;
```

위 코드를 통해 store에 유일하게 데이터를 넣는 방법인, store가 등록한 콜백을 찾아냈다.

Jest 또는 모의 테스트를 처음 접한다면 위 코드에서 무슨 일을 하고 있는지 전혀 알 수 없으므로 각각 부분을 좀 더 상세히 설명하려고 한다. 여기서 `register()` 메소드로 애플리케이션의 dispatcher를 찾는다. dispatcher는 store가 콜백을 등록하기 위해 사용하는 부분이다. dispatcher는 Jest가 자동으로 모의 데이터를 심어주기 때문에, 모의 데이터가 들어있는 버전의 `register()` 메소드를 바로 참조할 수 있다. 그래서 평소 실제 코드에서 이 메소드를 사용하는 방식과 동일하게 사용하면 된다. 차이가 있다면 메소드에 대한 추가적인 정보로 `mock` _프로퍼티_를 얻을 수 있다는 점이다. 메소드에는 일반적으로 프로퍼티가 없지만, Jest에서는 필수적으로 활용되는 방식이다. 모의된 모든 객체의 메소드는 이 프로퍼티를 가지고 있어서 테스트가 진행되는 동안 메소드가 어떻게 동작하는지 검사해볼 수 있다. `register()`에서 호출한 순서에 따라 정렬된 목록은 `mock`의 `calls` 프로퍼티에서 확인할 수 있으며, 각각의 call은 각각 메소드를 호출할 때 사용한 인수 목록을 담고 있다.

그래서 이 코드는 "MyDispatcher의 `register()` 메소드가 첫 번째 호출에서 사용한 첫 번째 인수 참조를 주세요"라는 뜻이다. 그렇게 구한 첫 번째 인수가 바로 store의 콜백이므로 테스트에서 사용할 모든 부분이 준비되었다. 먼저 세미콜론을 아끼기 위해 한 줄로 작성해보자:

```javascript
callback = MyDispatcher.register.mock.calls[0][0];
```

이제 애플리케이션의 dispatcher나 action creator와는 독립적으로, 우리가 원하면 언제든 콜백을 호출할 수 있다. dispatcher와 action creator의 행동을 속여 콜백을 실행하는 것으로 이제 필요한 테스트를 직접 할 수 있다.

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

모두 한 곳에 집어넣기
----------------

Flux의 TodoMVC 예제 애플리케이션은 TodoStore를 위한 예제 테스트가 추가되어 확인할 수 있지만, 다음 요약 버전 테스트를 살펴보도록 하자. 이 테스트에서 확인해야 할 가장 중요한 부분은 store에 등록된 콜백을 테스트의 클로저 내에서 어떻게 계속 참조하는지, 그리고 어떻게 store를 다시 생성해서 테스트마다 store의 전체 상태를 깨끗하게 유지하고 있는가 하는 점이다.

```javascript
jest.dontMock('../TodoStore');
jest.dontMock('object-assign');

describe('TodoStore', function() {

  var TodoConstants = require('../../constants/TodoConstants');
  var AppDispatcher;
  var TodoStore;
  var callback;

  // action을 모의함
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

[TodoStore의 테스트 전체 코드](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/js/stores/__tests__/TodoStore-test.js)는 Github에서 직접 확인할 수 있다.


다른 Store에서 파생된 데이터 모의하기
-----------------------------

Store에서 다른 store으로부터 나온 데이터가 필요할 때가 있다. 모든 모듈이 모의로 동작하기 때문에 다른 store에서 오는 데이터도 해당 store에서 오는 것처럼 흉내내야 한다. 모의 함수를 사용하고 반환되는 값을 조작하는 것으로 이 과정을 모의할 수 있다.

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

이제 테스트에서 MyOtherStore.getState()를 호출하면 언제든 위에서 작성한 객체 컬랙션을 받게 된다. 반환되는 값을 모의하는 방법과 store가 등록한 콜백을 사용하는 기법을 사용하면 어떤 애플리케이션의 상태라도 모의로 테스트 할 수 있다.

이 기법의 예제는 Flux Chat 예제에 포함된 [UnreadThreadStore-test.js](https://github.com/facebook/flux/tree/master/examples/flux-chat/js/stores/__tests__/UnreadThreadStore-test.js) 에서 확인할 수 있다.

`mock` 프로퍼티의 모의 메소드에 대한 정보나 반환 값을 조작하는 방법을 Jest에서 어떻게 지원하는지에 대해 알고 싶다면 Jest 문서의 [mock functions](http://facebook.github.io/jest/docs/mock-functions.html)를 참고하자.


React에서 Store로 로직 옮기기
-------------------------

React 컴포넌트에 있는 겉보기엔 얌전한, 작은 로직 조각이 종종 유닛 테스트를 만드는 동안 문제를 만든다. 테스트를 작성하게 되면 그 테스트가 애플리케이션의 행동에 대한 명세와 같이 작성되기를 원한다. 하지만 애플리케이션의 로직이 view 레이어에 포함되어 있다면 이 과정은 점점 어려워진다.

예를 들어, 사용자가 각각의 할 일 항목을 완료한 것으로 표시하게 될 때, TodoMVC 명세로서 "모든 할 일 항목을 완료로 표시" 체크박스의 상태를 자동으로 변경하도록 만들고자 한다. 이 로직을 만들 때 다음 MainSection의 `render()` 메소드처럼 코드를 작성하고 싶은 유혹에 빠진다:

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

이 예제 애플리케이션 로직은 쉽고 평범하게 처리할 수 있는 부분이지만 view에 포함되어 있으므로 TodoStore의 테스트에서 명세 스타일로 묘사할 수 없다. 이 로직을 store로 옮겨보자. 먼저 store에 퍼블릭 메소드를 생성해서 이 로직을 캡슐화한다:

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

이제 애플리케이션의 로직이 속한 대로 다음 테스트를 작성할 수 있다:

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

마지막으로 view 레이어를 수정한다. 데이터를 controller-view인 TodoApp.js에서 불러 MainSection 컴포넌트로 흘려보낸다.

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
   *  TodoStore에서 온, '변경' 이벤트를 위한 이벤트 핸들러
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});
```

그리고 체크박스를 표시하기 위한 프로퍼티로 사용한다.

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

React 컴포넌트 자체를 테스트하는 방법을 배우려면 [React를 위한 Jest 튜토리얼](http://facebook.github.io/jest/docs/tutorial-react.html)과 [ReactTestUtils 문서](http://facebook.github.io/react/docs/test-utils.html)를 참고한다.


더 읽을 거리
---------

- [Mocks Aren't Stubs](http://martinfowler.com/articles/mocksArentStubs.html) by Martin Fowler
- [Jest API Reference](http://facebook.github.io/jest/docs/api.html)
