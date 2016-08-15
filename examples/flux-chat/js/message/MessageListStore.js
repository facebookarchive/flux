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
import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';
import ActionTypes from './MessageActionTypes';

class MessageListStore extends ReduceStore {
  getInitialState() {
    return new Map();
  }

  getMessagesByThread(id) {
    return this.getState().filter(message => message.threadId === id);
  }

  reduce(messages, action) {
    switch (action.type) {
    case ActionTypes.MESSAGE_CREATED:
      return messages.set(action.message.id, action.message);

    case ActionTypes.MESSAGES_LOADED:
      const loadedMessages = action.messages.toMap()
        .mapKeys((index, message) => message.id);
      return messages.merge(loadedMessages);

    default:
      return messages;
    }
  }
}

export default new MessageListStore(Dispatcher);
