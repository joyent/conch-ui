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
		expect(html).toMatchInlineSnapshot(`
"<section class=\\"hero is-primary welcome is-small is-bold\\">
  <div class=\\"hero-body\\">
    <h1 class=\\"title\\">
      Applejack workspace status
    </h1>
    <h2 class=\\"subtitle\\">
      Overview of workspace build progress
    </h2>
  </div>
</section>
<section class=\\"info-tiles\\">
  <div class=\\"tile is-ancestor has-text-centered\\">
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <progress value=\\"0\\" max=\\"100\\" class=
        \\"progress is-info\\">0%</progress>
      </article>
    </div>
  </div>
  <div class=\\"tile is-ancestor has-text-centered\\">
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <div class=\\"spinner\\"></div>
      </article>
    </div>
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <div class=\\"spinner\\"></div>
      </article>
    </div>
  </div>
  <div class=\\"tile is-ancestor has-text-centered\\">
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <div style=\\"background-color: rgba(71, 155, 232, 0.4);\\"
        class=\\"box\\">
          <div class=\\"spinner\\"></div>
        </div>
      </article>
    </div>
    <div class=\\"tile is-parent\\">
      <article class=\\"tile is-child box\\">
        <div style=\\"background-color: rgba(71, 155, 232, 0.4);\\"
        class=\\"box\\">
          <div class=\\"spinner\\"></div>
        </div>
      </article>
    </div>
  </div>
</section>
"
`);
	});
});
