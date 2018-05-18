import m from "mithril";

import { conchApi } from "config";

//import Status from "./Status";
//import Layout from "../Layout";

import Main from "../component/Main";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";

export default () => {
	let state = {};

	return {
		view: () =>
			m(
				"section.hero.is-primary.welcome.is-small",
				m(
					".hero-body",
					m("h1.title", "Conch Status"),
					m("h2.subtitle", `Status of current workspace`)
				)
			),
	};
};
