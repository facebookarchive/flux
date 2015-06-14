---
id: overview-ko-KR
title: 개요
layout: docs
category: Quick Start
permalink: docs/overview-ko-KR.html
next: todo-list-ko-KR
lang: ko-KR
---

Flux는 Facebook에서 클라이언트-사이드 웹 애플리케이션을 만드는 데 사용하는 애플리케이션 아키텍처다. 단방향 데이터 흐름을 활용해 뷰 컴포넌트를 구성하는 React를 보완하는 역할을 한다. 이전까지의 프레임워크와는 달리 패턴과 같은 모습을 하고 있으므로 수많은 새로운 코드를 작성할 필요 없이 바로 Flux를 이용해 사용할 수 있다.

<figure class="video-container disassociated-with-next-sibling">
  <iframe src="//www.youtube.com/embed/nYkdrAPrdcw?list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v&start=621" frameborder="0" allowfullscreen></iframe>
</figure>

Flux 애플리케이션은 다음 핵심적인 세 가지 부분으로 구성되어 있다: Dispatcher, Stores, Views(React 컴포넌트). Model-View-Controller와 혼동해서는 안 된다. Controller도 물론 Flux 애플리케이션에 존재하지만, 위계의 최상위에서 controller-views - views 관계로 존재하고 있다. 이 controller-views는 stores에서 데이터를 가져와 그 데이터를 자식에게 보내는 역할을 한다. 덧붙여 dispatcher를 돕는 action creator 메소드는 이 애플리케이션에서 가능한 모든 변화를 표현하는 유의적 API를 지원하는 데 사용된다. Flux 업데이트 주기의 4번째 부분이라고 생각하면 유용하다.

Flux는 MVC와 다르게 단방향으로 데이터가 흐른다. React view에서 사용자가 상호작용을 할 때, 그 view는 중앙의 dispatcher를 통해 action을 전파하게 된다. 애플리케이션의 데이터와 비즈니스 로직을 가지고 있는 store는 action이 전파되면 이 action에 영향이 있는 모든 view를 갱신한다. 이 방식은 특히 React의 선언형 프로그래밍 스타일 즉, view가 어떤 방식으로 갱신해야 하는지 일일이 작성하지 않고서도 데이터를 변경할 수 있는 형태에서 편리하다.

이 프로젝트는 파생되는 데이터를 올바르게 다루기 위해 시작되었다. 예를 들면 현재 뷰에서 읽지 않은 메시지가 강조되어 있으면서도 읽지 않은 메시지 수를 상단 바에 표시하고 싶었다. 이런 부분은 MVC에서 다루기 어려운데, 메시지를 읽기 위한 단일 스레드에서 메시지 스레드 모델을 갱신해야 하고 동시에 읽지 않은 메시지 수 모델을 갱신 해야 하기 때문이다. 대형 MVC 애플리케이션에서 종종 나타나는 데이터 간의 의존성과 연쇄적인 갱신은 뒤얽힌 데이터 흐름을 만들고 예측할 수 없는 결과로 이끌게 된다.

Flux는 store를 이용해 제어를 뒤집었다. 일관성을 유지한다는 명목으로 외부의 갱신에 의존하는 방식과 달리 Store는 갱신을 받아들이고 적절하게 조화한다. Store 바깥에 아무것도 두지 않는 방식으로 데이터의 도메인을 관리해야 할 필요가 없어져 외부의 갱신에 따른 문제를 명확하게 분리할 수 있도록 돕는다. Store는 독립적인 세계를 가지고 있어 `setAsRead()`와 같은 직접적인 setter 메소드가 없는 대신 dispatcher에 등록한 콜백을 통해 데이터를 받게 된다.

## 구조와 데이터 흐름

<p class="associated-with-next-sibling">
Flux 애플리케이션에서의 데이터는 단방향으로 흐른다:
</p>

<figure class="diagram associated-with-next-sibling">
  <img src="/flux/img/flux-simple-f8-diagram-1300w.png" alt="Flux에서의 단방향 데이터 흐름" />
</figure>

단방향 데이터 흐름은 Flux 패턴의 핵심인데 위 다이어그램은 __Flux 프로그래머를 위한 제일의 멘탈 모델__이 된다. dispatcher, store와 view는 독립적인 노드로 입력과 출력이 완전히 구분된다. action은 새로운 데이터를 포함하고 있는 간단한 객체로 _type_ 프로퍼티로 구분할 수 있다.

