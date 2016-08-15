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

class MessageBufferStore extends ReduceStore {
  getInitialState() {
    return new Map();
  }

  getBufferByThread(id) {
    return this.getState().get(id);
  }

  reduce(buffers, action) {
    switch (action.type) {
    case ActionTypes.MESSAGE_BUFFER_UPDATED:
      return buffers.set(action.threadId, action.text);

    case ActionTypes.MESSAGE_CREATED:
      return buffers.set(action.message.threadId, '');

    default:
      return buffers;
    }
  }
}

export default new MessageBufferStore(Dispatcher);
