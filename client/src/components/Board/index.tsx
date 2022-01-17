import React, {useCallback, useState} from "react"
import "./styles/index.scss"
import {observer} from "mobx-react-lite";
import MainStore from "../../stores/MainStore";


const Board: React.FunctionComponent = () => {

    const pickRow = useCallback((x) => {
        if (!MainStore.canStart) {
            return false;
        }

        MainStore.socket.emit("game pick", x)
    }, [])

    return <div className="Board">

        <div className="Board__name">Крестики-нолики</div>
        <div className="Board__content">
            <div className="Board__content__online">
                { MainStore.users_count } игроков в сети
            </div>
            <div className="Board__game">
                <div className="Board__game__row">
                    <span className="Board__game__row__square" onClick={() => {pickRow(1)}}>
                        {MainStore.game.first_picks.indexOf(1) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(1) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(2)}}>
                        {MainStore.game.first_picks.indexOf(2) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(2) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(3)}}>
                        {MainStore.game.first_picks.indexOf(3) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(3) !== -1 ? "O" : ""}
                    </span>
                </div>
                <div className="Board__game__row">
                    <span className="Board__game__row__square" onClick={() => {pickRow(4)}}>
                        {MainStore.game.first_picks.indexOf(4) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(4) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(5)}}>
                        {MainStore.game.first_picks.indexOf(5) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(5) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(6)}}>
                        {MainStore.game.first_picks.indexOf(6) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(6) !== -1 ? "O" : ""}
                    </span>
                </div>
                <div className="Board__game__row">
                    <span className="Board__game__row__square" onClick={() => {pickRow(7)}}>
                        {MainStore.game.first_picks.indexOf(7) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(7) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(8)}}>
                        {MainStore.game.first_picks.indexOf(8) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(8) !== -1 ? "O" : ""}
                    </span>
                    <span className="Board__game__row__square" onClick={() => {pickRow(9)}}>
                        {MainStore.game.first_picks.indexOf(9) !== -1 ? "X" : ""}
                        {MainStore.game.second_picks.indexOf(9) !== -1 ? "O" : ""}
                    </span>
                </div>
            </div>
            <div className="Board__content__winner" style={{height: "19px"}}>
            { MainStore.game.step === 0 && MainStore.winner !== "N" && MainStore.winner !== ""  ? `Победитель: ${ MainStore.winner }` : ( MainStore.game.step === 0 && MainStore.winner === "N" ? "Ничья" : "") }
            </div>

        </div>
    </div>
}

export default observer(Board)