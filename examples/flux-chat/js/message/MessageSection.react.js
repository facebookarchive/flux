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
import MessageList from './MessageList.react';
import MessageComposer from './MessageComposer.react';
import ActiveThreadStore from '../thread/ActiveThreadStore';
import ThreadListStore from '../thread/ThreadListStore';
import MessageListStore from './MessageListStore';

class MessageSection extends Component {
  static getStores() {
    return [ActiveThreadStore, ThreadListStore, MessageListStore];
  }

  static calculateState() {
    const activeThreadId = ActiveThreadStore.getThreadId();
    const messages = MessageListStore.getMessagesByThread(activeThreadId);
    const thread = ThreadListStore.getThread(activeThreadId);

    return { messages, thread };
  }

  render() {
    return (
      <section className="message-section">
        <h3 className="message-thread-heading">{this.state.thread.name}</h3>
        <MessageList messages={this.state.messages} />
        <MessageComposer authorName="Bill" />
      </section>
    );
  }
}

export default Container.create(MessageSection);
