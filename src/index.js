import "./styles/main.scss";

import dispatch from "./dispatch";

import Main from "./layouts/Main";

import DatacenterBrowser from "./views/DatacenterBrowser";
import DevicesView from "./views/Devices";
import Status from "./views/Status";

dispatch(document.body, {
	"/status": { layout: Main, view: Status },
	"/status/device/:deviceId": { layout: Main, view: Status },
	"/device": { layout: Main, view: DevicesView },
	"/device/:deviceId": { layout: Main, view: DevicesView },
	"/datacenter": { layout: Main, view: DatacenterBrowser },
	"/datacenter/:roomName/rack": { layout: Main, view: DatacenterBrowser },
	"/datacenter/:roomName/rack/:rackId/device": {
		layout: Main,
		view: DatacenterBrowser
	},
	"/datacenter/:roomName/rack/:rackId/device/:deviceId": {
		layout: Main,
		view: DatacenterBrowser
	}
});
