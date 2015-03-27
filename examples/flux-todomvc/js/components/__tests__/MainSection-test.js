
/*
 * MainSection-test
 */

jest.dontMock('../MainSection.react.js');
jest.dontMock('object-assign');
jest.dontMock('react/addons');

describe('MainSection', function(){

  var TodoConstants = require('../../constants/TodoConstants'),
      TodoStore = require('../../stores/TodoStore'),
      TodoActions,
      React,
      TestUtils,
      mixedTodoProps,
      TodoItem,
      MainSection,
      mainSection;


  beforeEach(function(){
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    MainSection = require('../MainSection.react.js');
    mixedTodoProps = {
      1: {
        complete: false,
        id: '1',
        text: "I'm an incompleted todo!"
      },
      2: {
        complete: true,
        id: '2',
        text: "I'm a completed todo!"
      },
    };
  });

  describe('mainSection', function(){
    beforeEach(function(){
      TodoActions = require('../../actions/TodoActions.js');
    });

    describe('toggleAll checkbox onChange', function(){
      var toggleAll;

      beforeEach(function(){
        mainSection = TestUtils.renderIntoDocument(
          React.createElement(MainSection, {allTodos: mixedTodoProps, areAllComplete: false})
        );
        toggleAll = TestUtils.findRenderedDOMComponentWithTag(mainSection, 'input');
        TestUtils.Simulate.change(toggleAll);
      });

      it('call TodoActions.toggleCompleteAll', function(){
        expect(TodoActions.toggleCompleteAll).toBeCalled();
      });
    });

    describe('renders TodoItems', function(){
      beforeEach(function(){
        TodoItem = require('../TodoItem.react.js');
        mainSection = TestUtils.renderIntoDocument(
          React.createElement(MainSection, {allTodos: mixedTodoProps, areAllComplete: false})
        );
      });

      // Mocked child components are not formally rendered, so instead, this indirectly tests that
      // TodoItem is called for however many todo items are present, and checks that they are
      // called with the correct todo props.
      it('calls TodoItem with props.allTodos[x]', function(){
        var allTodosIds = Object.keys(mainSection.props.allTodos);
        for(var i=0; i < allTodosIds.length; i++){
          expect(TodoItem.mock.calls[i][0].todo).toEqual(mixedTodoProps[allTodosIds[i]]);
        }
      });
    });
  });
});
