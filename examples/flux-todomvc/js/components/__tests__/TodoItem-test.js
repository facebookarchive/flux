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
    TodoItem = require('../TodoItem.react.js')
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
    expect(item.state.isEditing).toBe(false)
  })

  describe('label onDoubleClick', function(){
    var label;
    beforeEach(function(){
      label = TestUtils.findRenderedDOMComponentWithTag(item, 'label');
      TestUtils.Simulate.doubleClick(label)
    })
    it ('changes state.isEditing to true', function(){
      expect(item.state.isEditing).toBe(true)
    });
  });

  describe('button onClick', function(){
    var button;
    beforeEach(function(){
      TodoActions = require('../../actions/TodoActions'),
      button = TestUtils.findRenderedDOMComponentWithTag(item, 'button');
      TestUtils.Simulate.click(button)
    })

    it('calls TodoActions.destroy with the todo id', function(){
      expect(TodoActions.destroy).toBeCalledWith(item.props.todo.id)
    })
  })
});
