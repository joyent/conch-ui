import m from "mithril";

import Workspace from "models/Workspace";

import { Spinner } from "views/component";
import DeviceModal from "views/DeviceModal";
import StatusTilesComponent from "views/Status/StatusTiles";
import { ViewTitleHero } from "views/component/";

export default update => {
    const statusTiles = new StatusTilesComponent(update);

	return {
		oninit: ({ attrs: { model } }) => {
			const cws = model.workspaces[model.currentWorkspace];
			const ws = new Workspace(cws.id);
			const getCount = rs =>
				Object.values(rs).reduce((acc, r) => acc + r.length, 0);

			if (!model.rooms)
				ws
					.getRacks()
					.then(r => ({ rackrooms: r, rackCount: getCount(r) }))
					.then(rooms => update({ rooms }));

			if (!model.devices)
				ws
					.getDevices()
					.then(res => res.sort((a, b) => a.id - b.id))
					.then(devices => {
						const progress = { pass: 0, total: 0 };
						devices.forEach(d => {
							progress[d.health]++;
							progress.total++;
						});
						progress[percent] = progress.PASS / progress.total;
						return { devices, progress };
					})
					.then(devices => update({ devices }));
		},
		view: ({ attrs: { model } }) => {
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
