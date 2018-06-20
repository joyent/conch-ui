import m from "mithril";
import stream from "mithril/stream";

const gridSize = 24;
const Z_HEIGHT_MAX = gridSize * 3;

const IsometricStage = {
	view: ({ attrs: { gridSize, rows, columns, zHeightMax } }) => {
		// 2:1 width-to-height
		let width = gridSize * (rows + columns);
		let height = width / 2 + gridSize * zHeightMax;
		return m(`canvas[height=${height}][width=${width}]`, {});
	},
	oncreate: ({
		attrs: { obelisk, boxes, rows, columns, gridSize, zHeightMax },
		dom
	}) => {
		let point = new obelisk.Point(
			gridSize * columns,
			gridSize * zHeightMax
		);
		let pixelView = new obelisk.PixelView(dom, point);
		let floorBrickDimension = new obelisk.BrickDimension(
			gridSize,
			gridSize
		);
		let colorBrick = new obelisk.LineColor(0xccccee);
		let floorTile = new obelisk.Brick(floorBrickDimension, colorBrick);
		let dimension = new obelisk.CubeDimension(
			gridSize * 3,
			gridSize * 3,
			gridSize * 3
		);
		let gray = obelisk.ColorPattern.YELLOW;
		let color = new obelisk.CubeColor().getByHorizontalColor(gray);
		let cube = new obelisk.Cube(dimension, color, true);

		stream.combine((...bs) => {
			pixelView.clear();
			for (let x = 0; x < rows; x++) {
				for (let y = 0; y < columns; y++) {
					let p3d = new obelisk.Point3D(
						x * gridSize,
						y * gridSize,
						0
					);
					pixelView.renderObject(floorTile, p3d);
				}
			}

			bs.splice(0, bs.length - 1).map(boxStream => {
				pixelView.renderObject(
					cube,
					new obelisk.Point3D(
						boxStream().x * gridSize,
						boxStream().y * gridSize
					)
				);
			});
		}, boxes);
	}
};

export default IsometricStage;
