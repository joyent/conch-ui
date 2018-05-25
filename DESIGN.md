Created: 2018-05-13

Updated: 2018-05-25

---

Conch UI Design Document
========================

This document is intended to capture communicate design decisions related to
the Conch UI. It should be updated whenever new decisions impacting the design
are implemented. In addition, learning resources and examples should be
provided to help developers new to the project get up to speed.


Dependency and Library Decisions
--------------------

* [Yarn](https://yarnpkg.com): Dependency management and build tool. Yarn has
  been far less problematic than npm in prior experience. The yarn.lock file
  works well and 
* [ES6 Syntax](https://es6-features.org): The ES6 standard syntax of JavaScript
  is used and prefered in this project. ES6 provides several syntatic
  improvements and eliminates the need for module libraries like RequireJS. As
  not all browsers support ES6 syntax, the source is transpiled with
  [Babel](http://babeljs.io) before distribution.
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
* [Mithril Streams](https://mithril.js.org/stream.html): A "reactive stream"
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
* If the component does not manage state, it may use a POJO (Plain-Old Javascript Object) component

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
}

// POJO component
const PojoComponent {
	view: ({ attrs: { count } } ) {
		return m("h2", `count is ${count()}`);
	}
}
```

