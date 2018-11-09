/* global describe, it, expect */
import m from "mithril";
import stream from "mithril/stream";
import { tidy } from "mithril-jest";

import Navigator from "Navigator";
import LoginView from "views/Login";

describe("Login component", () => {
    const update = stream();
    const navigator = new Navigator(update);
	it("default title should be 'Page'", () => {
        const Login = new LoginView({navigator, update});
		const cmp = m(Login);
		const html = tidy(cmp);
		expect(html).toContain("Login");
		expect(html).toMatchSnapshot();
	});
});
