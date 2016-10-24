const IDIOTRIS = false

// define tetromino patterns
let iPattern1 = [[2, 0, 1], [2, 1, 2], [2, 2, 2], [2, 3, 3]]
let iPattern2 = [[0, 1, 4], [1, 1, 5], [2, 1, 5], [3, 1, 6]]
let jPattern1 = [[2, 0, 7], [2, 1, 7], [2, 2, 7], [3, 2, 7]]
let jPattern2 = [[1, 1, 7], [2, 1, 7], [3, 0, 7], [3, 1, 7]]
let jPattern3 = [[1, 0, 7], [2, 0, 7], [2, 1, 7], [2, 2, 7]]
let jPattern4 = [[1, 1, 7], [1, 2, 7], [2, 1, 7], [3, 1, 7]]
let lPattern1 = [[2, 0, 8], [2, 1, 8], [2, 2, 8], [3, 0, 8]]
let lPattern2 = [[1, 0, 8], [1, 1, 8], [2, 1, 8], [3, 1, 8]]
let lPattern3 = [[1, 2, 8], [2, 0, 8], [2, 1, 8], [2, 2, 8]]
let lPattern4 = [[1, 1, 8], [2, 1, 8], [3, 1, 8], [3, 2, 8]]
let oPattern1 = [[2, 1, 9], [2, 2, 9], [3, 1, 9], [3, 2, 9]]
let sPattern1 = [[2, 1, 10], [2, 2, 10], [3, 0, 10], [3, 1, 10]]
let sPattern2 = [[1, 0, 10], [2, 0, 10], [2, 1, 10], [3, 1, 10]]
let tPattern1 = [[2, 0, 11], [2, 1, 11], [2, 2, 11], [3, 1, 11]]
let tPattern2 = [[1, 1, 11], [2, 0, 11], [2, 1, 11], [3, 1, 11]]
let tPattern3 = [[1, 1, 11], [2, 0, 11], [2, 1, 11], [2, 2, 11]]
let tPattern4 = [[1, 1, 11], [2, 1, 11], [2, 2, 11], [3, 1, 11]]
let zPattern1 = [[2, 0, 12], [2, 1, 12], [3, 1, 12], [3, 2, 12]]
let zPattern2 = [[1, 1, 12], [2, 0, 12], [2, 1, 12], [3, 0, 12]]

// creates circular, doubly-linked lists (useful for rotation)
let setRotation = (...patterns) => {
    for (let i = 0; i < patterns.length; i++) {
        patterns[i].clockwise = patterns[(i + 1) % patterns.length]
        if (i === 0) {
            patterns[i].counterclockwise = patterns[patterns.length - 1]
        } else {
            patterns[i].counterclockwise = patterns[i - 1]
        }
    }
}

setRotation(iPattern1, iPattern2)
setRotation(jPattern1, jPattern2, jPattern3, jPattern4)
setRotation(lPattern1, lPattern2, lPattern3, lPattern4)
setRotation(oPattern1)
setRotation(sPattern1, sPattern2)
setRotation(tPattern1, tPattern2, tPattern3, tPattern4)
setRotation(zPattern1, zPattern2)
let patterns
if (IDIOTRIS) {
    patterns = [iPattern1]
} else {
    patterns = [iPattern1, jPattern1, lPattern1, oPattern1, sPattern1, tPattern1, zPattern1]
}

class Tetris {
    constructor() {
        paintBackground()
        this.blocks = []
        for (let i = 0; i < 20; i++) {
            let row = []
            for (let j = 0; j < 14; j++) {
                row.push(i === 19 || j < 2 || j >= 12 ? 13 : 0)
            }
            this.blocks.push(row)
        }
        this.gameOver = false
        this.pattern = patterns[Math.floor(patterns.length * Math.random())]
        this.nextPattern = patterns[Math.floor(patterns.length * Math.random())]
        this.coordinates = [0, 5]
        this.lines = 0
        this.paint()
    }

