/*
 * TodoItem-test
 */

jest.dontMock('../TodoItem.react.js');
jest.dontMock('object-assign');
jest.dontMock('react/addons');

describe('TodoItem', function(){

  var TodoConstants = require('../../constants/TodoConstants'),
      TodoActions,
      React,
      TestUtils,
      TodoItem,
      item;

  beforeEach(function(){
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    TodoItem = require('../TodoItem.react.js');
    item = TestUtils.renderIntoDocument(
      React.createElement(TodoItem, {
        todo: {
          complete: false,
          id: '1',
          text: "I'm a todo!"
        }
      })
    );
  });

  it('has an initial state.isEditing of false', function(){
    expect(item.state.isEditing).toBe(false);
  });

  describe('label onDoubleClick', function(){
    var label;
    beforeEach(function(){
      label = TestUtils.findRenderedDOMComponentWithTag(item, 'label');
      TestUtils.Simulate.doubleClick(label);
    });
    it ('changes state.isEditing to true', function(){
      expect(item.state.isEditing).toBe(true);
    });
  });

  describe('button onClick', function(){
    var button;
    beforeEach(function(){
      TodoActions = require('../../actions/TodoActions'),
      button = TestUtils.findRenderedDOMComponentWithTag(item, 'button');
      TestUtils.Simulate.click(button);
    })

    it('calls TodoActions.destroy with the todo id', function(){
      expect(TodoActions.destroy).toBeCalledWith(item.props.todo.id);
    });
  });

  describe('checkbox onChange', function(){
    var checkbox;
    beforeEach(function(){
      TodoActions = require('../../actions/TodoActions');
      checkbox = TestUtils.findRenderedDOMComponentWithClass(item, 'toggle');
      TestUtils.Simulate.change(checkbox);
    });

    it('calls TodoActions.toggleComplete with prop.todo', function(){
      expect(TodoActions.toggleComplete).toBeCalledWith(item.props.todo);
    });
  });

  describe('li className', function(){
    var li;

    describe('for a completed Todo (state.complete === true)', function(){
      beforeEach(function(){
        completedItem = TestUtils.renderIntoDocument(
          React.createElement(TodoItem, {
            todo: {
              complete: true,
              id: '2',
              text: "I'm a c todo!"
            }
          })
        );
      });

      describe('while not editing (state.isEditing !== true)', function(){
        beforeEach(function(){
          li = TestUtils.findRenderedDOMComponentWithTag(completedItem, 'li');
        });

        it("has a className containing 'completed'", function(){
          expect(li.props.className).toContain('completed');
        });

        it('does not have a className containing "editing"', function(){
          expect(li.props.className).not.toContain('editing');
        });
      });

      describe('while editing (state.isEditing === true)', function(){
        beforeEach(function(){
          completedItem.setState({isEditing: true});
          li = TestUtils.findRenderedDOMComponentWithTag(completedItem, 'li');
        });

        it("has a className containing 'completed'", function(){
          expect(li.props.className).toContain('completed');
        });

        it("has a className containing 'editing'", function(){
          expect(li.props.className).toContain('editing');
        });
      });
    });

    describe('for an incomplete Todo (state.complete !== true)', function(){
      describe('while editing (state.isEditing === true)', function(){
        beforeEach(function(){
          item.setState({isEditing: true});
          li = TestUtils.findRenderedDOMComponentWithTag(item, 'li');
        });

        it("has a className containing 'completed'", function(){
          expect(li.props.className).not.toContain('completed');
        });

        it("has a className containing 'editing'", function(){
          expect(li.props.className).toContain('editing');
        });
      });

      describe('while not editing (stating.isEditing !== true)', function(){
        beforeEach(function(){
          li = TestUtils.findRenderedDOMComponentWithTag(item, 'li');
        });

        it('does not have a className containing "editing"', function(){
          expect(li.props.className).not.toContain('editing');
        });

        it('does not have a className containing "completed"', function(){
          expect(li.props.className).not.toContain('completed');
        });
      });
    });
  });
});
