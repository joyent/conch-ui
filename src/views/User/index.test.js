/* global describe, it, expect */
import m from "mithril";
import { tidy } from "mithril-jest";

import UserView from "views/User";

jest.mock("util/Request");

describe("UserView component", () => {
	it("by default renders a default page", () => {
		const User = new UserView();
		const cmp = m(User);
		const html = tidy(cmp);
		// The following test is automatically generated (https://jestjs.io/docs/en/snapshot-testing#inline-snapshots)
		// Please use `npx jest -u` to update it rather than hand-editing it
		expect(html).toMatchInlineSnapshot(`
"<section class=\\"hero is-primary welcome is-small is-bold\\">
  <div class=\\"hero-body\\">
    <h1 class=\\"title\\">
      User profile
    </h1>
    <h2 class=\\"subtitle\\">
      Update password and profile settings
    </h2>
  </div>
</section>
<section class=\\"info-tiles\\">
  <div class=\\"tile\\"></div>
  <div class=\\"tile is-ancestor\\">
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <p class=\\"Title\\">
          New Password
        </p>
        <form>
          <input type=\\"password\\" placeholder=\\"New Password\\" class=
          \\"input is-small\\"><button type=\\"submit\\" class=
          \\"button is-primary\\">Save</button>
        </form>
      </article>
    </div>
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\"></article>
    </div>
  </div>
</section>
"
`);
	});
});
