/*
 * TodoTextInput-test
 */

jest.dontMock('../TodoTextInput.react.js');
jest.dontMock('react/addons');

describe('TodoTextInput', function(){
  var React,
      TestUtils,
      TodoTextInput,
      todoTextInput,
      input,
      onSaveMock;

  beforeEach(function(){
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    TodoTextInput = require('../TodoTextInput.react.js');
    onSaveMock = jest.genMockFunction();
    todoTextInput = TestUtils.renderIntoDocument(
      React.createElement(TodoTextInput, {
        className: 'Text Input Class',
        id: 'Text Input id',
        placeholder: 'Text input placeHolder',
        onSave: onSaveMock,
        value: 'Text Input Value'
      })
    );

    input = TestUtils.findRenderedDOMComponentWithTag(todoTextInput, 'input');
  });

  describe('onChange event', function(){
    it('changes the state.value to the event.target.value', function(){
      TestUtils.Simulate.change(input, { target: { value: 'Changed Value' } });
      expect(todoTextInput.state.value).toBe('Changed Value');
    });
  });

  describe('onBlur event', function(){
    beforeEach(function(){
      TestUtils.Simulate.blur(input);
    });

    it('calls props.onSave', function(){
      expect(onSaveMock).toBeCalled();
    });

    it('sets state.value to and empty String', function(){
      expect(todoTextInput.state.value).toBe('');
    });
  });

  describe('onKeyDown event', function(){
    var ENTER_KEY_CODE = 13;
    describe('when key 13 (enter) is pressed', function(){
      beforeEach(function(){
        TestUtils.Simulate.keyDown(input, { keyCode: ENTER_KEY_CODE });
      });

      it('calls props.onSave', function(){
        expect(onSaveMock).toBeCalled();
      });

      it('sets state.value to an empty String', function(){
        expect(todoTextInput.state.value).toBe('');
      });
    });

    describe('when key 13 (enter) is not pressed', function(){
      beforeEach(function(){
        TestUtils.Simulate.keyDown(input);
      });

      it('does not modify state.value', function(){
        expect(todoTextInput.state.value).toBe('Text Input Value');
      });

      it('does not call props.onSave if key 13 (enter) is not pressed', function(){
        expect(onSaveMock).not.toBeCalled();
      });
    });
  });
});

