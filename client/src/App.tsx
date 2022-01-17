import React, {useEffect} from 'react';
import Board from "./components/Board";
import {io, Manager} from "socket.io-client";
import {URL} from "./socket";
import MainStore from "./stores/MainStore";
import {observer} from "mobx-react-lite";

function App() {


    return (
        <div className="App">
            <div className="App__inner">
                <Board />
                <div className="App__inner__footer">
                    Сделал Ишмуродов Абдурахмон. ОЭМИБ-ПИ01-19-2
                </div>
            </div>
        </div>
    );
}

export default observer(App);
