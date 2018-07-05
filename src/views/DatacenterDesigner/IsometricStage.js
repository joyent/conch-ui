import m from "mithril";
import stream from "mithril/stream";

const gridSize = 24;
const Z_HEIGHT_MAX = gridSize * 3;

import { TileType } from "./Tiles";

// layer for drawing the base grid and tiles
const GridLayer = {
	view: ({ attrs: { width, height } }) => {
		return m(`canvas[height=${height}][width=${width}]`, {
			style: "position: absolute;"
		});
	},
	oncreate: ({
		attrs: { obelisk, tiles, rows, columns, basePoint, gridSize },
		dom
	}) => {
		let pixelView = new obelisk.PixelView(dom, basePoint);
		let floorBrickDimension = new obelisk.BrickDimension(
			gridSize,
			gridSize
		);

		let blankTileColor = new obelisk.LineColor(0xccccee);
		let blankTile = new obelisk.Brick(floorBrickDimension, blankTileColor);

		tiles.map(ts => {
			pixelView.clear();
			for (let x = 0; x < rows; x++) {
				for (let y = 0; y < columns; y++) {
					let p3d = new obelisk.Point3D(
						x * gridSize,
						y * gridSize,
						0
					);
					pixelView.renderObject(blankTile, p3d);
				}
			}

			ts.forEach(({ x, y, tile }) => {
				if (tile.type === TileType.EMPTY) return;
				var tileColor = new obelisk.SideColor().getByInnerColor(
					Number.parseInt(tile.type.color.replace("#", "0x"))
				);
				let tileBrick = new obelisk.Brick(
					floorBrickDimension,
					tileColor
				);
				pixelView.renderObject(
					tileBrick,
					new obelisk.Point3D(x * gridSize, y * gridSize)
				);
			});
		});
	}
};

// layer for drawing the racks. Separate to avoid excessive re-draws
const RacksLayer = {
	view: ({ attrs: { width, height } }) => {
		return m(`canvas[height=${height}][width=${width}]`, {
			style: "position: absolute;"
		});
	},
	oncreate: ({ attrs: { obelisk, boxes, gridSize, basePoint }, dom }) => {
		let pixelView = new obelisk.PixelView(dom, basePoint);

		let dimension = new obelisk.CubeDimension(
			gridSize * 2,
			gridSize * 3,
			gridSize * 8
		);

		let gray = obelisk.ColorPattern.BLACK;
		let color = new obelisk.CubeColor().getByHorizontalColor(gray);
		let cube = new obelisk.Cube(dimension, color, true);

		let boxesStream = stream.merge(boxes);
		boxesStream.map(bs => {
			pixelView.clear();
			bs.forEach(box => {
				pixelView.renderObject(
					cube,
					new obelisk.Point3D(box.x * gridSize, box.y * gridSize)
				);
			});
		});
	}
};

const IsometricStage = {
	view: ({ attrs }) => {
		// set up common attributes for layers
		// width-to-height ratio is 2:1
		attrs.width = attrs.gridSize * (attrs.rows + attrs.columns);
		attrs.height = attrs.width / 2 + attrs.gridSize * attrs.zHeightMax;

		// set the base point for the layers ( where the grid starts)
		attrs.basePoint = new attrs.obelisk.Point(
			attrs.gridSize * attrs.columns,
			attrs.gridSize * attrs.zHeightMax
		);
		return m(".container", m(GridLayer, attrs), m(RacksLayer, attrs));
	}
};

export default IsometricStage;
