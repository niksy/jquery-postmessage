'use strict';

const $ = require('jquery');
const send = require('../../../../post-message.js');
const receive = require('../../../../receive-message.js');

// Keep track of the iframe height.
let ifHeight;

// Pass the parent page URL into the Iframe in a meaningful way (this URL could be
// passed via query string or hard coded into the child page, it depends on your needs).
const src = `http://localhost:9001/basic/iframe/#${encodeURIComponent(document.location.href)}`;

// Append the Iframe into the DOM.
const iframe = $(`<iframe " src="${src}" width="700" height="1000" scrolling="no" frameborder="0"></iframe>`).appendTo('#iframe');

// Setup a callback to handle the dispatched MessageEvent event. In cases where
// window.postMessage is supported, the passed event will have .data, .origin and
// .source properties. Otherwise, this will only have the .data property.
receive(( e ) => {
	// Get the height from the passsed data.
	const h = Number(e.data.replace(/.*ifHeight=(\d+)(?:&|$)/, '$1'));
	if (!isNaN(h) && h > 0 && h !== ifHeight) {
		// Height has changed, update the iframe.
		iframe.height(ifHeight = h);
	}
	// An optional origin URL (Ignored where window.postMessage is unsupported).
}, 'http://localhost:9001');

// And for good measure, let's send a toggle_content message to the child.
$('<a href="#">Show / hide Iframe content</a>').appendTo('#nav').click(() => {
	send('toggle_content', src, iframe.get(0).contentWindow);
	return false;
});
