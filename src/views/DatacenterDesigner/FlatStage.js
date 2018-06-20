import m from "mithril";

const FlatStage = {
	view: () => m("div.container"),
	oncreate: ({ attrs: { konva, boxes, gridSize, rows, columns }, dom }) => {
		let shadowRectangle = new konva.Rect({
			x: 0,
			y: 0,
			width: gridSize * 3,
			height: gridSize * 3,
			fill: "#FF7B17",
			opacity: 0.6,
			stroke: "#CF6412",
			strokeWidth: 3
		});

		function newRectangle(boxStream, layer, stage) {
			let rectangle = new konva.Rect({
				x: gridSize * boxStream().x,
				y: gridSize * boxStream().y,
				width: gridSize * 3,
				height: gridSize * 3,
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
			height: columns * gridSize + 1,
			width: rows * gridSize + 1
		});

		let gridLayer = new konva.Layer();
		for (let i = 0; i <= stage.getWidth() / gridSize; i++) {
			gridLayer.add(
				new konva.Line({
					points: [
						Math.round(i * gridSize) + 0.5,
						0,
						Math.round(i * gridSize) + 0.5,
						stage.getHeight()
					],
					stroke: "#ddd",
					strokeWidth: 1
				})
			);
		}

		for (let j = 0; j < stage.getHeight() / gridSize; j++) {
			gridLayer.add(
				new konva.Line({
					points: [
						0,
						Math.round(j * gridSize),
						stage.getWidth(),
						Math.round(j * gridSize)
					],
					stroke: "#ddd",
					strokeWidth: 0.5
				})
			);
		}

		let layer = new konva.Layer();
		shadowRectangle.hide();
		layer.add(shadowRectangle);

		boxes.forEach(boxStream => {
			newRectangle(boxStream, layer, stage);
		});

		stage.add(gridLayer);
		stage.add(layer);
	}
};

export default FlatStage;
