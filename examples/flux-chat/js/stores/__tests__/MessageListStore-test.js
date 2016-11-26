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

import MessageListStore from '../MessageListStore';
import { Map } from 'immutable';

describe('MessageListStore', () => {
  it('should return all messages by thread ID', () => {
    const initialState = new Map([
      ['m1', { id: 'm1', threadId: 't1' }],
      ['m2', { id: 'm2', threadId: 't1' }],
      ['m3', { id: 'm3', threadId: 't2' }],
    ]);
    const mockGetState = jest.fn().mockReturnValue(initialState);

    MessageListStore.getState = mockGetState;

    const messagesByThread = MessageListStore.getMessagesByThread('t1');

    expect([...messagesByThread.keys()]).toEqual(['m1', 'm2']);
  });
});
