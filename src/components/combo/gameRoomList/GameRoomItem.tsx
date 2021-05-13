import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameRoom } from "../../../apis/gameRooms";
import { selectGameConditions } from "../../../reducers/roomsInfoRedux";
import {
    joinGameRoomAsync,
    selectGamerEmail,
} from "../../../reducers/gamerRedux";

// interface Props extends GameRoom {
//     joingameroomid: string;
// }

const roomStateNameMap = new Map([
    ["Waiting", "等待中"],
    ["Start", "進行中"],
    ["End", "已結束"],
]);

const GameRoomItem = ({
    state,
    roomMaster,
    gamers,
    roomName,
    winnerAward,
    loserAward,
    roomId,
    // joingameroomid,
    gameConditionKey,
    gameConditionValue,
}: GameRoom): JSX.Element => {
    const gameConditions = useSelector(selectGameConditions);
    const gamerEmail = useSelector(selectGamerEmail);

    const dispatch = useDispatch();

    const conditionName =
        gameConditions.find(
            (gameCondition) => gameCondition.conditionId === gameConditionKey
        )?.name || "";

    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleJoinGame = () => {
        dispatch(joinGameRoomAsync(roomId));
    };

    return (
        <div className="room_list_item" data-open={isOpen ? "" : null}>
            <div className="item_title">
                <div className="info">
                    <div className="roomState" data-state={state}>
                        {roomStateNameMap.get(state) || null}
                    </div>
                    <div className="name">{roomName}</div>
                </div>
                <div className="function">
                    <button
                        type="button"
                        className="btn btn_style1"
                        onClick={handleToggle}
                    >
                        {isOpen ? "縮起" : "展開"}
                    </button>
                </div>
            </div>

            <div className="item_content">
                {roomMaster === "" ? null : (
                    <p className="info">房主: {roomMaster}</p>
                )}
                <p className="info">贏家獎勵: {winnerAward}</p>
                <p className="info">輸家獎勵: {loserAward}</p>
                <p className="info">房間人數: {gamers}</p>
                <p className="info">玩法: {conditionName}</p>
                <p className="info">獲勝條件: {gameConditionValue}</p>
                {/* <div className="creator">建立者: {roomdata.creator}</div> */}
            </div>
            <div className="item_bottom">
                {gamerEmail.length === 0 ? (
                    <span>登入後才可加入戰局</span>
                ) : (
                    <button
                        className="btn btn_style3"
                        type="button"
                        onClick={handleJoinGame}
                    >
                        加入戰局
                    </button>
                )}
                {/* {joingameroomid === "" || joingameroomid === roomId ? (
                    .btn
                    <Link to={`/GameRoom/${roomId}`}>加入戰局</Link>
                ) : null} */}
            </div>
        </div>
    );
};

export default GameRoomItem;
