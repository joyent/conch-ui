import m from "mithril";
import { request } from "mithril";
import { conchApi } from "config";

import {  Spinner, ViewTitleHero } from "../component";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children)),
};

export default () => {
	let devices;
	let rackRooms;
	let rackCount;
	let validationFailCount;
	let progress = { pass: 0, total: 0 };
	const progressPercent = () =>
		progress.total ? progress.pass / progress.total * 100 : 0;

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
									m("p.subtitle", "Racks"),
							  ]
					),
					m(
						StatusTile,
						devices == null
							? m(Spinner)
							: [
									m("p.title", devices.length),
									m("p.subtitle", "Devices"),
							  ]
					),
					m(
						StatusTile,
						validationFailCount == null
							? m(Spinner)
							: [
									m("p.title", validationFailCount),
									m("p.subtitle", "Validation Issues"),
							  ]
					)
				),
			),
	};

	return {
		oninit({ attrs: { currentWorkspace } }) {
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/device`,
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
				url: `${conchApi}/workspace/${currentWorkspace.id}/rack`,
				withCredentials: true,
			}).then(res => {
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
			request({
				method: "GET",
				url: `${conchApi}/workspace/${
					currentWorkspace.id
				}/validation_state?status=error,fail`,
				withCredentials: true,
			}).then(res => {
				validationFailCount = res.length;
			});
		},
		view({ attrs: { currentWorkspace } }) {
			return [
				m(ViewTitleHero, {
					title: "Conch Status",
					subtitle: `Status of current workspace`,
				}),
				m(statusTiles),
			];
		},
	};
};
