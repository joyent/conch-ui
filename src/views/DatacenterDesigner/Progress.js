import m from "mithril";

const Progress = () => {
	return {
		view: ({ attrs: { boxes, targetTBs, maxAmps } }) => {
			let totalStorage = boxes.length * 40;
			let targetStorage = targetTBs() ? targetTBs() : 0;
			let storagePercentage =
				targetStorage > 0 ? totalStorage / targetStorage * 100 : 0;

			let totalAmps = boxes.length * 60;
			let targetAmps = maxAmps() ? maxAmps() : 0;
			let ampPercentage = maxAmps() ? totalAmps / targetAmps * 100 : 0;
			return [
				m(
					"p",
					`${totalStorage} of ${targetStorage} Terabytes Provisioned`
				),
				m(
					`progress.progress[value=${storagePercentage}][max=100]`,
					{
						class:
							storagePercentage > 100 ? "is-danger" : "is-info",
						style: "margin-bottom: 10px;"
					},
					`${storagePercentage}%`
				),
				m("p", `${totalAmps} of ${targetAmps} Amps Used`),
				m(
					`progress.progress[value=${ampPercentage}][max=100]`,
					{
						class: ampPercentage > 100 ? "is-danger" : "is-warning",
						style: "margin-bottom: 0px;"
					},
					`${ampPercentage}%`
				)
			];
		}
	};
};

export default Progress;
