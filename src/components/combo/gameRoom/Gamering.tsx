import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import firebase from "firebase/app";
import "firebase/firestore";

import GamerSelf from "./GamerSelf";
import GamerOther from "./GamerOther";

import {
    selectGamerJoinGameRoomId,
    selectGamerEmail,
    selectOnChangeJoinRoom,
    leaveGameRoomAsync,
} from "../../../reducers/gamerRedux";

import {
    selectGameRooms,
    selectGameConditions,
    updateDataAsync,
} from "../../../reducers/roomsInfoRedux";

import {
    GameRoom,
    GameRoomSnapshot,
    RoomGamer,
    gameConditionMap,
} from "../../../apis/gameRooms";
import LoadingItem from "../../elements/Loading";

const roomStateNameMap = new Map([
    ["Waiting", "等待中"],
    ["Start", "進行中"],
    ["End", "已結束"],
]);

const Gamering = (): JSX.Element | null => {
    const dispatch = useDispatch();
    const gamerEmail = useSelector(selectGamerEmail);
    const gamerJoinGameRoomId = useSelector(selectGamerJoinGameRoomId);
    const gameConditions = useSelector(selectGameConditions);
    const gameRooms = useSelector(selectGameRooms);
    const onChangeJoinRoom = useSelector(selectOnChangeJoinRoom);

    const [roomGamer, setRoomGamer] = useState<RoomGamer | null>(null);
    const [roomGamers, setRoomGamers] = useState<RoomGamer[]>([]);
    const [gamerCount, setGamerCount] = useState(0);
    const [readyCount, setReadyCount] = useState(0);
    const [roomMaster, setRoomMaster] = useState("");
    const [gameConditionKey, setGameConditionKey] = useState("");
    const [gameConditionValue, setGameConditionValue] = useState(999);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isRoomMaster, setIsRoomMaster] = useState(false);
    const [roomState, setRoomState] = useState("");
    const [roomInfo, setRoomInfo] = useState<GameRoom | null>(null);

    const refSubscribe = useRef<null | (() => void)>(null);
    const refSubscribe2 = useRef<null | (() => void)>(null);
    const refIsMount = useRef(false);

    const refUpdateDataTimer = useRef<NodeJS.Timeout | null>(null);

    const autoSubscribe = () => {
        if (gamerJoinGameRoomId !== "") {
            setTimeout(() => {
                refSubscribe.current = firebase
                    .firestore()
                    .collection("game-rooms")
                    .doc(gamerJoinGameRoomId)
                    .onSnapshot((doc) => {
                        if (refIsMount.current) {
                            const roomdata = doc.data() as GameRoomSnapshot;

                            if (typeof roomdata !== "undefined") {
                                setIsRoomMaster(
                                    roomdata.roomMaster === gamerEmail
                                );
                                setRoomMaster(roomdata.roomMaster);
                                setRoomState(roomdata.state);

                                setGameConditionKey(roomdata.gameConditionKey);
                                setGameConditionValue(
                                    roomdata.gameConditionValue
                                );
                            }
                        }
                    });

                refSubscribe2.current = firebase
                    .firestore()
                    .collection("game-rooms")
                    .doc(gamerJoinGameRoomId)
                    .collection("gamers")
                    .onSnapshot((querySnapshot) => {
                        if (refIsMount.current) {
                            let tempReadyCount = 0;
                            const tempRoomGamers: RoomGamer[] = [];

                            querySnapshot.forEach((doc) => {
                                const dataRoomGamer = doc.data() as RoomGamer;

                                if (dataRoomGamer.ready) tempReadyCount += 1;

                                if (doc.id === gamerEmail) {
                                    setRoomGamer(dataRoomGamer);
                                } else {
                                    tempRoomGamers.push(dataRoomGamer);
                                }
                            });

                            setGamerCount(querySnapshot.docs.length);
                            setReadyCount(tempReadyCount);
                            setRoomGamers(tempRoomGamers);
                        }
                    });
            });
        } else {
            setTimeout(() => {
                autoSubscribe();
            }, 100);
        }
    };

    const handleLeave = () => {
        dispatch(leaveGameRoomAsync(gamerJoinGameRoomId));
    };

    useEffect(() => {
        refIsMount.current = true;
        autoSubscribe();

        return () => {
            refIsMount.current = false;

            if (refSubscribe.current !== null) {
                refSubscribe.current();
            }

            if (refSubscribe2.current !== null) {
                refSubscribe2.current();
            }
        };
    }, []);

    useEffect(() => {
        const tempGameRoom = gameRooms.find(
            (gameRoom) => gameRoom.roomId === gamerJoinGameRoomId
        );

        if (typeof tempGameRoom !== "undefined") {
            setRoomInfo(tempGameRoom);
        } else {
            if (refUpdateDataTimer.current !== null)
                clearTimeout(refUpdateDataTimer.current);

            if (gameRooms.length === 0) {
                refUpdateDataTimer.current = setTimeout(() => {
                    dispatch(updateDataAsync());
                }, 2000);
            }
        }
    }, [gameRooms, gamerJoinGameRoomId]);

    useEffect(() => {
        if (gameConditionKey === gameConditionMap.cA) {
            if (gamerCount <= 1 || readyCount !== gamerCount) {
                setIsWaiting(true);
            } else {
                setIsWaiting(false);
            }
        } else if (gameConditionKey === gameConditionMap.cB) {
            if (gamerCount <= gameConditionValue || readyCount !== gamerCount) {
                setIsWaiting(true);
            } else {
                setIsWaiting(false);
            }
        }
    }, [gamerCount, readyCount, gameConditionKey, gameConditionValue]);

    if (gamerJoinGameRoomId === "") return <Redirect to="/" />;
    if (roomGamer === null || roomInfo === null) return null;

    return (
        <>
            {onChangeJoinRoom ? (
                <LoadingItem loading content="退出戰局中" type="" />
            ) : null}
            <div className="gaming_title">
                <div className="name">歡迎來到 {roomInfo.roomName} ~</div>

                <div className="functions">
                    <button
                        className="btn btn_style1"
                        type="button"
                        onClick={handleLeave}
                    >
                        離開戰局
                    </button>
                </div>
            </div>
            <div className="gaming_room_info">
                <p className="roomState" data-state={roomState}>
                    {roomStateNameMap.get(roomState) || null}
                </p>
                <p>
                    獲勝方式：
                    {gameConditions.find(
                        (gameCondition) =>
                            gameCondition.conditionId ===
                            roomInfo.gameConditionKey
                    )?.name || ""}
                </p>
                <p>
                    獲勝條件：
                    {roomInfo.gameConditionValue}
                </p>
                <p>
                    獲勝獎勵：
                    {roomInfo.winnerAward}
                </p>
                <p>
                    輸家獎勵：
                    {roomInfo.loserAward}
                </p>
                <p>
                    玩家總數/準備：
                    {`${gamerCount}/${readyCount}`}
                </p>
                <p>
                    房間ID：
                    {roomInfo.roomId}
                </p>
                <p>
                    房長：
                    {roomMaster}
                </p>
            </div>
            <div className="gaming_info">
                <GamerSelf
                    gamerInfo={roomGamer}
                    isRoomMaster={isRoomMaster}
                    isWaiting={isWaiting}
                    gameRoomId={gamerJoinGameRoomId}
                />
                <GamerOther roomGamers={roomGamers} />
            </div>
        </>
    );
};

export default Gamering;
