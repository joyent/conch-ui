import m from "mithril";

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
								tileTypes.map(t =>
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
								),
								m("hr.dropdown-divider"),
								m(
									"a.dropdown-item",
									{
										onclick: () => {
											activeTileType({
												name: "Erase"
											});
											active = false;
										}
									},
									"Erase"
								)
							)
						)
					)
				)
			);
		}
	};
};

export default Controls;
