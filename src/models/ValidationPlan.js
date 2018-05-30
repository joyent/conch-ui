import m from "mithril";
import { conchApi } from "config";

const ValidationPlan = {
	list: [],
	idToName: {},
	load() {
		return m
			.request({
				method: "get",
				withCredentials: true,
				url: `${conchApi}/validation_plan`
			})
			.then(validations => {
				ValidationPlan.list = validations;
				ValidationPlan.idToName = validations.reduce(
					(acc, { id, name }) => {
						acc[id] = name;
						return acc;
					},
					{}
				);
			});
	}
};

export default ValidationPlan;
