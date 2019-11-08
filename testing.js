import generator from './generator.js';

const world = generator();

const canvas = document.getElementById('thing');
const ctx = canvas.getContext('2d');

const DRAW_WIDTH = 10;

const drawTiles = () => {
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, 1200, 900);
    ctx.fillRect(0, 0, 1200, 900);

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
            drawTile(i * 3 * (DRAW_WIDTH + 1), j * 3 * (DRAW_WIDTH + 1), world[i][j]);
        }
    }
};

const drawTile = (x, y, tile) => {
    const {
        up, down, left, right
    } = tile;

    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, DRAW_WIDTH, DRAW_WIDTH);
    ctx.fillRect(x, y + 2 * DRAW_WIDTH, DRAW_WIDTH, DRAW_WIDTH);
    ctx.fillRect(x + 2 * DRAW_WIDTH, y + 2 * DRAW_WIDTH, DRAW_WIDTH, DRAW_WIDTH);
    ctx.fillRect(x + 2 * DRAW_WIDTH, y, DRAW_WIDTH, DRAW_WIDTH);

    if (!left)
        ctx.fillRect(x, y + DRAW_WIDTH, DRAW_WIDTH, DRAW_WIDTH);
    if (!up)
        ctx.fillRect(x + DRAW_WIDTH, y, DRAW_WIDTH, DRAW_WIDTH);
    if (!right)
        ctx.fillRect(x + 2 * DRAW_WIDTH, y + DRAW_WIDTH, DRAW_WIDTH, DRAW_WIDTH);
    if (!down)
        ctx.fillRect(x + DRAW_WIDTH, y + 2 * DRAW_WIDTH, DRAW_WIDTH, DRAW_WIDTH);
};

drawTiles();