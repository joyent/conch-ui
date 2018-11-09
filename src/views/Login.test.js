/* global describe, it, expect */
import m from "mithril";
import stream from "mithril/stream";
import { tidy } from "mithril-jest";

import LoginView from "views/Login";

describe("Login component", () => {
	it("default title should contain 'Login'", () => {
        const Login = new LoginView();
		const cmp = m(Login);
		const html = tidy(cmp);
		expect(html).toContain("Login");
		expect(html).toMatchSnapshot();
	});
});
