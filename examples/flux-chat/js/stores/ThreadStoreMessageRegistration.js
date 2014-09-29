/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @jsx React.DOM
 */

/* This code cannot into ThreadStore.js due because that would create a circular dependency between MessageStore
   and ThreadStore. */

var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ThreadStore = require('../stores/ThreadStore');
var MessageStore = require('../stores/MessageStore');
var ChatConstants = require('../constants/ChatConstants');
var ActionTypes = ChatConstants.ActionTypes;

ThreadStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      ThreadStore.threadSelected(action.threadID);
      ThreadStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      ThreadStore.init(action.rawMessages);
      ThreadStore.emitChange();
      break;

    case ActionTypes.CREATE_MESSAGE:
      ChatAppDispatcher.waitFor([MessageStore.dispatchToken]);
      var currentThreadMessages = MessageStore.getAllForCurrentThread();
      var lastMessage = currentThreadMessages[currentThreadMessages.length - 1];
      ThreadStore.setLastMessageOnCurrentThread(lastMessage);
      ThreadStore.emitChange();
    default:
    // do nothing
  }
});

