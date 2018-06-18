import m from "mithril";
import stream from "mithril/stream";
import { Spinner } from "../component";

const Stage = {
	view: () => m("div.container"),
	oncreate: ({ attrs: { Konva, boxes, height, width }, dom }) => {
		// add an additional pixel to account for right and bottom border
		width += 1;
		height += 1;

		let blockSnapSize = 32;

		let shadowRectangle = new Konva.Rect({
			x: 0,
			y: 0,
			width: blockSnapSize * 3,
			height: blockSnapSize * 3,
			fill: "#FF7B17",
			opacity: 0.6,
			stroke: "#CF6412",
			strokeWidth: 3,
			dash: [20, 2]
		});

		function newRectangle(boxStream, layer, stage) {
			let rectangle = new Konva.Rect({
				x: blockSnapSize * boxStream().x,
				y: blockSnapSize * boxStream().y,
				width: blockSnapSize * 3,
				height: blockSnapSize * 3,
				fill: "#fff",
				stroke: "#ddd",
				strokeWidth: 1,
				shadowColor: "white",
				shadowBlur: 2,
				shadowOffset: { x: 1, y: 1 },
				shadowOpacity: 0.4,
				draggable: true,
				dragBoundFunc: function(pos) {
					pos.x = pos.x >= 0 ? pos.x : 0;
					pos.x =
						pos.x <= stage.getWidth() - this.width()
							? pos.x
							: stage.getWidth() - this.width();
					pos.y = pos.y >= 0 ? pos.y : 0;
					pos.y =
						pos.y <= stage.getHeight() - this.height()
							? pos.y
							: stage.getHeight() - this.height();
					return pos;
				}
			});
			rectangle.on("dragstart", e => {
				shadowRectangle.show();
				shadowRectangle.moveToTop();
				rectangle.moveToTop();
			});
			rectangle.on("dragend", e => {
				boxStream({
					id: boxStream().id,
					x: Math.round(rectangle.x() / blockSnapSize),
					y: Math.round(rectangle.y() / blockSnapSize)
				});
				rectangle.position({
					x:
						Math.round(rectangle.x() / blockSnapSize) *
						blockSnapSize,
					y: Math.round(rectangle.y() / blockSnapSize) * blockSnapSize
				});
				stage.batchDraw();
				shadowRectangle.hide();
			});
			rectangle.on("dragmove", e => {
				boxStream({
					id: boxStream().id,
					x: Math.round(rectangle.x() / blockSnapSize),
					y: Math.round(rectangle.y() / blockSnapSize)
				});
				shadowRectangle.position({
					x:
						Math.round(rectangle.x() / blockSnapSize) *
						blockSnapSize,
					y: Math.round(rectangle.y() / blockSnapSize) * blockSnapSize
				});
				stage.batchDraw();
			});
			layer.add(rectangle);
		}

		let stage = new Konva.Stage({
			container: dom,
			width: width,
			height: height
		});

		let gridLayer = new Konva.Layer();
		let padding = blockSnapSize;
		for (let i = 0; i <= width / padding; i++) {
			gridLayer.add(
				new Konva.Line({
					points: [
						Math.round(i * padding) + 0.5,
						0,
						Math.round(i * padding) + 0.5,
						height
					],
					stroke: "#ddd",
					strokeWidth: 1
				})
			);
		}

		for (let j = 0; j < height / padding; j++) {
			gridLayer.add(
				new Konva.Line({
					points: [
						0,
						Math.round(j * padding),
						width,
						Math.round(j * padding)
					],
					stroke: "#ddd",
					strokeWidth: 0.5
				})
			);
		}

		let layer = new Konva.Layer();
		shadowRectangle.hide();
		layer.add(shadowRectangle);

		boxes.forEach(boxStream => {
			newRectangle(boxStream, layer, stage);
		});

		stage.add(gridLayer);
		stage.add(layer);
	}
};

const TILE_SIZE = 24;
const Z_HEIGHT_MAX = TILE_SIZE * 3;

const ObeliskStage = {
	view: ({ attrs: { rows, columns } }) => {
		// 2:1 width-to-height
		let width = TILE_SIZE * (rows + columns);
		let height = width / 2 + Z_HEIGHT_MAX;
		return m(`canvas[height=${height}][width=${width}]`, {});
	},
	oncreate: ({ attrs: { obelisk, boxes, rows, columns }, dom }) => {
		let point = new obelisk.Point(TILE_SIZE * columns, Z_HEIGHT_MAX);
		let pixelView = new obelisk.PixelView(dom, point);
		let floorBrickDimension = new obelisk.BrickDimension(
			TILE_SIZE,
			TILE_SIZE
		);
		let colorBrick = new obelisk.LineColor(0xccccee);
		let floorTile = new obelisk.Brick(floorBrickDimension, colorBrick);
		let dimension = new obelisk.CubeDimension(
			TILE_SIZE * 3,
			TILE_SIZE * 3,
			TILE_SIZE * 3
		);
		let gray = obelisk.ColorPattern.YELLOW;
		let color = new obelisk.CubeColor().getByHorizontalColor(gray);
		let cube = new obelisk.Cube(dimension, color, true);
		stream.combine((...bs) => {
			pixelView.clear();
			for (let x = 0; x < rows; x++) {
				for (let y = 0; y < columns; y++) {
					let p3d = new obelisk.Point3D(
						x * TILE_SIZE,
						y * TILE_SIZE,
						0
					);
					pixelView.renderObject(floorTile, p3d);
				}
			}

			bs.splice(0, bs.length - 1).map(boxStream => {
				pixelView.renderObject(
					cube,
					new obelisk.Point3D(
						boxStream().x * TILE_SIZE,
						boxStream().y * TILE_SIZE
					)
				);
			});
		}, boxes);
	}
};

export default () => {
	let Konva;
	let obelisk;
	let libsLoaded = false;

	const boxes = [
		stream({ id: 1, x: 3, y: 3 }),
		stream({ id: 2, x: 10, y: 3 })
	];

	return {
		oninit: () => {
			// load required libraries asyncronously. Also allows for splitting
			// these libraries into separate chunks
			Promise.all([import("konva"), import("obelisk.js")]).then(libs => {
				[Konva, obelisk] = libs;
				libsLoaded = true;
				m.redraw();
			});
		},
		view: () => {
			return !libsLoaded
				? m(Spinner)
				: m(
						".columns",
						m(
							".column.is-5",
							m(
								".box",
								m(Stage, {
									Konva,
									boxes,
									height: 512,
									width: 512
								})
							)
						),
						m(
							".column.is-6",
							m(ObeliskStage, {
								obelisk,
								boxes,
								rows: 16,
								columns: 16
							})
						)
				  );
		}
	};
};
