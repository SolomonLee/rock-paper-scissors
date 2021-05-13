import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { gamerResultMap, RoomGamer } from "../../../apis/gameRooms";

import {
    gameReadyAsync,
    gameStartAsync,
    selectOnReadyOrStart,
} from "../../../reducers/roomsInfoRedux";

import Radio from "../../elements/Radio";
import addMessage from "../message/Message";

interface Props {
    gamerInfo: RoomGamer | null;
    isRoomMaster: boolean;
    isWaiting: boolean;
    gameRoomId: string;
}

const GamerSelf = ({
    gamerInfo,
    isRoomMaster,
    isWaiting,
    gameRoomId,
}: Props): JSX.Element | null => {
    const onReadyOrStart = useSelector(selectOnReadyOrStart);
    const dispatch = useDispatch();

    if (gamerInfo === null) return null;
    const [choose, setShoose] = useState("");
    // const [ready, setReady] = useState("");

    const readyForGame = () => {
        if (!gamerInfo.ready) {
            dispatch(gameReadyAsync({ roomId: gameRoomId, choose }));
        }
    };

    const startForGame = () => {
        if (gamerInfo.ready && !isWaiting) {
            dispatch(gameStartAsync(gameRoomId));
        }
    };

    useEffect(() => {
        if (isRoomMaster) {
            addMessage("你是房長喔", "Common");
        }
    }, [isRoomMaster]);

    let masterAndWaitingMsgJSX;
    if (isWaiting) {
        if (gamerInfo.ready)
            masterAndWaitingMsgJSX = <p>等待其他玩家中 .....</p>;
        else masterAndWaitingMsgJSX = null;
    } else if (isRoomMaster) {
        masterAndWaitingMsgJSX = (
            <>
                <button
                    className="btn btn_style1"
                    type="button"
                    onClick={startForGame}
                >
                    開始
                </button>
                <p>你是房長 你有資格開始了!</p>
            </>
        );
    } else {
        masterAndWaitingMsgJSX = <p>等待房長開始中 .....</p>;
    }

    let showJSX;

    if (gamerInfo.result === gamerResultMap.Gaming) {
        showJSX = (
            <>
                {onReadyOrStart ? (
                    <h2 className="box_mask">設定您的選擇中...</h2>
                ) : null}
                <div className="box_content">
                    <p>Hi, {gamerInfo.name}</p>
                    <p>目前你贏 {gamerInfo.score} 場</p>

                    {gamerInfo.ready ? (
                        <>
                            <h3>你的選擇 {choose}</h3>
                        </>
                    ) : (
                        <>
                            <h3>選擇你想要的</h3>
                            <Radio
                                thisValue="剪刀"
                                value={choose}
                                setValue={setShoose}
                            >
                                剪刀
                            </Radio>
                            <Radio
                                thisValue="石頭"
                                value={choose}
                                setValue={setShoose}
                            >
                                石頭
                            </Radio>
                            <Radio
                                thisValue="布"
                                value={choose}
                                setValue={setShoose}
                            >
                                布
                            </Radio>
                        </>
                    )}
                </div>
                <div className="box_bottom">
                    <div className="functions">
                        {!gamerInfo.ready ? (
                            <button
                                className="btn btn_style1"
                                type="button"
                                onClick={readyForGame}
                            >
                                我選好了!
                            </button>
                        ) : null}
                        {masterAndWaitingMsgJSX}
                    </div>
                    {gamerInfo.prevChoose !== "" ? (
                        <p>先前的選擇: {gamerInfo.prevChoose}</p>
                    ) : null}
                </div>
            </>
        );
    } else {
        showJSX = (
            <div className="gamer_result" data-result={gamerInfo.result}>
                {gamerInfo.result === gamerResultMap.Winner
                    ? "恭喜你獲勝!"
                    : "你已經輸了!"}
            </div>
        );
    }

    return (
        <div className="gamer_self_box">
            <div className="box_title">你在這邊</div>
            {showJSX}
        </div>
    );
};

export default GamerSelf;