    clockwise() {
        for (let coordinates of this.pattern.clockwise) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1]
            if (this.blocks[i][j] !== 0) {
                // cannot move
                return
            }
        }
        this.pattern = this.pattern.clockwise
        this.paint()
    }

    counterclockwise() {
        for (let coordinates of this.pattern.counterclockwise) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1]
            if (this.blocks[i][j] !== 0) {
                // cannot move
                return
            }
        }
        this.pattern = this.pattern.counterclockwise
        this.paint()
    }

    down() {
        if (this.gameOver) {
            for (let i = 18; i >= 1; i--) {
                for (let j = 2; j < 12; j++) {
                    this.blocks[i][j] = 13
                }
            }
        } else {
            // test if we can move down
            let canMove = true
            for (let coordinates of this.pattern) {
                let i = coordinates[0] + this.coordinates[0] + 1
                let j = coordinates[1] + this.coordinates[1]
                if (this.blocks[i][j] !== 0) {
                    canMove = false
                    break
                }
            }
            if (canMove) {
                // we can move down
                this.coordinates[0]++
            } else {
                // we cannot move down
                for (let coordinates of this.pattern) {
                    let i = coordinates[0] + this.coordinates[0]
                    let j = coordinates[1] + this.coordinates[1]
                    let style = coordinates[2]
                    this.blocks[i][j] = style
                }
                // find complete lines
                for (let i = 1; i < 19; i++) {
                    let complete = true
                    for (let j = 2; j < 12; j++) {
                        if (this.blocks[i][j] === 0) {
                            complete = false
                            break
                        }
                    }
                    if (complete) {
                        this.lines++
                        // remove complete line
                        for (let i2 = i; i2 > 0; i2--) {
                            for (let j = 2; j < 12; j++) {
                                this.blocks[i2][j] = this.blocks[i2 - 1][j]
                            }
                        }
                    }
                }
                // create new pattern
                this.pattern = this.nextPattern
                this.nextPattern = patterns[Math.floor(patterns.length * Math.random())]
                this.coordinates = [0, 5]
                for (let coordinates of this.pattern) {
                    let i = coordinates[0] + this.coordinates[0]
                    let j = coordinates[1] + this.coordinates[1]
                    if (this.blocks[i][j] !== 0) {
                        this.gameOver = true
                    }
                }
            }
        }
        this.paint()
    }

    left() {
        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1] - 1
            if (this.blocks[i][j] !== 0) {
                // cannot move
                return
            }
        }
        this.coordinates[1]--
        this.paint()
    }

    paint() {
        fillRect(16, 0, 80, 144, WHITE)
        fillRect(120, 104, 32, 32, WHITE)
        // active block
        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0] - 1
            let j = coordinates[1] + this.coordinates[1]
            let style = coordinates[2]
            putBlock(i, j, style)
        }
        // preview
        if (!this.gameOver) {
            for (let coordinates of this.nextPattern) {
                let i = coordinates[0] + 12
                let j = coordinates[1] + 15
                let style = coordinates[2]
                putBlock(i, j, style)
            }
        }
        // dead blocks
        for (let i = 1; i < 19; i++) {
            for (let j = 2; j < 12; j++) {
                let style = this.blocks[i][j]
                if (style !== 0) {
                    putBlock(i - 1, j, style)
                }
            }
        }
        // line counter
        putNumber(10, 17, this.lines)
    }

    right() {
        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1] + 1
            if (this.blocks[i][j] !== 0) {
                // cannot move
                return
            }
        }
        this.coordinates[1]++
        this.paint()
    }
}

// graphic helper functions
const ZOOM = 3
const WHITE = "#80FF80"
const BRIGHT = "#00FF00"
const DARK = "#008000"
const BLACK = "#004000"
const COLORS = [BLACK, DARK, BRIGHT, WHITE]
let canvas = document.getElementById("main-canvas")
let context = canvas.getContext("2d")

let fillRect = (i, j, width, height, color) => {
    context.fillStyle = color
    context.fillRect(ZOOM * i, ZOOM * j, ZOOM * width, ZOOM * height)
}

let paintBackground = () => {
    fillRect(0, 0, 160, 144, BLACK)
    fillRect(7, 0, 98, 144, WHITE)
    // score area
    fillRect(105, 13, 55, 22, WHITE)
    fillRect(105, 14, 55, 7, DARK)
    fillRect(105, 22, 55, 1, DARK)
    fillRect(105, 33, 55, 1, DARK)
    fillRect(109, 5, 46, 14, WHITE)
    fillRect(110, 6, 44, 12, DARK)
    fillRect(111, 7, 42, 10, WHITE)
    putString(1, 14, "SCORE")
    // level area
    fillRect(109, 45, 46, 22, WHITE)
    fillRect(110, 46, 44, 20, DARK)
    fillRect(111, 47, 42, 18, WHITE)
    putString(6, 14, "LEVEL")
    // lines area
    fillRect(109, 69, 46, 22, WHITE)
    fillRect(110, 70, 44, 20, DARK)
    fillRect(111, 71, 42, 18, WHITE)
    putString(9, 14, "LINES")
    // preview area
    fillRect(115, 99, 42, 42, BRIGHT)
    fillRect(116, 100, 40, 40, WHITE)
    fillRect(117, 101, 38, 38, DARK)
    fillRect(118, 102, 36, 36, BLACK)
    fillRect(119, 103, 34, 34, WHITE)
    // walls
    for (let i = 0; i < 24; i++) {
        for (let j of [1, 12]) {
            fillRect(8 * j, 6 * i, 8, 6, BLACK)
            fillRect(8 * j, 6 * i, 1, 2, BRIGHT)
            fillRect(8 * j + 2, 6 * i, 3, 2, BRIGHT)
            fillRect(8 * j + 6, 6 * i, 2, 2, BRIGHT)
            fillRect(8 * j, 6 * i + 3, 3, 2, BRIGHT)
            fillRect(8 * j + 4, 6 * i + 3, 3, 2, BRIGHT)
            fillRect(8 * j + 2, 6 * i, 1, 1, WHITE)
            fillRect(8 * j + 6, 6 * i, 1, 1, WHITE)
            fillRect(8 * j, 6 * i + 3, 1, 1, WHITE)
            fillRect(8 * j + 4, 6 * i + 3, 1, 1, WHITE)
        }
    }
}

