'use strict';

const _postMessage = require('./post-message');
const receiveMessage = require('./receive-message');

module.exports = {
	postMessage: _postMessage,
	receiveMessage: receiveMessage
};
