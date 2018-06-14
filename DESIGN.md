Created: 2018-05-13

Updated: 2018-06-14

---

Conch UI Design Document
========================

This document is intended to capture communicate design and development
decisions related to the Conch UI. It should be updated whenever new decisions
are implemented. In addition, learning resources and examples should be
provided to help developers new to the project get up to speed.

Dependency and Library Decisions
--------------------

* [Yarn](https://yarnpkg.com): Dependency management and build tool. Yarn has
  been far less problematic than npm in prior experience. The yarn.lock file
  works well and 
* [ES6 Syntax](https://es6-features.org): The ES6 standard syntax of JavaScript
  is used and preferred in this project. ES6 provides several syntactic
  improvements and eliminates the need for module libraries like RequireJS. As
  not all browsers support ES6 syntax, the source is transpiled with
  [Babel](http://babeljs.io) before distribution.
* [Webpack](https://webpack.js.org) Web asset build tool and bundler. Webpack
  transpiles, bundles, and compresses all source code and static assets. It
  generates everything needed to serve the website into a single directory. In
  addition, it provides a hot-reloading development webserver to speed
  develop-test-view cycles.
* [Mithril.js](https://mithril.js.org): Single-Page Application (SPA)
  JavaScript framework. Mithril is much more minimal than other more popular
  SPA frameworks, like React, Ember, and Angular. While this means there's
  little to none in the way of "plug-ins" to bolt in features, this minimalism
  is a strength in that it's simply JavaScript with little in the way of
  'magic'. Some of the concepts might be unfamiliar to some used to
  manipulating the DOM with jQuery. Going through the helpful [Mithril
  tutorial](https://mithril.js.org/simple-application.html) and some [quick
  screencasts](https://scrimba.com/playlist/playlist-34) will help bring you up
  to speed.
* [Mithril Stream](https://mithril.js.org/stream.html): A "reactive stream"
  library, which we use for propagating and updating the application state.
  This library comes installed with Mithril (but must be imported separately).
  It's been good enough for our requirements so far. If we need something
  different, we might look at [flyd](https://github.com/paldepind/flyd) or
  another reactive framework.
* [Bulma](https://bulma.io): CSS framework based on flexbox with several
  helpful built-in components. It provides a good compromise between writing
  CSS ourselves and not looking like something out of a can (looking at you,
  Bootstrap).


Mithril
-------

### Resources for learning Mithril:

* [Start Here: Official Tutorial](https://mithril.js.org/simple-application.html)
* [Mithril screencasts](https://scrimba.com/playlist/playlist-34)
* [How to code X in mithril](https://github.com/osban/mithril-codex/blob/master/how2code.md). This demonstrates several simple examples using the 
* [Mithril Walkthrough by Auth0](https://auth0.com/blog/build-robust-apps-with-mithril-and-auth0/)
* [Thinking in React](https://reactjs.org/docs/thinking-in-react.html).
  React-specific, but good explanation of how to break down a page view into
  structured components
* [How I use Mithril](https://james-forbes.com/?/posts/how-i-use-mithril). A
  review of effective practices with Mithril.
* [Mithril Router cleanup](http://sagegerard.com/mithril-router-cleanup/). We a
  modified version of the technique described for our SPA routing. This is a
  good overview of how Mithril's routing works, along with how to build
  friendlier programming interfaces on top of Mithril.


### Component design

There's a couple of different ways to structure components in Mithril (you can
see a demonstration of each method in "[How to code X in
Mithril](https://github.com/osban/mithril-codex/blob/master/how2code.md)"). For
consistency, components will be written using one of the two methods:

* If the component manages **any** state, use a closure component.
* If the component does not manage state, you may use a POJO (Plain-Old Javascript Object) component

**Never** use `this` in components. `this` has too many pitfalls, even with the
added improvement of "lexical `this`" in ES6 arrow functions. Likewise, using
Mithril's `attrs.state` can also be fraught and adds excessive typing. Avoiding
`this` and `attrs.state` is the primary reason for using closure components
when the component manages state.

An example of a closure and POJO component:

```javascript
// Closure component
function ClosureComponent() {
	// state variables here
	const count = stream(0);

	// component definition
	return {
		view: ({ attrs: { title }) {
			return m(".container",
				m("h1", title),
				m(PojoComponent, { count : count }),
				m("button", {
					onclick: () {
						count( count() + 1 );
					}
				} )
			);
		}
	}


// POJO component
const PojoComponent {
	view: ({ attrs: { count } } ) {
		return m("h2", `count is ${count()}`);
	}
}
```


Styling and interaction
------------------------

Bulma is used for general styling of the web UI. To add styling to a mithril
vnode, use the CSS class syntax:

```javascript
m("p.is-size-2.is-text-weight-semibold.has-text-danger", "Big red text!");
```

It's common to need to adjust the styling to fit needs. New CSS
classes can be added to the SCSS files in `src/styles/main.scss`. It is also
perfectly acceptable to add or override CSS styles directly to on vnode using
the style attribute.

```javascript
m("button.button",
	{ style: "background: red; width: 100px;" },
	"Press me"
);
```

Against the preachings of  previous web UI eras, inline styles are fine and
good with virtual DOMs libraries. We should not delude ourselves that we are
separating concerns by strictly enforcing an artificial division between
CSS and Javascript/HTML. They are intrinsically linked. It is performant and
reasonable to specify styling with virtual nodes. Creating a dictionary of
classes is more harmful and confusing than setting the styles on the nodes they
need.

Do create CSS classes that maybe re-used for multiple components, and be
aware of the limitation that **inline styles cannot use responsive media
queries** to adjust parameters for different screen sizes and devices. Use
inline styling for small adjustments and overrides.

In general, all interaction should be implemented using Javascript and Mithril.
Do not use document queries like `document.querySelector()` or libraries like
jQuery. Do not assign IDs to vnodes. When you find solutions online using
document queries, figure out how to implement them properly with Mithril.
Document queries too often lead to hard-to-debug side effects and speghetti
code.


State and event management
-------------------------

State and event management is the single most challenging aspect of user
interface development. When a user clicks a button or provides input, how do you
propagate the actions to all necessary components that should update? If
the action sends a request to the API server, how do you make sure the data is
loaded in the right components?

There are a myriad of attempted solutions to this problem, including Flux/Redux,
RxJS, and various takes on Functional Reactive Programming (FRP). I've
evaluated many of them, and found them either heavy-handed or not appropriate
for Mithril's virtual DOM model (as mentioned, no document queries).

I've found the "reactive streams" concept to be a good middle-ground for
handling state and event management. I am not the first to think so, and
Mithril includes a lightweight stream library called "mithril-stream". There
are other, more feature-ful options like
[Flyd](https://github.com/paldepind/flyd) and
[Most.js](https://github.com/cujojs/most/) that may be needed later.
Mithril-stream has been satisfactory thus far.

[Documentation for mithril-stream can be found here.](https://mithril.js.org/stream.html)

### Stream concepts

Mithril-stream must be imported separately from Mithril.

```Javascript
import m from "mithril";
import stream from "mithril/stream";
```

Streams are created using the function `stream()`.

```javascript
const aStream = stream();
```

Streams may be provided an initial value.
```javascript
const myStream = stream('world');
```

The current value of the stream can be retrieved using the assigned name as a function.

```javascript
console.log(myStream()); // prints "hello"
```

The value of the stream is updated by providing a value to the function;
```
aStream(123)
console.log(aStream()); // prints "123"
```

Streams can depend on other streams, and are created with `.map()` and a
function transforming the source value.  When source streams are updated,
dependent streams update automatically with the new value from the source.

```javascript
const depStream = myStream.map( value => "hello " + value);
console.log(depStream()); // prints "hello world"

myStream("mars")
console.log(depStream()); // prints "hello mars"
```

You can create unassigned dependent streams that are useful for executing
side-effects (like requests) or debugging

```javascript
myStream.map( value => { console.log("myStream current value: " + value) });
```

Streams without initial values provide `null` when evaluated. Dependent streams
on streams without initial values will not execute until a value has been received

```javascript
const newStream = stream();
console.log(newStream()); // prints "null"

newStream.map(
	 // will not execute until newStream receives a value
	value => { console.log("newStream current value: " + value) }
);
```

Multiple streams can be combined using `stream.combine()`, a function taking
each stream as arguments, and a list of the combining streams.

```javascript
stream.combine(
	(stream1, stream2) => {
		//notice the execution of stream1 and stream2 as functions
		console.log("stream1: " + stream1() + ", stream2: " + stream2());
	}, [aStream, myStream]);
```

### Streams and Mithril

Streams work well together with Mithril. Streams can receive events using
Mithril's event handlers and `m.withAttr`. For example, here's a simple
component that takes a name in an input box and renders "Hello" and the
provided name:

```
const SayHelloComponent = () => {
	const nameText = stream("")

	return {
		view: () => [
			m("input[type=text]",
				{
					oninput: m.withAttr("value", nameText)
				}
			),
			m("h1", "Hello " + nameText())
		]
	};
}
```

State frequently needs to be shared by multiple components, so each component
can display or interact with the state. The best way to do this is to store
state in a stream, and pass the stream to each component as using Mithril's
attributes object. The stream should be created and managed by the
highest-level component and provided to each child. In this example, the
previous component is refactored into smaller components for component re-use
below:

```
const TextInput = {
	view: ( { attrs { textStream } }) => 
		m("input[type=text]",
			{
				oninput: m.withAttr("value", textStream)
			}
		)
};

const HelloTitle = {
	view: ( { attrs { textStream } }) => 
			m("h1", "Hello " + textStream())
};

const SayHelloComponent = () => {
	const nameText = stream("")

	return {
		view: () => [
			m(TextInput, { textStream: nameText }),
			m(HelloTitle, { textStream: nameText })
		]
	};
}
```

When the stream is updated in the `TextInput` component, the changes will be
propagated to `HelloTitle` component. Dependent streams can be used to
transform the input or trigger side-effects like requests.

### Resetting Streams

There is no way to reset Mithril streams, which is sometimes necessary (for
example, when switching workspaces on a view). Rather than requiring all of the
dependent streams to handle `null` or some kill-word, it can be enough to
create a new stream and assign it to the same variable (using `let` instead of
`const`). The garbage collector will clean up old dependent streams created in
components when they are recycled.


```
let resettingStream = stream('hello'); 

resettingStream.map( value => { console.log(value) });

resettingStream = stream(); // new stream, old stream no longer in scope

resettingStream('hola'); // will not cause old dependent stream to update and print

```
