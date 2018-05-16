import m from "mithril";
import t from "i18n4v";
import moment from "moment";

import { conchApi} from '../config';
import "./styles/main.scss";

import Device from "./views/Device";
import Layout from "./views/Layout";
import Login from "./views/Login";
import Problem from "./views/Problem";
import Rack from "./views/Rack";
import Status from "./views/Status";
import RelayView from "./views/Relay";

import korean from "./languages/ko.js";
import english from "./languages/en.js";
const languages = {
    en: english,
    ko: korean,
    "ko-KR": korean,
};

t.selectLanguage(["en", "ko", "ko-KR"], (err, lang) => {
    moment.locale(lang ? lang.slice(0, 2) : "en");
    t.translator.add(languages[lang] ? languages[lang] : languages.en);
});

function requiresLogin(page) {
    return m
        .request({
            method: "GET",
            url: `${conchApi}/login`,
            withCredentials: true,
            extract(xhr) {
                return { status: xhr.status, body: xhr.response ? JSON.parse(xhr.response) : null, };
            },
        })
        .catch(e => {
            if (e.status === 401) {
                this.reject()
            } else {
                throw e;
            }
        }).then(() => page, () => Login);
}

m.route(document.body, "/status", {
    "/status": {
        onmatch() {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.twoPane,
                        { active: 1, title: "Status" },
                        m(Status)
                    ),
            });
        },
    },
    "/rack": {
        onmatch() {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 1, title: "Racks" },
                        m(Rack.allRacks),
                        m(Rack.makeSelection)
                    ),
            });
        },
    },
    "/rack/:id": {
        onmatch(attrs) {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 2, title: "Rack" },
                        m(Rack.allRacks),
                        m(Rack.rackLayout, attrs)
                    ),
            });
        },
    },
    "/problem": {
        onmatch() {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 1, title: "Problems" },
                        m(Problem.selectProblemDevice),
                        m(Problem.makeSelection)
                    ),
            });
        },
    },
    "/problem/:id": {
        onmatch(attrs) {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 2, title: "Problem" },
                        m(Problem.selectProblemDevice, attrs),
                        m(Problem.showDevice, attrs)
                    ),
            });
        },
    },
    "/device": {
        onmatch(attrs) {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 1, title: "Device Reports" },
                        m(Device.allDevices),
                        m(Device.makeSelection)
                    ),
            });
        },
    },
    "/device/:id": {
        onmatch(attrs) {
            return requiresLogin({
                view: () =>
                    m(
                        Layout.threePane,
                        { active: 2, title: "Report" },
                        m(Device.allDevices),
                        m(Device.deviceReport, attrs)
                    ),
            });
        },
    },
    "/relay": {
        onmatch(attrs) {
            attrs.active = 1;
            return requiresLogin(RelayView, attrs);
        },
    },
    "/relay/:id": {
        onmatch(attrs) {
            attrs.active = 2;
            return requiresLogin(RelayView, attrs);
        },
    },
    "/login": Login,
});
