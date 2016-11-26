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

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import ThreadList from '../components/ThreadList.react';
import ThreadListStore from '../stores/ThreadListStore';
import ActiveThreadStore from '../stores/ActiveThreadStore';
import { selectThread } from '../actions/ThreadActions';

class ThreadSection extends Component {
  static getStores() {
    return [ThreadListStore, ActiveThreadStore];
  }

  static calculateState() {
    return {
      threads: ThreadListStore.getState(),
      activeThreadId: ActiveThreadStore.getThreadId(),
      unreadCount: ThreadListStore.getUnreadCount()
    };
  }

  render() {
    return (
      <section className="thread-section">
        <p className="thread-count">
          {this.state.unreadCount > 0 &&
            <span>Unread threads: {this.state.unreadCount}</span>}
        </p>

        <ThreadList
          threads={this.state.threads}
          activeThreadId={this.state.activeThreadId}
          onThreadSelect={selectThread} />
      </section>
    );
  }
}

export default Container.create(ThreadSection);
