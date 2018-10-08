import m from "mithril";

import Workspace from "models/Workspace";

import { Spinner } from "views/component";
import DeviceModal from "views/DeviceModal";
import StatusTilesComponent from "views/Status/StatusTiles";
import { ViewTitleHero } from "views/component/";

export default update => {
	const statusTiles = new StatusTilesComponent(update);
	return {
		name: "Status",
		layout: true,
		navigatingTo: ({ page, model }) => {
            if (!model.currentWorkspace) return Promise.reject("No workspace");
			const ws = new Workspace(model.currentWorkspace);
			const getCount = racks =>
				Object.values(racks).reduce(
					(acc, rack) => acc + rack.length,
					0
				);
			return Promise.all([
				ws
					.getRacks()
					.then(r => ({ rackrooms: r, rackCount: getCount(r) }))
					.then(rooms => update({ rooms })),

				ws
					.getDevices()
					.then(res => res.sort((a, b) => a.id - b.id))
					.then(devices => {
						const progress = { pass: 0, total: 0 };
						devices.forEach(d => {
							progress[d.health]++;
							progress.total++;
						});
						progress["percent"] = progress.PASS / progress.total;
						return { devices, progress };
					})
					.then(devices => update({ devices }))
			]);
		},
		view: ({ attrs: { model } }) => {
			/*
            console.log(model);
            console.log(model.workspaces);
			console.log(model.currentWorkspace);
			console.log(
				model.workspaces["496f76b4-8245-4d41-8d97-42fe988401c5"]
			);
			console.log(model.workspaces[model.currentWorkspace]);
*/
			const cws = model.workspaces[model.currentWorkspace];
			return [
				m(ViewTitleHero, {
					title: `${cws.name} workspace status`,
					subtitle: "Overview of workspace build progress"
				}),
				m(statusTiles, { model }),
				model.activeDeviceId && m(DeviceModal, { model })
			];
		}
	};
};
