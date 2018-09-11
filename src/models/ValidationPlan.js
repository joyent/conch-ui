// src/models/ValidationPlan.js

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default () => {
	const r = new Request();

	return {
		get() {
			return r.requestWithToken({
				method: "GET",
				url: "/validation_plan"
			});
		}
	};
};
