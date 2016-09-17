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
import ActionTypes from './ThreadActionTypes';
import Thread from '../records/ThreadRecord';

export function selectThread(thread) {
  Dispatcher.dispatch({
    type: ActionTypes.THREAD_SELECTED,
    thread
  });
}

export function loadThreads(threads) {
  Dispatcher.dispatch({
    type: ActionTypes.THREADS_LOADED,
    threads: threads.map(data => new Thread(data))
  });
}
