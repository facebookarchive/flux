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

import Dispatcher from '../ChatAppDispatcher';
import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';
import ActionTypes from '../actions/ThreadActionTypes';

class ActiveThreadStore extends ReduceStore {
  getInitialState() {
    return new Map({
      threadId: null
    });
  }

  getThreadId() {
    return this.getState().get('threadId');
  }

  reduce(state, action) {
    switch (action.type) {
    case ActionTypes.THREAD_SELECTED:
      return state.set('threadId', action.thread.id);

    case ActionTypes.THREADS_LOADED:
      const thread = action.threads.first();
      return thread ? state.set('threadId', thread.id) : state;

    default:
      return state;
    }
  }
}

export default new ActiveThreadStore(Dispatcher);
