import m from "mithril";

import { Tile, Tiles, TileType } from "./Tiles";

const FlatStage = {
	view: () => m("div.container"),
	oncreate: ({
		attrs: { konva, boxes, tiles, gridSize, rows, columns, activeTileType },
		dom
	}) => {
		const stage = new konva.Stage({
			container: dom,
			height: columns * gridSize,
			width: rows * gridSize
		});

		// set up tooltip layer
		var tooltipLayer = new Konva.Layer();
		var tooltip = new Konva.Label({
			opacity: 0.75,
			visible: false,
			listening: false
		});
		tooltip.add(
			new Konva.Tag({
				fill: "black",
				pointerDirection: "down",
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: "round",
				shadowColor: "black",
				shadowBlur: 10,
				shadowOffset: 10,
				shadowOpacity: 0.5
			})
		);
		tooltip.add(
			new Konva.Text({
				text: "",
				fontSize: 12,
				padding: 4,
				fill: "white"
			})
		);
		tooltipLayer.add(tooltip);

		// blank grid layer
		const gridLayer = new konva.Layer();

		for (let i = 0; i <= stage.getWidth() / gridSize; i++) {
			for (let j = 0; j <= stage.getWidth() / gridSize; j++) {
				let blankTile = new konva.Rect({
					x: i * gridSize,
					y: j * gridSize,
					width: gridSize,
					height: gridSize,
					stroke: "#ddd",
					strokeWidth: 1
				});
				gridLayer.add(blankTile);
			}
		}

		// set up one layer for tiles that have already been drawn, another for
		// tiles currently being drawn
		const tileLayer = new konva.Layer();
		const tileDrawLayer = new konva.Layer();

		let paint = false;
		const mousedownStart = { x: 0, y: 0 };
		const mousedownEnd = { x: -1, y: -1 };
		let newDraw;

		// event function when drawing tiles starts
		const startDraw = e => {
			if (activeTileType() == null) return;
			let pos = { x: e.evt.layerX, y: e.evt.layerY };
			mousedownStart.x = Math.trunc(pos.x / gridSize);
			mousedownStart.y = Math.trunc(pos.y / gridSize);
			// account for single click
			newDraw = new Tiles(rows, columns);
			newDraw.setTile(
				mousedownStart.x,
				mousedownStart.y,
				new Tile(activeTileType())
			);
			paint = true;

			// draw the selection whenever the mouse is lifted up, even if outside the element
			document.addEventListener("mouseup", endDraw, { once: true });
		};

		// event function when drawing tiles ends
		tiles.map(ts => {
			tileLayer.destroyChildren();
			ts.forEach(({ x, y, tile }) => {
				if (
					tile.type === TileType.EMPTY ||
					tile.type === TileType.ERASE
				)
					return;
				let tileRect = new konva.Rect({
					x: x * gridSize,
					y: y * gridSize,
					width: gridSize,
					height: gridSize,
					fill: tile.type.color,
					stroke: "#ddd",
					strokewidth: 1
				});
				tileLayer.add(tileRect);
			});
		});
		const endDraw = () => {
			paint = false;
			tooltip.hide();
			(mousedownEnd.x = -1), (mousedownEnd.y = -1);
			tileDrawLayer.destroyChildren();
			tiles(tiles().merge(newDraw));
			stage.batchDraw();
		};

		// event function when dragging the mouse across tiles
		const drawSelection = e => {
			if (!paint) return;
			let pos = { x: e.evt.layerX, y: e.evt.layerY };
			tooltip.show();
			tooltip.setPosition({
				x: Math.max(pos.x, tooltip.width() / 2),
				y: Math.max(pos.y, tooltip.height() + 10)
			});
			tooltipLayer.batchDraw();

			// skip if the last drawn position is in the same grid
			if (
				mousedownEnd.x - Math.trunc(pos.x / gridSize) === 0 &&
				mousedownEnd.y - Math.trunc(pos.y / gridSize) === 0
			)
				return;
			mousedownEnd.x = Math.trunc(pos.x / gridSize);
			mousedownEnd.y = Math.trunc(pos.y / gridSize);

			let deltaX = Math.abs(mousedownStart.x - mousedownEnd.x);
			let deltaY = Math.abs(mousedownStart.y - mousedownEnd.y);
			tooltip.getText().setText(`${deltaX + 1} x ${deltaY + 1}`);

			tileDrawLayer.destroyChildren();
			newDraw = new Tiles(rows, columns);
			for (let i = 0; i <= deltaX; i++) {
				for (let j = 0; j <= deltaY; j++) {
					let x = Math.min(mousedownStart.x, mousedownEnd.x) + i;
					let y = Math.min(mousedownStart.y, mousedownEnd.y) + j;
					if (x >= rows || x < 0 || y >= columns || y < 0) continue;

					newDraw.setTile(
						Math.min(mousedownStart.x, mousedownEnd.x) + i,
						Math.min(mousedownStart.y, mousedownEnd.y) + j,
						new Tile(activeTileType())
					);
					let tileRect = new konva.Rect({
						x:
							(Math.min(mousedownStart.x, mousedownEnd.x) + i) *
							gridSize,
						y:
							(Math.min(mousedownStart.y, mousedownEnd.y) + j) *
							gridSize,
						width: gridSize,
						height: gridSize,
						fill: activeTileType().color,
						stroke: "#ddd",
						strokewidth: 1
					});
					tileDrawLayer.add(tileRect);
				}
			}
			stage.batchDraw();
		};
		stage.on("mousedown", startDraw);
		stage.on("mousemove", drawSelection);
		stage.on("mouseleave", drawSelection);

		// add rack layer, which includes build drag-and-dropable rectangles
		// for racks
		const rackLayer = new konva.Layer();

		// drag shadow
		let shadowRectangle = new konva.Rect({
			x: 0,
			y: 0,
			height: gridSize * 3,
			width: gridSize * 2,
			fill: "#FF7B17",
			opacity: 0.6,
			stroke: "#CF6412",
			strokeWidth: 3
		});

		function newRectangle(boxStream, layer, stage) {
			let rectangle = new konva.Rect({
				x: gridSize * boxStream().x,
				y: gridSize * boxStream().y,
				height: gridSize * 3,
				width: gridSize * 2,
				fill: "#666",
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
			rectangle.on("mousedown", e => {
				tooltip.show();
				tooltip.getText().setText("45 U Rack");
				tooltip.setPosition({
					x: rectangle.x() + rectangle.width() / 2,
					y: rectangle.y()
				});
				tooltipLayer.batchDraw();
			});
			rectangle.on("mouseup", e => {
				tooltip.hide();
				tooltipLayer.batchDraw();
			});
			rectangle.on("dragstart", e => {
				shadowRectangle.show();
				shadowRectangle.moveToTop();
				rectangle.moveToTop();
			});
			rectangle.on("dragend", e => {
				boxStream({
					id: boxStream().id,
					x: Math.round(rectangle.x() / gridSize),
					y: Math.round(rectangle.y() / gridSize)
				});
				rectangle.position({
					x: Math.round(rectangle.x() / gridSize) * gridSize,
					y: Math.round(rectangle.y() / gridSize) * gridSize
				});
				stage.batchDraw();
				shadowRectangle.hide();
			});
			rectangle.on("dragmove", e => {
				tooltip.setPosition({
					x: rectangle.x() + rectangle.width() / 2,
					y: rectangle.y()
				});
				boxStream({
					id: boxStream().id,
					x: Math.round(rectangle.x() / gridSize),
					y: Math.round(rectangle.y() / gridSize)
				});
				shadowRectangle.position({
					x: Math.round(rectangle.x() / gridSize) * gridSize,
					y: Math.round(rectangle.y() / gridSize) * gridSize
				});
				stage.batchDraw();
			});
			layer.add(rectangle);
		}
		shadowRectangle.hide();
		rackLayer.add(shadowRectangle);

		// create a rectange for each box in the stream
		boxes.forEach(boxStream => {
			newRectangle(boxStream, rackLayer, stage);
		});

		// add layers in order: grid, set tiles, drawing tiles, racks, tooltips
		stage.add(gridLayer);
		stage.add(tileLayer);
		stage.add(tileDrawLayer);
		stage.add(rackLayer);
		stage.add(tooltipLayer);
	}
};

export default FlatStage;
