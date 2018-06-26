import m from "mithril";

const FlatStage = {
	view: () => m("div.container"),
	oncreate: ({
		attrs: { konva, boxes, tiles, gridSize, rows, columns, activeTileType },
		dom
	}) => {
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

		let stage = new konva.Stage({
			container: dom,
			// extra pixel for borders
			height: columns * gridSize,
			width: rows * gridSize
		});

		let gridLayer = new konva.Layer();
		let tileLayer = new konva.Layer();
		let tileDrawLayer = new konva.Layer();

		let paint = false;
		const mousedownStart = { x: 0, y: 0 };
		const mousedownEnd = { x: -1, y: -1 };
		let newDraw;
		const startDraw = e => {
			if (activeTileType() == null) return;
			let pos = { x: e.evt.layerX, y: e.evt.layerY };
			mousedownStart.x = Math.trunc(pos.x / gridSize);
			mousedownStart.y = Math.trunc(pos.y / gridSize);
			// account for simple click
			newDraw = [
				{
					x: mousedownStart.x,
					y: mousedownStart.y,
					tileType: activeTileType()
				}
			];
			paint = true;

			// draw the selection whenever the mouse is lifted up, even if outside the element
			document.addEventListener("mouseup", endDraw, { once: true });
		};
		const endDraw = () => {
			paint = false;
			(mousedownEnd.x = -1), (mousedownEnd.y = -1);
			newDraw.forEach(tile => {
				let tileRect = new konva.Rect({
					x: tile.x * gridSize,
					y: tile.y * gridSize,
					width: gridSize,
					height: gridSize,
					fill: activeTileType().color,
					stroke: "#ddd",
					strokewidth: 1
				});
				tileLayer.add(tileRect);
			});
			stage.batchDraw();
			tiles(tiles().concat(newDraw));
		};

		const drawSelection = e => {
			if (!paint) return;
			let pos = { x: e.evt.layerX, y: e.evt.layerY };

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

			tileDrawLayer.destroyChildren();
			newDraw = [];
			for (let i = 0; i <= deltaX; i++) {
				for (let j = 0; j <= deltaY; j++) {
					let x = Math.min(mousedownStart.x, mousedownEnd.x) + i;
					let y = Math.min(mousedownStart.y, mousedownEnd.y) + j;
					if (x >= rows || x < 0 || y >= columns || y < 0) continue;

					newDraw.push({
						x: Math.min(mousedownStart.x, mousedownEnd.x) + i,
						y: Math.min(mousedownStart.y, mousedownEnd.y) + j,
						tileType: activeTileType()
					});
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
		gridLayer.on("mousedown", startDraw);
		gridLayer.on("mousemove", drawSelection);
		gridLayer.on("mouseleave", drawSelection);

		// draw blank grid
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

		let rackLayer = new konva.Layer();
		shadowRectangle.hide();
		rackLayer.add(shadowRectangle);

		boxes.forEach(boxStream => {
			newRectangle(boxStream, rackLayer, stage);
		});

		stage.add(tileLayer);
		stage.add(tileDrawLayer);
		stage.add(gridLayer);
		stage.add(rackLayer);
	}
};

export default FlatStage;
