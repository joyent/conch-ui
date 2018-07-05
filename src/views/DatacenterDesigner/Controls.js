import m from "mithril";
import { TileType } from "./Tiles";

const Controls = () => {
	let active = false;
	return {
		view: ({ attrs: { activeTileType, targetTBs, maxAmps } }) => {
			return m(
				".level.box",
				m(
					".level-left",
					m(
						".level-item",
						m("input.input[type=text][placeholder=Datacenter Name]")
					),
					m(
						".level-item",
						m(
							"p.control",
							m(
								"input.input[type=number][placeholder=Target Storage]",
								{ oninput: m.withAttr("value", targetTBs) }
							)
						),
						m("p.control", m("a.button.is-static", "Terabytes"))
					),
					m(
						".level-item",
						m(
							"p.control",
							m(
								"input.input[type=number][placeholder=Total Current]",
								{ oninput: m.withAttr("value", maxAmps) }
							)
						),
						m("p.control", m("a.button.is-static", "Amps"))
					)
				),
				m(
					".level-right",
					m(
						".dropdown.is-right",
						{ class: active && "is-active" },
						m(
							".dropdown-trigger",
							{
								onclick: e => {
									active = !active;
								}
							},
							m(
								"button.button",
								m(
									"span",
									activeTileType() == null
										? "Choose Tile"
										: activeTileType().name
								),
								m(
									"span.icon.is-small",
									m("i.fas.fa-angle-down")
								)
							)
						),
						m(
							".dropdown-menu",
							m(
								".dropdown-content",
								Object.values(TileType).reduce((acc, t) => {
									if (t.name)
										acc.push(
											m(
												"a.dropdown-item",
												{
													onclick: () => {
														activeTileType(t);
														active = false;
													}
												},
												t.name
											)
										);
									return acc;
								}, [])
							)
						)
					)
				)
			);
		}
	};
};

export default Controls;
