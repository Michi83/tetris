const IDIOTRIS = false
const ZOOM = 3
// colors
const WHITE = "#FFFFFF"
const BRIGHT = "#0080FF"
const DARK = "#0000FF"
const BLACK = "#000000"

let canvas = document.getElementById("main-canvas")
let context = canvas.getContext("2d")
let fillRect = (i, j, width, height, color) => {
    context.fillStyle = color
    context.fillRect(ZOOM * i, ZOOM * j, ZOOM * width, ZOOM * height)
}

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
        this.paintBackground()
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

        let drawBlock = (i, j, style) => {
            i--
            fillRect(8 * j, 8 * i, 8, 8, BLACK)
            switch (style) {
                case 1:
                fillRect(8 * j + 1, 8 * i + 1, 7, 6, BRIGHT)
                fillRect(8 * j + 2, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 6, 1, 1, DARK)
                break

                case 2:
                fillRect(8 * j, 8 * i + 1, 8, 6, BRIGHT)
                fillRect(8 * j, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 3, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 7, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 6, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 6, 1, 1, DARK)
                break

                case 3:
                fillRect(8 * j, 8 * i + 1, 7, 6, BRIGHT)
                fillRect(8 * j, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 3, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 6, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 6, 1, 1, DARK)
                break

                case 4:
                fillRect(8 * j + 1, 8 * i + 1, 6, 7, BRIGHT)
                fillRect(8 * j + 4, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 6, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 6, 1, 1, DARK)
                break

                case 5:
                fillRect(8 * j + 1, 8 * i, 6, 8, BRIGHT)
                fillRect(8 * j + 3, 8 * i, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 3, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 6, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 7, 1, 1, DARK)
                break

                case 6:
                fillRect(8 * j + 1, 8 * i, 6, 7, BRIGHT)
                fillRect(8 * j + 6, 8 * i, 1, 1, DARK)
                fillRect(8 * j + 3, 8 * i + 1, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 5, 8 * i + 2, 1, 1, DARK)
                fillRect(8 * j + 3, 8 * i + 3, 1, 1, DARK)
                fillRect(8 * j + 1, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 6, 8 * i + 4, 1, 1, DARK)
                fillRect(8 * j + 4, 8 * i + 5, 1, 1, DARK)
                fillRect(8 * j + 2, 8 * i + 6, 1, 1, DARK)
                break

                case 7:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, BRIGHT)
                fillRect(8 * j + 2, 8 * i + 2, 4, 4, BLACK)
                fillRect(8 * j + 3, 8 * i + 3, 2, 2, WHITE)
                break

                case 8:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, DARK)
                break

                case 9:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, WHITE)
                fillRect(8 * j + 2, 8 * i + 2, 4, 4, BLACK)
                break

                case 10:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, DARK)
                fillRect(8 * j + 2, 8 * i + 2, 4, 4, BLACK)
                fillRect(8 * j + 3, 8 * i + 3, 2, 2, WHITE)
                break

                case 11:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, BRIGHT)
                fillRect(8 * j + 2, 8 * i + 2, 1, 3, WHITE)
                fillRect(8 * j + 3, 8 * i + 2, 3, 1, WHITE)
                fillRect(8 * j + 5, 8 * i + 3, 1, 3, BLACK)
                fillRect(8 * j + 2, 8 * i + 5, 3, 1, BLACK)
                break

                case 12:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, BRIGHT)
                fillRect(8 * j + 3, 8 * i + 3, 2, 2, BLACK)
                break

                case 13:
                fillRect(8 * j + 1, 8 * i + 1, 6, 6, BRIGHT)
                fillRect(8 * j + 1, 8 * i + 1, 1, 5, WHITE)
                fillRect(8 * j + 2, 8 * i + 1, 5, 1, WHITE)
                fillRect(8 * j + 6, 8 * i + 2, 1, 5, DARK)
                fillRect(8 * j + 1, 8 * i + 6, 5, 1, DARK)
                break
            }
        }

        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1]
            let style = coordinates[2]
            drawBlock(i, j, style)
        }
        if (!this.gameOver) {
            for (let coordinates of this.nextPattern) {
                let i = coordinates[0] + 13
                let j = coordinates[1] + 15
                let style = coordinates[2]
                drawBlock(i, j, style)
            }
        }
        for (let i = 1; i < 19; i++) {
            for (let j = 2; j < 12; j++) {
                let style = this.blocks[i][j]
                if (style !== 0) {
                    drawBlock(i, j, style)
                }
            }
        }
    }

    paintBackground() {
        fillRect(0, 0, 160, 144, BLACK)
        fillRect(7, 0, 98, 144, WHITE)
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
