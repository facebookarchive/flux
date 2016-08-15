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
 */

import Dispatcher from '../core/AppDispatcher';
import ActionTypes from './MessageActionTypes';
import Message from './MessageRecord';

export function createMessage(text, threadId, authorName) {
  // Please don't do this in your projects.
  // This is used for example purpose only
  const messageId = `m${Math.random()}`;
  const timestamp = Date.now();

  Dispatcher.dispatch({
    type: ActionTypes.MESSAGE_CREATED,
    message: new Message({
      id: messageId,
      threadId,
      authorName,
      timestamp,
      text
    })
  });
}

export function updateMessageBuffer(text, threadId) {
  Dispatcher.dispatch({
    type: ActionTypes.MESSAGE_BUFFER_UPDATED,
    text,
    threadId
  });
}

export function loadMessages(messages) {
  Dispatcher.dispatch({
    type: ActionTypes.MESSAGES_LOADED,
    messages: messages.map(data => new Message(data))
  });
}
