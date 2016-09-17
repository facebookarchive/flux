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

import React from 'react';

export default function MessageList({ messages }) {
  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <ul className="message-list">
      {sortedMessages.map((message, id) => (
        <MessageListItem
          key={id}
          message={message} />
      ))}
    </ul>
  );
}

function MessageListItem({ message }) {
  return (
    <li className="message-list-item">
      <h5 className="message-author-name">
        {message.authorName}
      </h5>

      <time className="message-time">
        {message.timestamp.toLocaleTimeString()}
      </time>

      <p className="message-text">
        {message.text}
      </p>
    </li>
  );
}
