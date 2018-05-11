import m from "mithril";
import { conchApi } from 'config';

const Validation = {
    list: [],
    idToName: {},
    load() {
        return m
            .request({
                method: "get",
                url: `${conchApi}/validation`,
                withCredentials: true,
            })
            .then(validations => {
                Validation.list = validations;
                Validation.idToName = validations.reduce(
                    (acc, { id, name }) => {
                        acc[id] = name;
                        return acc;
                    },
                    {}
                );
            });
    },
};

export default Validation;
