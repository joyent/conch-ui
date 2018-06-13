import m from "mithril";
import search from "fuzzysearch";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner, ViewTitleHero } from "../component/";

export default () => {
	return {
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} workspace devices`,
					subtitle: `Search and filter workspace devices`
				})
				//m(
				//"section.info-tiles",
				//m(
				//".tile.is-ancestor.has-text-right",
				//m(
				//".tile.is-parent",
				//m(
				//"article.tile.is-child.box",
				//{ style: "padding: 0.75rem" },
				//m(
				//".dropdown.is-right",
				//{ class: searchText() && "is-active" },
				//m(
				//".dropdown-trigger",
				//m(
				//".control",
				//{
				//class:
				//!workspaceDevices() &&
				//searchText() &&
				//"is-loading"
				//},
				//m(
				//"input.input[placeholder=Search for Device]",
				//{
				//oninput: m.withAttr(
				//"value",
				//searchText
				//),
				//// sets the search text if you leave the field and return
				//onfocus: m.withAttr(
				//"value",
				//searchText
				//)
				//}
				//)
				//)
				//),
				//m(
				//".dropdown-menu.is-paddingless",
				//m(
				//".dropdown-content",
				//foundDevices() &&
				//foundDevices().map(device =>
				//m(
				//"a.dropdown-item",
				//{
				//onclick() {
				//searchedDevice(
				//device
				//);
				//searchText("");
				//}
				//},
				//device.id,
				//device.asset_tag &&
				//m(
				//"span.has-text-grey-light",
				//` ${
				//device.asset_tag
				//}`
				//)
				//)
				//)
				//)
				//)
				//)
				//)
				//)
				//),
				//m(
				//".tile.is-ancestor.has-text-right",
				//m(
				//".tile.is-parent",
				//m(
				//"article.tile.is-child",
				//activeDeviceId() &&
				//m(DeviceModal, {
				//activeDeviceId
				//}),
				//rackRooms() == null
				//? m("section.section", m(Spinner))
				//: m(
				//".columns.is-gapless",
				//m(
				//".column.is-3",
				//m(RoomPanel, {
				//rackRooms,
				//activeRoomName
				//})
				//),
				//m(
				//".column.is-3",
				//activeRoom() &&
				//m(RackPanel, {
				//activeRoomName,
				//activeRacks,
				//activeRackId
				//})
				//),
				//m(
				//".column.is-6",
				//rackLayout() &&
				//m(LayoutPanel, {
				//currentWorkspace,
				//activeRack,
				//rackLoading,
				//rackLayout,
				//activeDeviceId,
				//searchedDevice
				//})
				//)
				//)
				//)
				//)
				//)
				//)
			];
		}
	};
};
