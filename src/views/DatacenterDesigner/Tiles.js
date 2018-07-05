// enum
const TileType = {
	COLD: {
		name: "Cold Tile",
		color: "#58cafa"
	},
	HOT: {
		name: "Hot Tile",
		color: "#FF0099"
	},
	POWERED: {
		name: "Powered Tile",
		color: "#FFFF00"
	},
	EMPTY: { name: "Erase" }
};

Object.freeze(TileType);

class Tile {
	constructor(type) {
		if (type == null) type = TileType.EMPTY;
		this.type = type;
		Object.freeze(this);
	}
}

class Tiles {
	constructor(rows, columns, tiles) {
		this.rows = rows;
		this.columns = columns;
		if (!tiles)
			this.tiles = Array(rows)
				.fill()
				.map(_ => Array(columns).fill(new Tile()));
		else this.tiles = tiles;
	}
	getTile(x, y) {
		return this.tiles[x][y];
	}
	setTile(x, y, tile) {
		this.tiles[x][y] = tile;
	}
	// returns new Tiles object with the two objects merged
	merge(tiles) {
		console.assert(tiles.rows === this.rows);
		console.assert(tiles.columns === this.columns);

		let mergeTiles = Array(this.rows)
			.fill()
			.map(_ => Array(this.columns));
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				let tile = tiles.getTile(i, j);
				if (tile.type === TileType.EMPTY) tile = this.getTile(i, j);
				mergeTiles[i][j] = tile;
			}
		}
		return new Tiles(this.rows, this.columns, mergeTiles);
	}
	forEach(f) {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				f({ x: i, y: j, tile: this.tiles[i][j] });
			}
		}
	}
}

export { TileType, Tile, Tiles };
