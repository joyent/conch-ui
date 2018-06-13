import m from "mithril";

// Inspired by https://daverupert.com/2018/03/animated-svg-radial-progress-bars/

const Meter = {
	view: ({ attrs: { strokeWidth, percentage } }) =>
		m(
			"path[d=M41 149.5a77 77 0 1 1 117.93 0][fill=none][stroke-dasharray=350][stroke-dashoffset=350]",
			{
				class:
					percentage === 100
						? "has-stroke-success"
						: "has-stroke-info",
				style: {
					"stroke-width": strokeWidth,
					"will-change": "auto",
					transition: "stroke-dashoffset 850ms ease-in-out"
				}
			}
		),
	oncreate: vnode => {
		const path = vnode.dom;
		let length = path.getTotalLength();
		let strokeLength = length * ((100 - vnode.attrs.percentage) / 100);
		path.getBoundingClientRect(); // trigger layout for animation
		path.style.strokeDashoffset = Math.max(0, strokeLength);
	}
};

const MeterBg = {
	view: ({ attrs: { strokeWidth } }) =>
		m("path[stroke=#ccc] [d=M41 149.5a77 77 0 1 1 117.93 0][fill=none]", {
			style: {
				"stroke-width": strokeWidth,
				"will-change": "auto",
				transition: "stroke-dashoffset 850ms ease-in-out"
			}
		})
};

export default {
	view: ({ attrs: { percentage, strokeWidth } }) =>
		m(
			"svg[xmlns=http://www.w3.org/2000/svg][height=160][width=200][viewBox=0 0 200 160]",
			m(MeterBg, { strokeWidth }),
			m(Meter, { percentage, strokeWidth }),
			m(
				"text[x=102][y=110][text-anchor=middle].is-size-2.has-text-weight-bold[fill=#dee5ed]",
				`${percentage}%`
			)
		)
};
