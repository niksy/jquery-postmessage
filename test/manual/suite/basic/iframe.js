'use strict';

const $ = require('jquery');
const send = require('../../../../post-message.js');
const receive = require('../../../../receive-message.js');

// Get the parent page URL as it was passed in, for browsers that don't support
// window.postMessage (this URL could be hard-coded).
const parentURL = decodeURIComponent(document.location.hash.replace(/^#/, ''));

// The first param is serialized (if not a string) and passed to the
// parent window. If window.postMessage exists, the param is passed using that,
// otherwise it is passed in the location hash (that's why parentURL is required).
// The second param is the targetOrigin.
function setHeight () {
	send({
		ifHeight: $('body').outerHeight(true)
	}, parentURL, parent);
}

// Bind all this good stuff to a link, for maximum clickage.
const link = $('<a href="#">Show / hide content</a>').appendTo('#nav').click(() => {
	$('#toggle').toggle();
	setHeight();
	return false;
});

// Now that the DOM has been set up (and the height should be set) invoke setHeight.
setHeight();

// And for good measure, let's listen for a toggle_content message from the parent.
receive(( e ) => {
	if ( e.data === 'toggle_content' ) {
		link.triggerHandler('click');
	}
}, 'http://localhost:9000');
