import m from "mithril";

import RelayList from "./List";
import RelayDetail from "./Detail";
import Layout from "../Layout";

export default () => {

    return {
        view: ({ attrs }) => {
            return m(
                Layout.threePane,
                { active: attrs.active, title: "Relay" },
                m(RelayList, attrs),
                m(RelayDetail, attrs)
            );
        },
    }
};
