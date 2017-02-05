'use strict';

const qs = require('querystring');
let cacheBust = 1;

// This method will call window.postMessage if available, setting the
// targetOrigin parameter to the base of the targetURL parameter for maximum
// security in browsers that support it. If window.postMessage is not available,
// the target window's location.hash will be used to pass the message. If an
// object is passed as the message param, it will be serialized into a string
// using the querystring module "stringify" method.
//
// Usage:
//
// > methodPostMessage( message, targetURL [, target ] );
//
// Arguments:
//
//  message - (String) A message to be passed to the other frame.
//  message - (Object) An object to be serialized into a params string.
//  targetURL - (String) The URL of the other frame this window is
//    attempting to communicate with. This must be the exact URL (including
//    any query string) of the other window for this script to work in
//    browsers that don't support window.postMessage.
//  target - (Object) A reference to the other frame this window is
//    attempting to communicate with. If omitted, defaults to `parent`.
//
// Returns:
//
//  Nothing.
module.exports = ( message, targetURL, target ) => {

	if ( !targetURL ) {
		return;
	}

	// Serialize the message if not a string.
	message = typeof message === 'string' ? message : qs.stringify(message);

	// Default to parent if unspecified.
	target = target || parent;

	if ( window.postMessage ) {
		// The browser supports window.postMessage, so call it with a targetOrigin
		// set appropriately, based on the targetURL parameter.
		target.postMessage(message, targetURL.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));
	} else if ( targetURL ) {
		// The browser does not support window.postMessage, so set the location
		// of the target to targetURL#message. A bit ugly, but it works! A cache
		// bust parameter is added to ensure that repeat messages trigger the
		// callback.
		target.location = `${targetURL.replace( /#.*$/, '' )}#${(Number(new Date())) + (cacheBust++)}&${message}`;
	}
};
