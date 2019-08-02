Created: 2018-05-13

Updated: 2019-03-29

---

Conch UI Design Document
========================

This document is intended to capture communicate design and development
decisions related to the Conch UI. It should be updated whenever new decisions
are implemented. In addition, learning resources and examples should be
provided to help developers new to the project get up to speed.

---

* [Project Goals](#project-goals)
* [Important Dependencies and Libraries](#important-dependencies-and-libraries)
* [Additional Notes about Library decisions](#additional-notes-about-library-decisions)
* [Code Examples](#code-examples)
  * [Vue.js Single File Component (SFC)](#vue.js-single-file-component-(sfc))
  * [Vuex](#vuex)
  * [Vue Router](#vue-router)
  * [Jest and Vue Test Utils](#jest-and-vue-test-utils)
  * [Ajax Requests using Axios](#ajax-requests-using-axios)

Project Goals
-------------

The primary goal of this project is to increase adoption and use of Conch.
Conch could provide a platform for managing and validating datacenter resources
without a user interface. We have [an excellent CLI tool for working with
Conch](https://github.com/joyent/conch-shell) that can largely do everything
the UI can and more. However, a well-designed visual tool is convincing and
inviting to most humans. We need to build a great platform and we need to get
people to use it. These goals are related but separate, and people must
willfully adopt Conch to be successful.

Our goals for the Conch UI are:

1. Giving the user the information they want as quickly and with as few clicks as
   possible. Optimize for straightforward, quick information retrieval.
2. Visual "prettiness" is not everything, but a little goes a long way to
   attract and delight people. Make it well-designed and use visual elements
   effectively.
3. Working well and with consistency. A broken tool is worse than no tool at all.

Important Dependencies and Libraries
------------------------------------

* [Axios](https://github.com/axios/axios): A Promise based HTTP client for the browser
  and node.js.
* [Bulma](https://bulma.io): A free, open source CSS framework based
  on Flexbox with several helpful built-in components.
* [ES6 Syntax](https://es6-features.org): The ES6 standard syntax of JavaScript
  is used and preferred in this project. ES6 provides several syntactic
  improvements and eliminates the need for module libraries like RequireJS. As
  not all browsers support ES6 syntax, the source is transpiled with
  [Babel](http://babeljs.io) before distribution.
* [Jest](https://jestjs.io/): JavaScript testing framework. Similar to
  [Mocha](https://mochajs.org/), [Jasmine](https://jasmine.github.io/) and
  [Ava](https://github.com/avajs/ava).
* [Vue.js](https://vuejs.org/): Vue.js is a progressive framework for building
  user interfaces. Unlike other monolithic frameworks, Vue is designed from the
  ground up to be incrementally adoptable. The core library is focused on the view
  layer only, and is easy to pick up and integrate with other libraries or
  existing projects. On the other hand, Vue is also perfectly capable of powering
  sophisticated Single-Page Applications when used in combination with modern tooling
  and supporting libraries.
* [Vue Router](https://router.vuejs.org/): Vue Router is the official router for
  Vue.js. It deeply integrates with Vue.js core.
* [Vue Test Utils](https://vue-test-utils.vuejs.org/): Vue Test Utils is the
  official unit testing utility library for Vue.js. Used in conjunction with Jest.
* [Vuex](https://vuex.vuejs.org/): Vuex is a state management pattern + library
  for Vue.js applications. It serves as a centralized store for all the components
  in an application, with rules ensuring that the state can only be mutated in a
  predictable fashion. It also integrates with Vue's official devtools extension to
  provide advanced features such as zero-config time-travel debugging and state
  snapshot export / import.
* [Webpack](https://webpack.js.org) Web asset build tool and bundler. Webpack
  transpiles, bundles, and compresses all source code and static assets. It
  generates everything needed to serve the website into a single directory. In
  addition, it provides a hot-reloading development webserver to speed
  develop-test-view cycles.
* [Yarn](https://yarnpkg.com): Dependency management and build tool.

Code Examples
=============

Vue.js Single File Component (SFC)
----------------------------------

* [Official Single File Component Documentation](https://vuejs.org/v2/guide/single-file-components.html)

A simple Todo component. During the `mounted` lifecycle hook, the todos are loaded from
the '/todos' API using Axios. The computed properties compute different values from the
todo data, which are then displayed in the template.

```html
<template>
    <div class="todo-list">
        <h1 class="list-title">{{ title }}</h1>
        <div class="completed-todos">
            Completed Todos: {{ completeTodosCount }}
        </div>
        <div class="todos">
            <ul>
                <li v-for="(todo, index) in incompleteTodos" :key="todo.id">
                    <h3 class="todo-title">{{ todo.title }}</h3>
                    <p class="todo-description">{{ todo.description }}</p>
                    <button
                        class="button is-primary"
                        @click="completeTodo(index)"
                    >
                        Complete
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
          type: String,
          required: true,
        },
    },
    data: {
        todos: [],
    },
    methods: {
        completeTodo(index) {
            this.todos[index].status = 'complete';
        },
    },
    computed: {
        completeTodosCount() {
            return todos.filter(todo => {
                return todo.status === 'complete';
            }).length;
        },
        incompleteTodos() {
            return todos.filter(todo => {
                return todo.status === 'incomplete';
            });
        },
    },
    mounted: {
        axios.get('/todos')
            .then(response => {
                this.todos = response;
            });
    },
};
</script>
```

**Note:** The `title` prop would be passed into the Todo component using the following syntax:

```html
<TodoList :title="My Todo List" />
```

Vuex
----

* [Official Vuex documentation](https://vuex.vuejs.org/guide/)

A Vuex store is built using 4 different components:

* Actions
* Getters
* Mutations
* State

### state.js

```javascript
export const state = {
    users: [
        {
            id: 1,
            name: 'user1',
            role: 'user',
        },
        {
            id: 2,
            name: 'admin1',
            role: 'admin',
        },
    ],
};

export default { state };
```

### actions.js

```javascript
export const addUser = ({ commit }, user) => {
    commit('addUser', user);
};

export default { addUser };
```

### mutations.js

```javascript
export const addUser = (state, user) => {
    state.users.push(user);
};

export default { addUser };
```

### getters.js

```javascript
export const adminUsers = (state) => {
    return state.users.filter(user => user.role === 'admin');
};

export default { adminUsers };
```

### store.js

```javascript
import Vue from 'vue';
import Vuex from 'vuex';

import actions from '@store/actions';
import getters from '@store/getters';
import mutations from '@store/mutations';
import { state } from '@store/state';

Vue.use(Vuex);

export default new Vuex.Store({ actions, getters, mutations, state });
```

### Usage in a Single File Component

```html
<template>
    <div class="admin-users">
        <h1 class="title">Admins</h1>
        <ul>
            <li v-for="admin in adminUsers">{{ admin.name }}</li>
        </ul>
    </div>
</template>

<!-- Example 1 -->
<script>
export default {
    computed {
        adminUsers() {
            return this.$store.getters.getAdminUsers();
        },
    },
};
</script>
<!-- End Example 1 -->

<!-- Example 2 -->
<script>
export default {
    computed {
        ...mapGetters([
            'adminUsers',
        ]);
    },
};
</script>
<!-- End Example 2 -->
```

Vue Router
----------

* [Official Vue Router Documentation](https://router.vuejs.org/guide/#html)

The two main ways currently used to programmatically navigate are:

1. Using a named route

    ```javascript
    router.push({ name: 'user', params: { userId: '123' } });
    ```

2. Writing the route explicitly

    ```javascript
    router.push({ path: `user/${userId}` });
    ```

An example of a simple router could look like this:

```javascript
// Vue.js-related requirements
import Vue from 'vue';
import Router from 'vue-router';

// Components to be loaded by router
import SignIn from '@src/views/SignIn/SignIn.vue';
import UserProfile from '@src/views/UserProfile/UserProfile.vue';
import Navbar from '@src/views/Navbar/Navbar.vue';
import Sidebar from '@src/views/Sidebar/Sidebar.vue';
import PageNotFound from '@src/views/PageNotFound/PageNotFound.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'signIn',
            component: SignIn,
        },
        {
            path: '/user/:id',
            name: 'user',
            components: {
                default: UserProfile,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/*',
            name: '404',
            component: PageNotFound,
        },
    ];
});
```

Jest and Vue Test Utils
-----------------------

* [Official Jest Documentation](https://jestjs.io/docs/en/getting-started.html)
* [Official Vue Test Utils Documentation](https://vue-test-utils.vuejs.org/guides/getting-started.html)

This is an example of how to use Jest and Vue Test Utils together.

The `shallowMount` from Vue Test Utils mounts the component passed in
and stubs any child components to help simplify the test. We can then
use `wrapper` to manipulate the DOM. Jest is the test runner and has
an assertion library and code coverage built-in. See the `jest` related
commands in the `scripts` section of `package.json` for more information.

```javascript
import UserProfile from '@src/views/UserProfile/UserProfile.vue';
import { shallowMount } from '@vue/test-utils';

describe('UserProfile.vue', () => {
    let methods;
    let wrapper;

    beforeEach(() => {
        methods = { savePassword: jest.fn() };
        wrapper = shallowMount(UserProfile, { methods });
    });

    test('should call the savePassword method when a valid password is entered', () => {
        wrapper.find('input.password').setValue('myPassword');
        wrapper.find('button.save').trigger('click');

        expect(methods.savePassword).toHaveBeenCalled();
    });
});

```

Ajax Requests and using Axios directly
-------------------------

* [Official Axios Documentation](https://github.com/axios/axios#axios)

**Note:** We currently use request fucntions to handle authentication tokens, headers etc,
which then use axios to send the request. These functions should be used rather than using
axios directly to ensure the right data is being included in ajax requests.

Here's an example:

```javascript
export const updatePassword = (password) => {
    return requestWithToken({
        method: 'POST',
        url: '/user/me/password',
        data: { password }
    });
};
```

In this example, we use the `requestWithToken` function, which will then use Axios after setting
the appropriate data for the ajax request.

There are a few different ways to use Axios directly:

1. Pass all the relevant config to Axios:

    ```javascript
    axios({
        method: 'get',
        url: '/user/12345/name'
    });

    axios({
        method: 'post',
        url: '/user/12345/name',
        data: {
            firstName: 'user',
            lastName: 'name',
        }
    });
    ```

2. Use the relevant Axios method

    ```javascript
    axios.get('/user/12345/name');

    axios.post('/user/12345/name', {
        firstName: 'user',
        lastName: 'name'
    });
    ```