<p class="associated-with-next-sibling">
view는 사용자의 상호작용에 응답하기 위해 새로운 action을 만들어 시스템에 전파한다:
</p>

<figure class="diagram">
  <img src="/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png" alt="사용자 상호작용에 따른 Flux의 데이터 흐름" />
</figure>

<p class="associated-with-next-sibling">
모든 데이터는 중앙 허브인 dispatcher를 통해 흐른다. action은 dispatcher에게 <em>action creator</em> 메소드를 제공하는데 대부분의 action은 view에서의 사용자 상호작용에서 발생한다. dispatcher는 store를 등록하기 위한 콜백을 실행한 이후에 action을 모든 store로 전달한다. store는 등록된 콜백을 활용해 관리하고 있는 상태 중 어떤 액션이라도 관련이 있다면 전달해준다. store는 <em>change</em> 이벤트를 controller-views에게 알려주고 그 결과로 데이터 계층에서의 변화가 일어난다. Controller-views는 이 이벤트를 듣고 있다가 이벤트 핸들러가 있는 store에서 데이터를 다시 가져온다. controller-views는 자신의 <code>setState()</code> 메소드를 호출하고 컴포넌트 트리에 속해 있는 자식 노드 모두를 다시 렌더링하게 한다.
</p>

<figure class="diagram">
  <img src="/flux/img/flux-simple-f8-diagram-explained-1300w.png" alt="flux 데이터 흐름의 각각 순서에서 다양하게 전달되는 데이터" />
</figure>

Action creator는 라이브러리에서 제공하는 도움 메소드로 메소드 파라미터에서 action을 생성하고 _type_을 설정하거나 dispatcher에게 제공하는 역할을 한다.

모든 action은 store가 dispatcher에 등록해둔 callback을 통해 모든 store에 전송된다.

action에 대한 응답으로 store가 스스로 갱신을 한 다음에는 자신이 변경되었다고 모두에게 알린다.

controller-view라고 불리는 특별한 view가 변경 이벤트를 듣고 새로운 데이터를 store에서 가져온 후 모든 트리에 있는 자식 view에게 새로운 데이터를 제공한다.

이 구조는 함수형 반응 프로그래밍을 다시 재현하는 것을 쉽게 만들거나 데이터-흐름 프로그래밍, 흐름 기반 프로그래밍을 만드는데 쉽도록 돕는다. 애플리케이션에 흐르는 데이터 흐름이 양방향 바인딩이 아닌 단방향으로 흐르기 때문이다. 애플리케이션의 상태는 store에 의해서 관리되고 애플리케이션의 다른 부분과는 완전히 분리된 상태로 남는다. 두 store 사이에 의존성이 나타나도 둘은 엄격하게 위계가 관리되어 dispatcher에 의해 동기적으로 변경되는 방법으로 관리된다.

이와 같은 구조는 우리의 애플리케이션이 _함수형 반응 프로그래밍(functional reactive programming)_이나 더 세부적으로 _데이터-흐름 프로그래밍(data-flow programming)_ 또는 _흐름 기반 프로그래밍(Flow-based programming)_을 연상하게 한다는 사실을 쉽게 떠올리게 한다. 즉 데이터의 흐름이 양방향 바인딩이 아닌 단일 방향으로 흐른다. 애플리케이션의 상태는 store에 의해 관리를 해서 애플리케이션의 다른 부분들과 결합도를 극히 낮춘 상태로 유지될 수 있다. store의 사이에서 의존성이 생긴다고 해도 dispachter에 의해 엄격한 위계가 유지되어 동기적으로 갱신되는 방식으로 관리된다.

양방향 데이터 바인딩은 연속적인 갱신이 발생하고 객체 하나의 변경이 다른 객체를 변경하게 되어 실제 필요한 업데이트보다 더 많은 분량을 실행하게 된다. 애플리케이션의 규모가 커지면 데이터의 연속적인 갱신이 되는 상황에서는 사용자 상호작용의 결과가 어떤 변화를 만드는지 예측하는데 어려워진다. 갱신으로 인한 데이터 변경이 단 한 차례만 이뤄진다면 전체 시스템은 좀 더 예측 가능하게 된다.

Flux의 다양한 부분을 확인할 예정인데 dispatcher부터 살펴보자.

### 단일 dispatcher

