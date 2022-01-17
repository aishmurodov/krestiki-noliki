import {Request, Response} from "express";
import {Socket} from "socket.io";

const express = require('express');
const router = express();
const http = require('http');
const server = http.createServer(router);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

router.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello world</h1>');
});

let users: Array<string> = []

let game: {
    next: "x"|"o",
    step: number,
    first_picks: Array<number>,
    second_picks: Array<number>,
} = {

    next: "x",
    step: 0,
    first_picks: [],
    second_picks: [],
}

let cells = Array(9).fill(null)

let playingGames = {
    first: "",
    second: ""
}


io.on('connection', (socket: Socket) => {

    if (users.indexOf(socket.id) === -1) {
        users.push(socket.id)
    }

    io.emit("users count", users.length)

    socket.emit("game process", {
        game: game,
        gamers: playingGames
    })

    socket.on("disconnect", () => {
        users = users.filter((user) => user !== socket.id)
        io.emit("users count", users.length)

        if (playingGames.first === socket.id || playingGames.second === socket.id) {

            game = {
                next: "x",
                step: 0,
                first_picks: [],
                second_picks: [],
            }
            playingGames = {
                first: "",
                second: ""
            }
            cells = Array(9).fill(null)
            io.emit("game end", { winner: playingGames.first === socket.id ? "O" : "X" })
            io.emit("game process", {
                game: game,
                gamers: playingGames
            })
        }
    })

    socket.on("game pick", (x: number) => {
        let ok = false

        if (playingGames.first === "" || playingGames.second === "") {

            if (playingGames.first !== socket.id && playingGames.second !== socket.id) {

                if (playingGames.first === "") {
                    if (game.first_picks.indexOf(x) === -1 && game.second_picks.indexOf(x) === -1) {
                        ok = true
                        playingGames.first = socket.id
                        game.first_picks.push(x)
                        game.next = "o"
                        game.step += 1
                        cells[x-1] = "X"
                    }
                } else {
                    if (game.first_picks.indexOf(x) === -1 && game.second_picks.indexOf(x) === -1) {
                        ok = true
                        playingGames.second = socket.id
                        game.second_picks.push(x)
                        game.next = "x"
                        game.step += 1
                        cells[x-1] = "O"
                    }
                }

            }

        } else if (playingGames.first === socket.id || playingGames.second === socket.id) {

            if (playingGames.first === socket.id) {
                if (game.next === "x") {
                    if (game.first_picks.indexOf(x) === -1 && game.second_picks.indexOf(x) === -1) {
                        ok = true
                        game.first_picks.push(x)
                        game.next = "o"
                        game.step += 1
                        cells[x-1] = "X"
                    }
                }
            } else {
                if (game.next === "o") {
                    if (game.first_picks.indexOf(x) === -1 && game.second_picks.indexOf(x) === -1) {
                        ok = true
                        game.second_picks.push(x)
                        game.next = "x"
                        game.step += 1
                        cells[x-1] = "O"
                    }
                }
            }

        }

        if (ok) {
            let winner = null
            if (game.step >= 5) {
                winner = calculateWinner(cells)
            }

            if (winner || game.step >= 9) {
                cells = Array(9).fill(null)

                game = {
                    next: "x",
                    step: 0,
                    first_picks: [],
                    second_picks: [],
                }
                playingGames = {
                    first: "",
                    second: ""
                }
                io.emit("game end", { winner: !winner ? "N" : winner })
            }

            io.emit("game process", {
                game: game,
                gamers: playingGames
            })
        }

    })

})

function calculateWinner(squares: Array<string|null>) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

server.listen(4000, () => {
    console.log('listening on *:4000');
});