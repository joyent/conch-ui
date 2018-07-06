import m from "mithril";
import stream from "mithril/stream";

const Progress = () => {
	let totalStorage = 0;
	let targetStorage = 0;
	let storagePercentage = 0;

	let totalAmps = 0;
	let targetAmps = 0;
	let ampPercentage = 0;
	const percentage = (total, target) =>
		total > target
			? 101 /* over 100 to display full red bar */
			: target > 0
				? total / target * 100
				: 0;
	return {
		oninit: ({ attrs: { racks, targetTBs, maxAmps } }) => {
			// when the target and rack streams streams change, recalculate and
			// redraw the progress bars
			stream.merge([racks, targetTBs, maxAmps]).map(() => {
				totalStorage = racks().length * 40;
				targetStorage = targetTBs() ? targetTBs() : 0;
				storagePercentage = percentage(totalStorage, targetStorage);

				totalAmps = racks().length * 60;
				targetAmps = maxAmps() ? maxAmps() : 0;
				ampPercentage = percentage(totalAmps, targetAmps);
				m.redraw();
			});
		},
		view: () => {
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
