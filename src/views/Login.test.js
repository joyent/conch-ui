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
		expect(html).toMatchSnapshot();
	});
});
