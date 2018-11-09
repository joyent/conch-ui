/* global describe, it, expect */
import m from "mithril";
import { tidy } from "mithril-jest";

import Navigator from "Navigator";
import LoginView from "views/Login";

jest.mock("util/Request");

describe("Login component", () => {
	it("default renders a default page", () => {
		const update = jest.fn();
		const navigator = new Navigator(update);
		const Login = new LoginView({ navigator, update });
		const cmp = m(Login);
		const html = tidy(cmp);
		// The following test is automatically generated (https://jestjs.io/docs/en/snapshot-testing#inline-snapshots)
		// Please use `npx jest -u` to update it rather than hand-editing it
		expect(html).toMatchInlineSnapshot(`
"<section class=\\"hero is-fullheight\\">
  <div class=
  \\"hero-body container has-text-centered column is-4 is-offset-4\\">
    <div class=\\"box\\">
      <h3 class=\\"title\\">
        Login to Conch
      </h3>
      <form>
        <div class=\\"field\\">
          <div class=\\"control\\">
            <input type=\\"email\\" placeholder=\\"Email address\\" class=
            \\"input is-info is-fullwidth is-rounded\\">
          </div>
        </div>
        <div class=\\"field\\">
          <div class=\\"control\\">
            <input type=\\"password\\" placeholder=\\"Password\\" class=
            \\"input is-info is-fullwidth is-rounded\\">
          </div>
        </div><button type=\\"submit\\" class=
        \\"button is-primary is-fullwidth\\">Login</button>
      </form>
    </div>
  </div>
</section>
"
`);
	});

/*
	it("behaves the way we expect", () => {
        // mock our update stream
		const update = jest.fn();

		const navigator = new Navigator(update);
		const Login = new LoginView({ navigator, update });


        // mock our event class, and the DOM target
        const add = jest.fn();
        const remove = jest.fn();
		const e = { preventDefault: jest.fn(), target: { classList: { add, remove } } };

        // pass in some default data
		Login.emailAddress("chris.prather@joyent.com");
		Login.password("NewPassword");

        // now try triggering a login
		Login.actions.login(e);

        // we expect it to have tried stopping the normal event flow
        expect(e.preventDefault).toHaveBeenCalled();

        // then we expect it to try adding the is-loading class
        expect(add).toHaveBeenCalled();

        // remove the is-loading class
        expect(remove).toHaveBeenCalled();

        // upadte the model
        expect(update).toHaveBeenCalled();
	});
*/

});
