import {makeAutoObservable} from "mobx";
import {io} from "socket.io-client";
import {URL} from "../socket";
import {Socket} from "socket.io-client/build/esm/socket";

export interface GameInterface {
    next: "x"|"o",
    step: number,
    first_picks: Array<number>,
    second_picks: Array<number>,
}

class MainStore {

    users_count = 0
    user_id: string = ""

    game_start = {
        first: "",
        second: ""
    }

    game: GameInterface = {
        next: "x",
        step: 0,
        first_picks: [],
        second_picks: [],
    }

    socket: Socket

    winner = ""

    constructor() {
        makeAutoObservable(this)
        this.socket = io(URL, { withCredentials: true, })

        this.socket.on("connect", () => {
            this.setUserId(this.socket.id)
        })

        this.socket.on("users count", (users_count) => {
            this.setUsersCount(users_count)
        })

        this.socket.on("game process", (gameStat) => {
            this.setGame(gameStat.game)
            this.setGamers(gameStat.gamers)
        })

        this.socket.on("game end", (st) => {
            this.setWinner(st.winner)
        })
    }

    get canStart () {

        return true;
    }

    setGame (state: GameInterface) {
        this.game = state
    }

    setGamers (state: {first: string, second: string}) {
        this.game_start = state
    }

    setWinner (state: string) {
        this.winner = state
    }

    setUserId (state: string) {
        this.user_id = state
    }

    setUsersCount (state: number) {
        this.users_count = state
    }

}

export default new MainStore()