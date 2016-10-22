const IDIOTRIS = false

// colors
const WHITE = "#FFFFFF"
const BRIGHT = "#C0C0C0"
const DARK = "#808080"
const BLACK = "#000000"

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
        this.board = []
        for (let i = 0; i < 20; i++) {
            let row = []
            for (let j = 0; j < 14; j++) {
                row.push(i === 19 || j < 2 || j >= 12 ? 13 : 0)
            }
            this.board.push(row)
        }
        this.gameOver = false
        this.pattern = patterns[Math.floor(patterns.length * Math.random())]
        this.coordinates = [0, 5]
        this.paint()
    }

    clockwise() {
        for (let coordinates of this.pattern.clockwise) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1]
            if (this.board[i][j] !== 0) {
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
            if (this.board[i][j] !== 0) {
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
                    this.board[i][j] = 13
                }
            }
        } else {
            // test if we can move down
            let canMove = true
            for (let coordinates of this.pattern) {
                let i = coordinates[0] + this.coordinates[0] + 1
                let j = coordinates[1] + this.coordinates[1]
                if (this.board[i][j] !== 0) {
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
                    this.board[i][j] = style
                }
                // find complete lines
                for (let i = 1; i < 19; i++) {
                    let complete = true
                    for (let j = 2; j < 12; j++) {
                        if (this.board[i][j] === 0) {
                            complete = false
                            break
                        }
                    }
                    if (complete) {
                        // remove complete line
                        for (let i2 = i; i2 > 0; i2--) {
                            for (let j = 2; j < 12; j++) {
                                this.board[i2][j] = this.board[i2 - 1][j]
                            }
                        }
                    }
                }
                // create new pattern
                this.pattern = patterns[Math.floor(patterns.length * Math.random())]
                this.coordinates = [0, 5]
                for (let coordinates of this.pattern) {
                    let i = coordinates[0] + this.coordinates[0]
                    let j = coordinates[1] + this.coordinates[1]
                    if (this.board[i][j] !== 0) {
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
            if (this.board[i][j] !== 0) {
                // cannot move
                return
            }
        }
        this.coordinates[1]--
        this.paint()
    }

    paint() {
        let canvas = document.getElementById("main-canvas")
        let context = canvas.getContext("2d")
        context.clearRect(32, 0, 160, 288)

        let drawBlock = (i, j, style) => {
            i--
            switch (style) {
                case 1:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 14, 12)
                context.fillStyle = DARK
                context.fillRect(16 * j + 4, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 12, 2, 2)
                break

                case 2:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j, 16 * i + 2, 16, 12)
                context.fillStyle = DARK
                context.fillRect(16 * j, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 6, 2, 2)
                context.fillRect(16 * j, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 6, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 14, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 12, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 12, 2, 2)
                break

                case 3:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j, 16 * i + 2, 14, 12)
                context.fillStyle = DARK
                context.fillRect(16 * j, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 6, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 12, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 12, 2, 2)
                break

                case 4:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 14)
                context.fillStyle = DARK
                context.fillRect(16 * j + 8, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 12, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 12, 2, 2)
                break

                case 5:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i, 12, 16)
                context.fillStyle = DARK
                context.fillRect(16 * j + 6, 16 * i, 2, 2)
                context.fillRect(16 * j + 12, 16 * i, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 6, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 12, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 14, 2, 2)
                break

                case 6:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i, 12, 14)
                context.fillStyle = DARK
                context.fillRect(16 * j + 12, 16 * i + 0, 2, 2)
                context.fillRect(16 * j + 6, 16 * i + 2, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 10, 16 * i + 4, 2, 2)
                context.fillRect(16 * j + 6, 16 * i + 6, 2, 2)
                context.fillRect(16 * j + 2, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 12, 16 * i + 8, 2, 2)
                context.fillRect(16 * j + 8, 16 * i + 10, 2, 2)
                context.fillRect(16 * j + 4, 16 * i + 12, 2, 2)
                break

                case 7:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = BLACK
                context.fillRect(16 * j + 4, 16 * i + 4, 8, 8)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 6, 16 * i + 6, 4, 4)
                break

                case 8:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = DARK
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                break

                case 9:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = BLACK
                context.fillRect(16 * j + 4, 16 * i + 4, 8, 8)
                break

                case 10:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = DARK
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = BLACK
                context.fillRect(16 * j + 4, 16 * i + 4, 8, 8)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 6, 16 * i + 6, 4, 4)
                break

                case 11:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 4, 16 * i + 4, 2, 6)
                context.fillRect(16 * j + 6, 16 * i + 4, 6, 2)
                context.fillStyle = BLACK
                context.fillRect(16 * j + 10, 16 * i + 6, 2, 6)
                context.fillRect(16 * j + 4, 16 * i + 10, 6, 2)
                break

                case 12:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = BLACK
                context.fillRect(16 * j + 6, 16 * i + 6, 4, 4)
                break

                case 13:
                context.fillStyle = BLACK
                context.fillRect(16 * j, 16 * i, 16, 16)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j + 2, 16 * i + 2, 12, 12)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 2, 16 * i + 2, 2, 10)
                context.fillRect(16 * j + 4, 16 * i + 2, 10, 2)
                context.fillStyle = DARK
                context.fillRect(16 * j + 12, 16 * i + 4, 2, 10)
                context.fillRect(16 * j + 2, 16 * i + 12, 10, 2)
                break
            }
        }

        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1]
            let style = coordinates[2]
            drawBlock(i, j, style)
        }
        for (let i = 1; i < 19; i++) {
            for (let j = 2; j < 12; j++) {
                let style = this.board[i][j]
                drawBlock(i, j, style)
            }
        }
    }

    paintBackground() {
        let canvas = document.getElementById("main-canvas")
        let context = canvas.getContext("2d")
        context.fillStyle = BLACK
        context.fillRect(0, 0, 320, 288)
        context.fillStyle = WHITE
        context.fillRect(14, 0, 196, 288)
        for (let i = 0; i < 24; i++) {
            for (let j of [1, 12]) {
                context.fillStyle = BLACK
                context.fillRect(16 * j, 12 * i, 16, 12)
                context.fillStyle = BRIGHT
                context.fillRect(16 * j, 12 * i, 2, 4)
                context.fillRect(16 * j + 4, 12 * i, 6, 4)
                context.fillRect(16 * j + 12, 12 * i, 4, 4)
                context.fillRect(16 * j, 12 * i + 6, 6, 4)
                context.fillRect(16 * j + 8, 12 * i + 6, 6, 4)
                context.fillStyle = WHITE
                context.fillRect(16 * j + 4, 12 * i, 2, 2)
                context.fillRect(16 * j + 12, 12 * i, 2, 2)
                context.fillRect(16 * j, 12 * i + 6, 2, 2)
                context.fillRect(16 * j + 8, 12 * i + 6, 2, 2)
            }
        }
    }

    right() {
        for (let coordinates of this.pattern) {
            let i = coordinates[0] + this.coordinates[0]
            let j = coordinates[1] + this.coordinates[1] + 1
            if (this.board[i][j] !== 0) {
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
