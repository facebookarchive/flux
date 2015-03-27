/*
 * TodoItem-test
 */

jest.dontMock('../TodoItem.react.js');
jest.dontMock('object-assign');
jest.dontMock('react/addons');
describe('TodoItem', function(){

  var TodoConstants = require('../../constants/TodoConstants'),
      React,
      TestUtils,
      TodoItem,
      item,
      label;

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
    label = TestUtils.findRenderedDOMComponentWithTag(item, 'label');
  });

  it('has an initial state.isEditing of false', function(){
    expect(item.state.isEditing).toBe(false)
  })

  describe('onDoubleClick', function(){
    it ('changes state.isEditing to true', function(){
      TestUtils.Simulate.doubleClick(label)
      expect(item.state.isEditing).toBe(true)
    });
  });
});