let blocks = [
    [
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 2, 2, 1, 2, 2],
        [0, 2, 2, 2, 2, 2, 2, 2],
        [0, 1, 2, 2, 1, 2, 1, 2],
        [0, 2, 2, 2, 2, 2, 2, 2],
        [0, 2, 1, 2, 2, 2, 1, 2],
        [0, 2, 2, 2, 1, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 2, 1, 2, 1, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 1, 2],
        [2, 2, 1, 2, 2, 2, 2, 2],
        [1, 2, 2, 2, 2, 1, 2, 2],
        [2, 2, 2, 1, 2, 2, 2, 1],
        [2, 1, 2, 2, 2, 1, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 2, 2, 2, 1, 2, 2, 0],
        [2, 2, 1, 2, 2, 2, 2, 0],
        [2, 2, 2, 2, 2, 1, 2, 0],
        [2, 1, 2, 1, 2, 2, 2, 0],
        [2, 2, 2, 2, 2, 2, 1, 0],
        [2, 2, 1, 2, 1, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 1, 2, 2, 0],
        [0, 2, 1, 2, 2, 2, 1, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 1, 2, 2, 1, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 1, 0],
        [0, 2, 1, 2, 1, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
    ],
    [
        [0, 2, 2, 1, 2, 2, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 1, 2, 1, 0],
        [0, 2, 1, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 1, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 1, 2, 0],
        [0, 2, 1, 2, 2, 2, 2, 0],
    ],
    [
        [0, 2, 2, 2, 2, 2, 1, 0],
        [0, 2, 2, 1, 2, 2, 2, 0],
        [0, 1, 2, 2, 2, 1, 2, 0],
        [0, 2, 2, 1, 2, 2, 2, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 2, 2, 2, 1, 2, 2, 0],
        [0, 2, 1, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 0, 0, 0, 0, 2, 0],
        [0, 2, 0, 3, 3, 0, 2, 0],
        [0, 2, 0, 3, 3, 0, 2, 0],
        [0, 2, 0, 0, 0, 0, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 0, 0, 0, 0, 3, 0],
        [0, 3, 0, 0, 0, 0, 3, 0],
        [0, 3, 0, 0, 0, 0, 3, 0],
        [0, 3, 0, 0, 0, 0, 3, 0],
        [0, 3, 3, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 3, 3, 0, 1, 0],
        [0, 1, 0, 3, 3, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 3, 3, 3, 3, 2, 0],
        [0, 2, 3, 2, 2, 0, 2, 0],
        [0, 2, 3, 2, 2, 0, 2, 0],
        [0, 2, 0, 0, 0, 0, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 0, 0, 2, 2, 0],
        [0, 2, 2, 0, 0, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 2, 2, 2, 2, 1, 0],
        [0, 3, 2, 2, 2, 2, 1, 0],
        [0, 3, 2, 2, 2, 2, 1, 0],
        [0, 3, 2, 2, 2, 2, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
]

let putBlock = (i, j, style) => {
    let block = blocks[style]
    for (let i2 = 0; i2 < 8; i2++) {
        for (let j2 = 0; j2 < 8; j2++) {
            let color = COLORS[block[i2][j2]]
            fillRect(8 * j + j2, 8 * i + i2, 1, 1, color)
        }
    }
}

let chars = {
    "0": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "1": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "2": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "3": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "4": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "5": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "6": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "7": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "8": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "9": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "C": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "E": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "I": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "L": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "N": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "O": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "R": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "S": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "V": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 0, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
}

let putchar = (i, j, char) => {
    fillRect(8 * j, 8 * i, 8, 8, WHITE)
    for (let i2 = 0; i2 < 8; i2++) {
        for (let j2 = 0; j2 < 8; j2++) {
            if (chars[char][i2][j2] === 1) {
                fillRect(8 * j + j2, 8 * i + i2, 1, 1, BLACK)
            }
        }
    }
}

let putString = (i, j, string) => {
    for (let j2 = 0; j2 < string.length; j2++) {
        putchar(i, j + j2, string[j2])
    }
}

let putNumber = (i, j, number) => {
    number += ""
    putString(i, j - number.length + 1, number)
}

// initialization
let tetris = new Tetris()
document.addEventListener(
    "keydown",
    (event) => {
        switch (event.key) {
            case ".":
            tetris.clockwise()
            break

            case ",":
            tetris.counterclockwise()
            break

            case "ArrowDown":
            tetris.down()
            break

            case "ArrowLeft":
            tetris.left()
            break

            case "ArrowRight":
            tetris.right()
            break
        }
    }
)
setInterval(() => {tetris.down()}, 1000)
