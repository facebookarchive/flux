/*
 * TodoItem-test
 */

jest.dontMock('../TodoItem.react.js');
jest.dontMock('object-assign');

describe('TodoItem', function(){
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

  var TodoConstants = require('../../constants/TodoConstants'),
      AppDispatcher,
      TodoItem,
      item,
      label;

  beforeEach(function(){
    item = TestUtils.renderIntoDocument(
      // <TodoItem complete=false id='1' text="I'm a Todo" />
      React.createElement(TodoItem, {
        complete: false,
        id: '1',
        text: "I'm a todo!"
      })
    );
    label = TestUtils.findRenderedDOMComponentWithTag(item, 'label');
  });

  it('has a default isEditing state of false', function(){
    expect(item.state.isEditing).toBe(true)
  })
  describe('onDoubleClick', function(){
    it ('changes the isEditing state to true', function(){
      TestUtils.simulate.doubleClick(label)
      expect(item.state.isEditing).toBe(false)
    });
  });
});
