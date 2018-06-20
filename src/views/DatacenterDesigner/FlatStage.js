import m from "mithril";

const FlatStage = {
	view: () => m("div.container"),
	oncreate: ({ attrs: { konva, boxes, height, width }, dom }) => {
		// add an additional pixel to account for right and bottom border
		width += 1;
		height += 1;

		let blockSnapSize = 32;

		let shadowRectangle = new konva.Rect({
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
			let rectangle = new konva.Rect({
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

		let stage = new konva.Stage({
			container: dom,
			width: width,
			height: height
		});

		let gridLayer = new konva.Layer();
		let padding = blockSnapSize;
		for (let i = 0; i <= width / padding; i++) {
			gridLayer.add(
				new konva.Line({
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
				new konva.Line({
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
