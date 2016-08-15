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
import { Map, List } from 'immutable';
import ActionTypes from './ThreadActionTypes';
import MessageActionTypes from '../message/MessageActionTypes';

class ThreadListStore extends ReduceStore {
  getInitialState() {
    return new Map();
  }

  getThread(id) {
    return this.getState().get(id);
  }

  getUnreadCount() {
    return this.getState().count(v => !v.isRead);
  }

  reduce(threads, action) {
    switch (action.type) {
    case ActionTypes.THREAD_SELECTED:
      return threads.setIn([action.thread.id, 'isRead'], true);

    case ActionTypes.THREADS_LOADED:
      const loadedThreads = action.threads.toMap()
        .mapKeys((index, thread) => thread.id);
      return threads.merge(loadedThreads);

    case MessageActionTypes.MESSAGE_CREATED:
      return threads.mergeIn([action.message.threadId], {
        lastMessage: action.message.text,
        timestamp: action.message.timestamp
      });

    default:
      return threads;
    }
  }
}

export default new ThreadListStore(Dispatcher);
