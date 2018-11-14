/* global describe, it, expect */
import m from "mithril";
import stream from "mithril/stream";
import { tidy } from "mithril-jest";

import StatusView from "views/Status";

jest.mock("util/Request");

describe("Status component", () => {
	it("default renders a default page", () => {
		const Status = new StatusView();
		const currentWorkspace = stream({
			name: "Applejack"
		});
		const cmp = m(Status, { currentWorkspace });
		const html = tidy(cmp);
        expect(html).toContain("Applejack");
		// The following test is automatically generated (https://jestjs.io/docs/en/snapshot-testing#inline-snapshots)
		// Please use `npx jest -u` to update it rather than hand-editing it
		expect(html).toMatchSnapshot();
	});
});
