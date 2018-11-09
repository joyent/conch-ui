/* global describe, it, expect */
import m from "mithril";
import { tidy } from "mithril-jest";

import LoginView from "views/Login";

jest.mock("util/Request");

describe("Login component", () => {
	it("default renders a default page", () => {
		const Login = new LoginView();
		const cmp = m(Login);
		const html = tidy(cmp);
		// The following test is automatically generated (https://jestjs.io/docs/en/snapshot-testing#inline-snapshots)
		// Please use `npx jest -u` to update it rather than hand-editing it
		expect(html).toMatchInlineSnapshot(`
"<section class=\\"hero is-fullheight\\">
  <div class=\\"hero-body\\">
    <div class=\\"container has-text-centered\\">
      <div class=\\"column is-4 is-offset-4\\">
        <div class=\\"box\\">
          <h3 class=\\"title\\">
            Login to Conch
          </h3>
          <form>
            <div class=\\"field\\">
              <div class=\\"control\\">
                <input type=\\"email\\" placeholder=\\"Email address\\"
                class=\\"input is-info is-fullwidth is-rounded\\">
              </div>
            </div>
            <div class=\\"field\\">
              <div class=\\"control\\">
                <input type=\\"password\\" placeholder=\\"Password\\"
                class=\\"input is-info is-fullwidth is-rounded\\">
              </div>
            </div><button type=\\"submit\\" class=
            \\"button is-primary is-fullwidth\\">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
"
`);
	});
});
