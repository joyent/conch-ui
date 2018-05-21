import m from "mithril";

export default {
	view: ({ attrs }) =>
		m(
			"section.hero.is-primary.welcome.is-small",
			m(
				".hero-body",
				m("h1.title", attrs.title),
				m("h2.subtitle", attrs.subtitle)
			)
		),
};
