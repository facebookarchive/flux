jest.dontMock('../Footer.react.js');
jest.dontMock('object-assign');
jest.dontMock('react/addons');

describe('Footer', function(){

  var TodoConstants = require('../../constants/TodoConstants'),
      TodoActions,
      React,
      TestUtils,
      Footer,
      incompletedTodoProps,
      completedTodoProps,
      mixedTodoProps,
      footer;

  beforeEach(function(){
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Footer = require('../Footer.react.js');
    incompletedTodoProps = {
      1: {
        complete: false,
        id: '1',
        text: "I'm an incompleted todo!"
      },
      2: {
        complete: false,
        id: '2',
        text: "I'm an another incompleted todo!"
      },
    };
    completedTodoProps = {
      1: {
        complete: true,
        id: '1',
        text: "I'm a completed todo!"
      },
      2: {
        complete: true,
        id: '2',
        text: "I'm an another completed todo!"
      },
    };
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

  describe('clearCompletedButton', function(){
    var clearCompletedButton;
    describe('when there are completed Todos present', function(){
      beforeEach(function(){
        footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, { allTodos: completedTodoProps })
        );
        clearCompletedButton = TestUtils.scryRenderedDOMComponentsWithTag(footer, 'button')[0];
      });

      it('renders the clearCompletedButton element on the DOM', function(){
        expect(clearCompletedButton).toBeTruthy();
        expect(clearCompletedButton.props.id).toBe('clear-completed');
      });

      describe('onClick', function(){
        beforeEach(function(){
          TodoActions = require('../../actions/TodoActions.js');
          TestUtils.Simulate.click(clearCompletedButton);
        });

        it('calls TodoActions.destroyCompleted', function(){
          expect(TodoActions.destroyCompleted).toBeCalled();
        });
      });
    });

    describe('When there are no completed Todos present', function(){
      beforeEach(function(){
        footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, { allTodos: incompletedTodoProps })
        );
        clearCompletedButton = TestUtils.scryRenderedDOMComponentsWithTag(footer, 'button')[0];
      });

      it('does not render the clearCompletedButton element on the DOM', function(){
        expect(clearCompletedButton).toBeFalsy();
      });
    });
  });
});
