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

var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatWebAPIUtils = require('../utils/ChatWebAPIUtils');
var ChatMessageUtils = require('../utils/ChatMessageUtils');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  createMessage: function(text, currentThreadID) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CREATE_MESSAGE,
      text: text,
      currentThreadID: currentThreadID
    });
    var message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID);
    ChatWebAPIUtils.createMessage(message);
  }

};
