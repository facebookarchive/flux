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
import cx from 'classnames';

export default function ThreadList({ threads, activeThreadId, onThreadSelect }) {
  const sortedThreads = threads.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <ul className="thread-list">
      {sortedThreads.map((thread, id) => (
        <ThreadListItem
          key={id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelect={onThreadSelect} />
      ))}
    </ul>
  );
}

function ThreadListItem({ thread, isActive, onSelect }) {
  return (
    <li
      className={cx({ 'thread-list-item': true, active: isActive })}
      onClick={() => onSelect(thread)}>
      <h5 className="thread-name">
        {thread.name}
      </h5>

      <time className="thread-time">
        {thread.timestamp.toLocaleTimeString()}
      </time>

      <p className="thread-last-message">
        {thread.lastMessage}
      </p>
    </li>
  );
}
