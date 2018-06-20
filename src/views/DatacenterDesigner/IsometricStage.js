import m from "mithril";
import stream from "mithril/stream";

const TILE_SIZE = 24;
const Z_HEIGHT_MAX = TILE_SIZE * 3;

const IsometricStage = {
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

export default IsometricStage;
