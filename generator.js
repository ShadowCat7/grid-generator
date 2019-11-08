const WIDTH = 36;
const HEIGHT = 27;
const CENTER_X = 1;
const CENTER_Y = 1;

const getRandomConnection = () => {
    return Math.random() * 4 < 1;
};

const getRandomWeight = () => {
    return Math.random();
};

const getTileId = (x, y) => {
    return x + y * WIDTH;
};

export default () => {
    const weights = [];
    const world = [];
    const cachedPaths = [];

    const createTile = (x, y, options) => {
        let {
            up = null, down = null, left = null, right = null,
        } = options;

        if (x === 0) {
            left = false;
        } else if (x === WIDTH - 1) {
            right = false;
        }

        if (y === 0) {
            up = false;
        } else if (y === HEIGHT - 1) {
            down = false;
        }

        if (up === null) {
            up = getRandomConnection();
        }
        if (down === null) {
            down = getRandomConnection();
        }
        if (left === null) {
            left = getRandomConnection();
        }
        if (right === null) {
            right = getRandomConnection();
        }

        return { up, down, left, right };
    };

    const tryPath = (x, y, weight, path, tilesVisited) => {
        const tileId = getTileId(x, y);
        if (tilesVisited[tileId]) return;

        const cachedWeight = cachedPaths[x][y];
        if (cachedWeight) {
            return {
                weight: weight + cachedWeight.weight,
                // maybe return full path?
                path: [...path, ...cachedWeight.path],
            };
        } else {
            return getBestPath(x, y, weight, path, tilesVisited);
        }
    };

    const getBestPath = (x, y, weight, path, tilesVisited) => {
        const possiblePaths = [];

        const currentPath = [...path];
        currentPath.push({ x, y });

        const currentTilesVisited = [...tilesVisited];
        const currentTileId = getTileId(x, y);
        currentTilesVisited[currentTileId] = true;

        const currentWeight = weight + weights[x][y];

        // try going different directions while still focusing toward (1, 1)
        if (x > CENTER_X) {
            possiblePaths.push(tryPath(x - 1, y, currentWeight, currentPath, currentTilesVisited));
        }
        if (x < CENTER_X) {
            possiblePaths.push(tryPath(x + 1, y, currentWeight, currentPath, currentTilesVisited));
        }
        if (y > CENTER_Y) {
            possiblePaths.push(tryPath(x, y - 1, currentWeight, currentPath, currentTilesVisited));
        }
        if (y < CENTER_Y) {
            possiblePaths.push(tryPath(x, y + 1, currentWeight, currentPath, currentTilesVisited));
        }

        let bestPath = null;
        possiblePaths.forEach(path => {
            if (!bestPath) {
                bestPath = path;
            } else if (path && path.weight < bestPath.weight) {
                bestPath = path;
            }
        });

        // should be caching now instead of later
        if (!bestPath) {
            return {
                weight: currentWeight,
                path: currentPath,
            };
        }

        return bestPath;
    };

    // initialize weights and arrays
    for (let i = 0; i < WIDTH; i++) {
        weights.push([]);
        world.push([]);
        cachedPaths.push([]);

        for (let j = 0; j < HEIGHT; j++) {
            weights[i].push(getRandomWeight());
            world[i].push({});
        }
    }

    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            const bestPath = getBestPath(i, j, 0, [], []);

            cachedPaths[i].push(bestPath);

            if (i === CENTER_X && j === CENTER_Y) {
                continue;
            }

            const nextRoomInPath = bestPath.path[1];
            const tileOptions = {...world[i][j]};

            if (i < nextRoomInPath.x) {
                tileOptions.right = true;
            } else if (i > nextRoomInPath.x) {
                tileOptions.left = true;
            } else if (j < nextRoomInPath.y) {
                tileOptions.down = true;
            } else if (j > nextRoomInPath.y) {
                tileOptions.up = true;
            }

            const tile = createTile(i, j, tileOptions);
            if (tile.right) world[i + 1][j].left = true;
            if (tile.left) world[i - 1][j].right = true;
            if (tile.up) world[i][j - 1].down = true;
            if (tile.down) world[i][j + 1].up = true;

            world[i][j] = tile;
        }
    }

    return world;
};