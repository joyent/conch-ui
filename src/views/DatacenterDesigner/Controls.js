import m from "mithril";
import { TileType } from "./Tiles";

const Controls = () => {
	let active = false;
	return {
		view: ({ attrs: { tileTypes, activeTileType } }) => {
			return m(
				".level",
				m(
					".level-left",
					m(
						".dropdown",
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
