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

import ThreadListStore from '../ThreadListStore';
import ActionTypes from '../../actions/ThreadActionTypes';
import MessageActionTypes from '../../actions/MessageActionTypes';
import Thread from '../../records/ThreadRecord';
import { Map, Record } from 'immutable';

describe('ThreadListStore', () => {
  it('should return the count of unread threads', () => {
    const initialState = new Map([
      ['t1', { id: 't1', isRead: false }],
      ['t2', { id: 't2', isRead: false }],
      ['t3', { id: 't3', isRead: true }],
    ]);
    const mockGetState = jest.fn().mockReturnValue(initialState);

    ThreadListStore.getState = mockGetState;

    const unreadThreadsCount = ThreadListStore.getUnreadCount();

    expect(unreadThreadsCount).toBe(2);
  });

  it('should mark threads as read', () => {
    const initialState = new Map([
      ['t1', new Thread({ id: 't1', isRead: false })],
      ['t2', new Thread({ id: 't2', isRead: false })]
    ]);
    const action = { type: ActionTypes.THREAD_SELECTED, thread: { id: 't1' } };

    const newState = ThreadListStore.reduce(initialState, action);

    expect(newState.getIn(['t1', 'isRead'])).toBe(true);
  });

  it('should updated last message info when new message is created', () => {
    const initialState = new Map([
      ['t1', new Thread({ id: 't1' })]
    ]);
    const action = { type: MessageActionTypes.MESSAGE_CREATED, message: {
      threadId: 't1',
      text: 'test message',
      timestamp: '2000/01/01 00:00:00'
    } };

    const newState = ThreadListStore.reduce(initialState, action);

    expect(newState.getIn(['t1', 'lastMessage'])).toBe('test message');
  });
});
