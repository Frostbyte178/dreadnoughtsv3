let { normal, nest } = require('../tiles/misc.js'),

room = [];
for (let i = 0; i < 15; i++) {
    room.push(Array(15).fill(normal));
}
for (let x = 6; x <= 8; x++) {
    room[5][x] = nest
}
for (let y = 6; y <= 8; y++) {
    for (let x = 5; x <= 9; x++) {
        room[y][x] = nest
    }
}
for (let x = 6; x <= 8; x++) {
    room[9][x] = nest
}
module.exports = room;