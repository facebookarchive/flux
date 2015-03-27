
jest.dontMock('../TodoTextInput.react.js');
jest.dontMock('object-assign');
jest.dontMock('react/addons');
describe('TodoItem', function(){
  var TodoConstants = require('../../constants/TodoConstants'),
      React,
      TestUtils,
      TodoTextInput,
      inputComponent,
      input,
      onSaveMock;

  beforeEach(function(){
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    TodoTextInput = require('../TodoTextInput.react.js')
    onSaveMock = jest.genMockFunction()
    inputComponent = TestUtils.renderIntoDocument(
      React.createElement(TodoTextInput, {
          className: 'Text Input Class',
          id: 'Text Input id',
          placeholder: 'Text input placeHolder',
          onSave: onSaveMock,
          value: 'Text Input Value'
        })
    )

    input = TestUtils.findRenderedDOMComponentWithTag(inputComponent, 'input')
  })

  describe('onChange event', function(){
    it('changes the state.value to the event.target.value', function(){
      TestUtils.Simulate.change(input, { target: { value: 'Changed Value' } })
      expect(inputComponent.state.value).toBe('Changed Value')
    })
  })
})

