'use strict';

import Reflux from 'reflux';

var ChannelActions = Reflux.createActions([
  "reachedChannelStart",
  "channelInfoReceived",
  "loadMessages",
  "loadMoreMessages",
  "sendMessage",
  "removeMessage",
  "pinMessage",
  "unpinMessage",
  "addFile",
  "loadReplies",
  "loadPins",
  "loadPost",
  "loadFile",
  "loadDirectoryInfo",
  "setChannelMode",
  "channelModeUpdated"
]);

export default ChannelActions;
