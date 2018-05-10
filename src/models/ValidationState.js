import m from "mithril";
import { conchApi } from 'config';

const ValidationState = {
    currentList: [],

    loadForWorkspace(wId) {
        return m
            .request({
                method: "get",
                url: `${conchApi}/workspace/${wId}/validation_state`,
            })
            .then(validationStates => {
                ValidationState.currentList = validationStates;
            });
    },

    loadForDevice(dId) {
        return m
            .request({
                method: "get",
                url: `${conchApi}/device/${dId}/validation_state`,
            })
            .then(validationStates => {
                ValidationState.currentList = validationStates;
            });
    },
};

export default ValidationState;
