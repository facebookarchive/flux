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

jest.disableAutomock();

import MessageBufferStore from '../MessageBufferStore';
import ActionTypes from '../MessageActionTypes';
import { Map } from 'immutable';

describe('MessageBufferStore', () => {
  it('should clear the buffer when new message is created', () => {
    const initialState = new Map({ t1: 'hello' });
    const action = { type: ActionTypes.MESSAGE_CREATED, message: { threadId: 't1' } };

    const newState = MessageBufferStore.reduce(initialState, action);

    expect(newState.toJS()).toEqual({ t1: '' });
  });
});
