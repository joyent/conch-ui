import m from "mithril";
import { request } from "mithril";

import { conchApi } from "config";

//import Status from "./Status";
//import Layout from "../Layout";

import { Main, Navbar, Sidebar, Spinner, ViewTitleHero } from "../component";

export default () => {
	let devices;
	let rackRooms;
	let rackCount;
	let progress = { pass: 0, total: 0 };
	const progressPercent = () =>
		progress.total ? progress.pass / progress.total * 100 : 0;

	return {
		oninit({ attrs: { currentWorkspaceId } }) {
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspaceId}/device`,
				withCredentials: true,
			}).then(res => {
				devices = res.sort((a, b) => {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
				});
				devices.forEach(device => {
					if (device.health === "PASS") progress.pass++;
					progress.total++;
				});
			});
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspaceId}/rack`,
				withCredentials: true,
			}).then(res => {
				console.log(res);
				// sort and assign the rack rooms
				rackRooms = Object.keys(res)
					.sort()
					.reduce((acc, room) => {
						acc[room] = res[room];
						rackCount =
							rackCount == null
								? res[room].length
								: rackCount + res[room].length;
						return acc;
					}, {});
			});
		},
		view({ attrs: { currentWorkspaceId } }) {
			return [
				m(ViewTitleHero, {
					title: "Conch Status",
					subtitle: `Status of current workspace`,
				}),
				m(
					"section.info-tiles",
					m(
						".tile.is-ancestor.has-text-centered",
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child.box",
								m(
									`progress.progress.is-info[value=${progressPercent()}][max=100]`,
									`${progressPercent()}%`
								)
							)
						)
					),
					m(
						".tile.is-ancestor.has-text-centered",
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child.box",
								rackCount != null
									? [
											m("p.title", rackCount),
											m("p.subtitle", "Racks"),
									  ]
									: m(Spinner)
							)
						),
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child.box",
								devices
									? [
											m("p.title", devices.length),
											m("p.subtitle", "Devices"),
									  ]
									: m(Spinner)
							)
						),
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child.box",
								m("p.title", "12"),
								m("p.subtitle", "Validation Issues")
							)
						)
					)
				),
			];
		},
	};
};
