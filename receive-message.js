'use strict';

const FALSE = !1;
let intervalId, lastHash, rmCallback;

// Register a single callback for either a window.postMessage call, if
// supported, or if unsupported, for any change in the current window
// location.hash. If window.postMessage is supported and sourceOrigin is
// specified, the source window will be checked against this for maximum
// security. If window.postMessage is unsupported, a polling loop will be
// started to watch for changes to the location.hash.
//
// Note that for simplicity's sake, only a single callback can be registered
// at one time. Passing no params will unbind this event (or stop the polling
// loop), and calling this method a second time with another callback will
// unbind the event (or stop the polling loop) first, before binding the new
// callback.
//
// Also note that if window.postMessage is available, the optional
// sourceOrigin param will be used to test the event.origin property. From
// the MDC window.postMessage docs: This string is the concatenation of the
// protocol and "://", the host name if one exists, and ":" followed by a port
// number if a port is present and differs from the default port for the given
// protocol. Examples of typical origins are https://example.org (implying
// port 443), http://example.net (implying port 80), and http://example.com:8080.
//
// Usage:
//
// > methodReceiveMessage( callback [, sourceOrigin ] [, delay ] );
//
// Arguments:
//
//  callback - (Function) This callback will execute whenever a <methodPostMessage>
//    message is received, provided the sourceOrigin matches. If callback is
//    omitted, any existing receiveMessage event bind or polling loop will be
//    canceled.
//  sourceOrigin - (String) If window.postMessage is available and this value
//    is not equal to the event.origin property, the callback will not be
//    called.
//  sourceOrigin - (Function) If window.postMessage is available and this
//    function returns false when passed the event.origin property, the
//    callback will not be called.
//  delay - (Number) An optional zero-or-greater delay in milliseconds at
//    which the polling loop will execute (for browser that don't support
//    window.postMessage). If omitted, defaults to 100.
//
// Returns:
//
//  Nothing!
function methodReceiveMessage ( callback, sourceOrigin, delay ) {

	if ( window.postMessage ) {

		// Since the browser supports window.postMessage, the callback will be
		// bound to the actual event associated with window.postMessage.

		if ( callback ) {
			// Unbind an existing callback if it exists.
			if ( rmCallback ) {
				methodReceiveMessage();
			}

			// Bind the callback. A reference to the callback is stored for ease of
			// unbinding.
			rmCallback = ( e ) => {
				// Opera <10 uses event.domain and doesn't include the http:// prefix
				if ( e.domain ) {
					sourceOrigin = sourceOrigin.split('://')[1];
					e.origin = e.domain;
				}
				if ( (typeof sourceOrigin === 'string' && e.origin !== sourceOrigin) || ( typeof sourceOrigin === 'function' && sourceOrigin(e.origin) === FALSE ) ) {
					return FALSE;
				}
				callback(e);
			};
		}

		if ( window.addEventListener ) {
			window[callback ? 'addEventListener' : 'removeEventListener']('message', rmCallback, FALSE);
		} else {
			window[callback ? 'attachEvent' : 'detachEvent']('onmessage', rmCallback);
		}

	} else {
		// Since the browser sucks, a polling loop will be started, and the
		// callback will be called whenever the location.hash changes.

		if ( intervalId ) {
			clearInterval(intervalId);
		}
		intervalId = null;

		if ( callback ) {
			delay = typeof sourceOrigin === 'number' ? sourceOrigin : typeof delay === 'number' ? delay : 100; // eslint-disable-line no-nested-ternary
			intervalId = setInterval(() => {
				var hash = document.location.hash;
				var re = /^#?\d+&/;
				if ( hash !== lastHash && re.test(hash) ) {
					lastHash = hash;
					callback({
						data: hash.replace(re, '')
					});
				}
			}, delay);
		}
	}
}

module.exports = methodReceiveMessage;
