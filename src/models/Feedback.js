import m from "mithril";
import { conch_host } from "config";

const Feedback = {
	text: "",
	sendFeedback(subject, message, next) {
		return m
			.request({
				method: "POST",
				url: `${conchApi}/feedback`,
				withCredentials: true,
				data: { subject, message }
			})
			.then(data => {
				next(data);
			})
			.catch(e => {
				console.log("An error fired: ");
				console.log(e);
			});
	},
	sendUserFeedback(text, next) {
		return this.sendFeedback("Conch User Feedback", text, next);
	}
};

export default Feedback;