dispatcher는 Flux 애플리케이션의 중앙 허브로 모든 데이터의 흐름을 관리한다. 본질적으로 store의 콜백을 등록하는 데 쓰이고 action을 store에 배분해주는 간단한 작동 방식으로 그 자체가 특별하게 똑똑한 것은 아니다. 각각의 store를 직접 등록하고 콜백을 제공한다. action creator가 새로운 action이 있다고 dispatcher에게 알려주면 애플리케이션에 있는 모든 store는 해당 action을 앞서 등록한 callback으로 전달받는다.

애플리케이션의 규모가 커지게 되면 dispachter의 역할은 더욱 필수적이다. 바로 store 간에 의존성을 특정적인 순서로 callback을 실행하는 과정으로 관리하기 때문이다. Store는 다른 store의 업데이트가 끝날 때까지 선언적으로 기다릴 수 있고 끝나는 순서에 따라 스스로 갱신된다.

Facebook이 실제로 사용하는 dispatcher는 [npm](https://www.npmjs.com/package/flux), [Bower](http://bower.io/), 또는 [GitHub](https://github.com/facebook/flux)에서 확인할 수 있다.

### Stores

Store는 애플리케이션의 상태와 로직을 포함하고 있다. store의 역할은 전통적인 MVC의 모델과 비슷하지만 많은 객체의 상태를 관리할 수 있는데 ORM 모델이 하는 것처럼 단일 레코드의 데이터를 표현하는 것도 아니고 Backbone의 컬렉션과도 다르다. store는 단순히 ORM 스타일의 객체 컬렉션을 관리하는 것을 넘어 애플리케이션 내의 개별적인 __도메인__에서 애플리케이션의 상태를 관리한다.

예를 들면, Facebook의 [돌아보기 편집기](https://facebook.com/lookback/edit) 에서 지속해서 재생된 시간과 플레이어 상태를 지속해서 추적하기 위해 TimeStore를 활용한다. 같은 애플리케이션에서 ImageStore는 이미지 콜랙션을 지속해서 추적한다. [TodoMVC 예제](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/)의 TodoStore도 비슷하게 할 일 항목의 콜랙션을 관리한다. store는 두 모델 컬렉션의 특징을 보여주는 것과 동시에 싱글턴 모델의 논리적 도메인으로 역할을 한다.

위에서 언급한 것과 같이 store는 자신을 dispatcher에 등록하고 callback을 제공한다. 이 callback은 action을 파라미터로 받는다. store의 등록된 callback의 내부에서는 switch문을 사용한 action 타입을 활용해서 action을 해석하고 store 내부 메소드에 적절하게 연결될 수 있는 훅을 제공한다. 여기서 결과적으로 action은 disaptcher를 통해 store의 상태를 갱신한다. store가 업데이트된 후, 상태가 변경되었다는 이벤트를 중계하는 과정으로 view에게 새로운 상태를 보내주고 view 스스로 업데이트하게 한다.

### Views와 Controller-Views

React는 조화롭고 자유로운 형태로 다시 렌더링 할 수 있는 view를 view 레이어로 제공한다. 복잡한 view 위계의 상위를 살펴보면 store에 의해 이벤트를 중계할 수 있는 특별한 종류의 view가 있다. 이 view를 controller-view라고 부르는데 store에서 데이터를 얻을 수 있는 glue 코드를 제공하고 데이터를 위계대로 자식들에게 전달하도록 돕는다. 페이지의 광범위한 영역을 관리하는 contoller-view를 가지게 된다.

store에게 이벤트를 받으면 store의 퍼블릭 getter 메소드를 통해 새로 필요한 데이터를 처음으로 요청하게 된다. 그 과정에서 `setState()` 또는 `forceUpdate()` 메소드를 호출하게 되고 그 호출 과정에서 자체의 `render()` 메소드와 하위 모든 자식의 `render()` 메소드를 실행한다.

전체적인 store의 상태를 단일 객체로 만들어 하위에 있는 view에 전달하게 되는데 다른 자식들도 필요한 부분이라면 데이터를 사용할 수 있도록 한다. 또한, controller-view는 위계의 최상위에서 마치 controller와 같은 역할을 지속해서 수행해 하위에 있는 view가 가능한 한 순수하게, 함수적으로 유지될 수 있도록 한다. 또한, store의 전체 상태를 단일 객체로 흘려보내는데 이 방식은 관리해야 하는 프로퍼티 수를 줄이는 효과도 있다.

때때로 컴포넌트의 단순함을 유지하기 위해 위계 깊은 곳에서 contoller-views가 추가로 필요할 때가 있다. 중간에 contoller-views를 넣으면 특정 데이터 도메인에 관계된 위계 영역을 감싸서 독립적으로 만드는데(encapsulate) 도움이 된다. 하지만 조심해야 한다. 위계 내에서 만든 controller-view는 단일의 데이터 흐름과 상충해 잠재적으로 새로운 데이터 흐름의 시작점에서 충돌할 수 있다.

내부에 controller-view를 추가하는 것을 결정할 때에는 여러 데이터 업데이트의 흐름이 위계와 다른 방향으로 흐르지 않도록 고려해 단순함의 균형을 유지해야 한다. 여러 데이터가 업데이트되면 이상한 효과를 만들어 React의 렌더링 메소드가 다른 controller-view에 의해 반복적으로 실행돼서 디버깅의 어려움을 가중할 가능성이 있다.
내부 controller-view를 만드는 것을 결정할 때, 데이터를 갱신하기 위해 위계에서 여러 방향으로 흐르는 복잡성에 반해 단순한 컴포넌트의 이점에서 균형을 찾아야 한다. 여러 방향으로의 데이터 갱신은 이상한 효과를 만들 수 있다. 특히 React의 렌더 메소드는 여러 controller-view를 갱신하기 위해 반복적으로 실행되어버려 디버깅의 어려움을 가중할 수도 있다.

### Actions

dispatcher는 action을 호출해 데이터를 불러오고 store로 전달할 수 있도록 메소드를 제공한다. action의 생성은 dispatcher로 action을 보낼 때 의미 있는 헬퍼 메소드로 포개진다. 할 일 목록 애플리케이션에서 할 일 아이템의 문구를 변경하고 싶다고 가정하자. `updateText(todoId, newText)`와 같은 함수 시그니처를 이용해 `TodoActions` 모듈 내에 action을 만든다. 이 메소드는 view의 이벤트 핸들러로부터 호출되어 실행할 수 있고 그 결과로 사용자 상호작용에 응답할 수 있게 된다. 이 action creator 메소드는 _type_을 추가할 수 있다. 이 type을 이용해 action이 store에서 해석될 수 있도록, 적절한 응답이 가능하도록 한다. 예시에서와같이 `TODO_UPDATE_TEXT`와 같은 이름의 타입을 사용한다.

action은 서버와 같은 다른 장소에서 올 수 있다. 예를 들면 data를 초기화할 때 이런 과정이 발생할 수 있다. 또한, 서버에서 에러 코드를 반환하거나 애플리케이션이 제공된 후에 업데이트가 있을 때 나타날 수 있다.


### Dispatcher에 대해서

앞서 언급한 것처럼 disaptcher는 store 간의 의존성을 관리할 수 있다. 이 기능은 dispatcher 클래스에 포함된 `waitFor()` 메소드를 통해 가능하다. [TodoMVC](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/)는 극단적으로 단순해서 이 메소드를 사용할 필요가 없지만 복잡한 대형 애플리케이션에서는 생명과도 같다.

TodoStore에 등록된 callback은 명시적으로 기다려 코드가 진행되는 동안 다른 의존성이 먼저 업데이트되도록 기다린다:

```javascript
case 'TODO_CREATE':
  Dispatcher.waitFor([
    PrependedTextStore.dispatchToken,
    YetAnotherStore.dispatchToken
  ]);

  TodoStore.create(PrependedTextStore.getText() + ' ' + action.text);
  break;
```

`waitFor()`는 단일 인수만 받는데 disaptcher에 등록된 인덱스를 배열로 받는다. 이 인덱스를 대개 _dispatch token_이라 부른다. 그러므로 `waitForm()`을 호출하는 store는 다른 store의 상태에 따라 어떤 방식으로 자신의 상태를 갱신할 수 있는지 알 수 있게 된다.

dispatch token은 `register()` 메소드에서 반환하는데 이 메소드는 callback을 dispatcher에 등록할 때 사용된다:

```javascript
PrependedTextStore.dispatchToken = Dispatcher.register(function (payload) {
  // ...
});
```

`waitFor()`, actions, action creator와 dispatcher에 대해서는 다음 [Flux 액션과 Dispatcher](http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html)를 참고하자.
