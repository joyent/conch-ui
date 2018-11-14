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
		expect(html).toMatchSnapshot();
	});
});
