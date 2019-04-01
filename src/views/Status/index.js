import m from "mithril";
import stream from "mithril/stream";

import { Spinner, ViewTitleHero } from "views/component";

import DeviceModal from "views/DeviceModal";
import RackProgress from "views/Status/RackProgress";

import Workspace from "models/Workspace";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children))
};

export default () => {
	const devices = stream();
	const activeDeviceId = stream();

	let rackRooms;
	let rackCount;

	const progress = stream({});
	const progressPercent = progress.map(
		p => (p.total ? p.pass / p.total * 100 : 0)
	);

	const statusTiles = {
		view: () =>
			m(
				"section.info-tiles",
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							`progress.progress.is-info[value=${progressPercent()}][max=100]`,
							`${progressPercent()}%`
						)
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						rackCount == null
							? m(Spinner)
							: [
									m("p.title", rackCount),
									m("p.subtitle", "Racks")
							  ]
					),
					m(
						StatusTile,
						devices() == null
							? m(Spinner)
							: [
									m("p.title", devices().length),
									m("p.subtitle", "Devices")
							  ]
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)"
							},
							rackRooms == null
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Rack Validation Status"
										),
										m(RackProgress, {
											rackRooms,
											group: "status"
										})
								  ]
						)
					),
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)"
							},
							rackRooms == null
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Validation Status by Role"
										),
										m(RackProgress, {
											rackRooms,
											group: "role"
										})
								  ]
						)
					)
				)
			)
	};

	return {
		oninit({ attrs: { currentWorkspace } }) {
			currentWorkspace.map(workspace => {
				devices(null);
				workspace
					.getDevices()
					.then(res => res.sort((a, b) => a.id - b.id))
					.then(devices)
					.then(res => {
						const newProgress = { pass: 0, total: 0 };
						res.forEach(device => {
							if (device.health.toLowerCase() === "pass") newProgress.pass++;
							newProgress.total++;
						});
						progress(newProgress);
					});

				rackCount = null;
				rackRooms = null;
				workspace.getAllRacks().then(res => {
					// sort and assign the rack rooms
					rackCount = 0;
					rackRooms = Object.keys(res)
						.sort()
						.reduce((acc, room) => {
							acc[room] = res[room];
							rackCount += res[room].length;
							return acc;
						}, {});
				});
			});

			m.route.param("deviceId") &&
				activeDeviceId(m.route.param("deviceId"));
			activeDeviceId.map(deviceId => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/status")
				);

				let [_, queryS] = route.split("?");
				queryS ? (queryS = `?${queryS}`) : (queryS = "");

				if (deviceId)
					m.route.set(
						`${routePrefix}/status/device/${deviceId}${queryS}`
					);
				else m.route.set(`${routePrefix}/status`);
			});
		},
		view({ attrs: { currentWorkspace } }) {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} workspace status`,
					subtitle: "Overview of workspace build progress"
				}),
				m(statusTiles),
				activeDeviceId() && m(DeviceModal, { activeDeviceId })
			];
		}
	};
};
