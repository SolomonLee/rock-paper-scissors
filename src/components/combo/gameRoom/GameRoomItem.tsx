import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GameRoom } from "../../../apis/gameRooms";
import { selectGameConditions } from "../../../reducers/roomsInfoRedux";

interface Props extends GameRoom {
    joingameroomid: string;
}

const roomStateNameMap = new Map([
    ["Waiting", "等待中"],
    ["Start", "進行中"],
    ["End", "已結束"],
]);

const GameRoomItem = ({
    roomState,
    roomName,
    winnerAward,
    loserAward,
    roomId,
    joingameroomid,
    gameConditionKey,
    gameConditionValue,
}: Props): JSX.Element => {
    const gameConditions = useSelector(selectGameConditions);
    const conditionName =
        gameConditions.find(
            (gameCondition) => gameCondition.conditionId === gameConditionKey
        )?.name || "";

    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="room_list_item" data-open={isOpen ? "" : null}>
            <div className="item_title">
                <div className="info">
                    <div className="roomState" data-state={roomState.state}>
                        {roomStateNameMap.get(roomState.state) || null}
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
                {roomState.roomMaster === "" ? null : (
                    <p className="info">房主: {roomState.roomMaster}</p>
                )}
                <p className="info">贏家獎勵: {winnerAward}</p>
                <p className="info">輸家獎勵: {loserAward}</p>
                <p className="info">
                    房間人數: {Object.keys(roomState.gamers).length}
                </p>
                <p className="info">玩法: {conditionName}</p>
                <p className="info">獲勝條件: {gameConditionValue}</p>
                {/* <div className="creator">建立者: {roomdata.creator}</div> */}
            </div>
            <div className="item_bottom">
                {joingameroomid === "" || joingameroomid === roomId ? (
                    <Link to={`/GameRoom/${roomId}`}>進入</Link>
                ) : null}
            </div>
        </div>
    );
};

export default GameRoomItem;
