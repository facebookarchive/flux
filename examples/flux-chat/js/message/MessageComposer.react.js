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
import ActiveThreadStore from '../thread/ActiveThreadStore';
import MessageBufferStore from './MessageBufferStore';
import { createMessage, updateMessageBuffer } from './MessageActions';

const ENTER_KEY_CODE = 13;

class MessageComposer extends Component {
  static getStores() {
    return [ActiveThreadStore, MessageBufferStore];
  }

  static calculateState() {
    const threadId = ActiveThreadStore.getThreadId();
    const buffer = MessageBufferStore.getBufferByThread(threadId);

    return { threadId, buffer };
  }

  handleOnChange(event) {
    const text = event.target.value;
    const threadId = this.state.threadId;

    updateMessageBuffer(text, threadId);
  }

  handleKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      const text = this.state.buffer.trim();
      const threadId = this.state.threadId;

      event.preventDefault();

      createMessage(text, threadId, this.props.authorName);
    }
  }

  render() {
    return (
      <textarea
        className="message-composer"
        name="message"
        value={this.state.buffer}
        autoFocus={true}
        onChange={(event) => this.handleOnChange(event)}
        onKeyDown={(event) => this.handleKeyDown(event)} />
    );
  }
}

export default Container.create(MessageComposer, { withProps: true });
