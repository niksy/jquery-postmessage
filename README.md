# postmessage

Simple and easy window.postMessage communication.

This module is the same as [jquery-postmessage][jquery-postmessage], but it’s transferred to CommonJS so it can be easily used with tools like Browserify or Webpack.

## Install

```sh
npm install @niksy/postmessage --save
```

## Usage

```js
const pm = require('@niksy/postmessage');

pm.receiveMessage(( e ) => {
	alert(e.data);
}, 'http://rj3.net');

pm.postMessage('hello world', 'http://benalman.com/test.html', parent);
```

Or, as separate modules:

```js
const send = require('@niksy/postmessage/dist/post-message');
const receive = require('@niksy/postmessage/dist/receive-message');

receive(( e ) => {
	alert(e.data);
}, 'http://rj3.net');

send('hello world', 'http://benalman.com/test.html', parent);
```

## API

### pm.postMessage(message, targetURL [, target ])

Returns: `Mixed`

This method will call window.postMessage if available, setting the
targetOrigin parameter to the base of the targetURL parameter for maximum
security in browsers that support it. If window.postMessage is not available,
the target window's location.hash will be used to pass the message. If an
object is passed as the message param, it will be serialized into a string
using the querystring module "stringify" method.

#### message

Type: `String|Object`

If string, a message to be passed to the other frame.

If object, an object to be serialized into a params string.

#### targetURL

Type: `String`

The URL of the other frame this window is
attempting to communicate with. This must be the exact URL (including
any query string) of the other window for this script to work in
browsers that don't support window.postMessage.

##### target

Type: `Object`

A reference to the other frame this window is
attempting to communicate with. If omitted, defaults to `parent`.

### pm.receiveMessage(callback [, sourceOrigin ] [, delay ])

Returns: `Mixed`

Register a single callback for either a window.postMessage call, if
supported, or if unsupported, for any change in the current window
location.hash. If window.postMessage is supported and sourceOrigin is
specified, the source window will be checked against this for maximum
security. If window.postMessage is unsupported, a polling loop will be
started to watch for changes to the location.hash.

Note that for simplicity's sake, only a single callback can be registered
at one time. Passing no params will unbind this event (or stop the polling
loop), and calling this method a second time with another callback will
unbind the event (or stop the polling loop) first, before binding the new
callback.

Also note that if window.postMessage is available, the optional
sourceOrigin param will be used to test the event.origin property. From
the MDC window.postMessage docs: This string is the concatenation of the
protocol and "://", the host name if one exists, and ":" followed by a port
number if a port is present and differs from the default port for the given
protocol. Examples of typical origins are https://example.org (implying
port 443), http://example.net (implying port 80), and http://example.com:8080.

#### callback

Type: `Function`

This callback will execute whenever a <methodPostMessage>
message is received, provided the sourceOrigin matches. If callback is
omitted, any existing receiveMessage event bind or polling loop will be
canceled.

#### sourceOrigin

Type: `String|Function`

If string, If window.postMessage is available and this value
is not equal to the event.origin property, the callback will not be
called.

If function, If window.postMessage is available and this
function returns false when passed the event.origin property, the
callback will not be called.

##### delay

Type: `Number`

An optional zero-or-greater delay in milliseconds at
which the polling loop will execute (for browser that don't support
window.postMessage). If omitted, defaults to 100.

## Differences with original module

* Dependancy on jQuery is removed
* There is no standalone version available, so don’t rely on `$.postMessage` and `$.receiveMessage` to be available

## Test

For manual tests, run `npm run test:manual:local` and open <http://localhost:9000/> in your browser.

## Browser support

Tested in IE9+ and all modern browsers.

## License

**Original module license:** Copyright (c) 2009 "Cowboy" Ben Alman (Dual licensed under the MIT and GPL licenses. http://benalman.com/about/license/)  
**This module license:** MIT © [Ivan Nikolić](http://ivannikolic.com)

[jquery-postmessage]: http://benalman.com/projects/jquery-postmessage-plugin/
