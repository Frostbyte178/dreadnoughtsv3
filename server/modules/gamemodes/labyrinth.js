let checkMazeForBlocks = (initX, initY, size, maze) => {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (!maze[initY + y] || !maze[initY + y][initX + x]) return;
        }
    }
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            maze[initY + y][initX + x] = false;
        }
    }
    maze[initY][initX] = size;
},
generateLabyrinth = (size) => {
    let maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(true))));
    const offsets = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ]

    for (let y = 1; y < size; y += 2) {
        for (let x = 1; x < size; x += 2) {
            maze[y][x] = false;
            directions = ran.irandom(15);
            
            for (let i = 0; i < 4; i++) {
                if (directions % 2) {
                    let [dx, dy] = offsets[i];
                    maze[y + dy][x + dx] = false;
                    directions >>= 1;
                }
            }
        }
    }
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let newX = 2 * x / size - 1 + 1 / size;
            let newY = 2 * y / size - 1 + 1 / size;
            
            // Within inner circle
            if ((newX ** 2 + newY ** 2) <= c.EYE_RADIUS ** 2) {
                maze[y][x] = false;
            }
            // Beyond cruciform bounds
            if ((newX ** 2 * newY ** 2 - c.CRUCIFORM_SWELL ** 2 * newX ** 2 - c.CRUCIFORM_SWELL ** 2 * newY ** 2) >= c.CRUCIFORM_SCALE) {
                maze[y][x] = false;
            }
        }
    }


    // Convert to big walls
    for (let x = 0; x < size - 1; x++) {
        for (let y = 0; y < size - 1; y++) {
            for (s = 5; s >= 2; s--) checkMazeForBlocks(x, y, s, maze);
        }
    }
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let spawnWall = false,
                d = {},
                scale = room.width / size;

            // Find spawn location and size
            for (let s = 5; s >= 1; s--) {
                if (maze[x][y] == s) {
                    d = {
                        x: (x * scale) + (scale * s / 2),
                        y: (y * scale) + (scale * s / 2),
                        s: scale * s,
                    };
                    spawnWall = true;
                    break
                }
            }
            if (spawnWall) {
                let o = new Entity({
                    x: d.x,
                    y: d.y
                });
                o.define("wall");
                o.SIZE = d.s * 0.5 - 2;
                o.team = TEAM_ENEMIES;
                o.protect();
                o.life();
                makeHitbox(o);
                walls.push(o);
            }
        }
    }
};

module.exports = { generateLabyrinth };