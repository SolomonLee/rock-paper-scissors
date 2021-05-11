import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectGamerJoinGameRoomId,
    selectGamerEmail,
} from "../../../reducers/gamerRedux";
import {
    selectGameConditions,
    selectGameRooms,
    selectOnUpdateData,
    selectGameCondition,
    updateDataAsync,
    filter,
} from "../../../reducers/roomsInfoRedux";

import GameRoomItem from "./GameRoomItem";
import AddGameRoomItem from "./AddGameRoomItem";

const GameRoomList = (): JSX.Element => {
    const joinGameRoomId = useSelector(selectGamerJoinGameRoomId);
    const gamerEmail = useSelector(selectGamerEmail);

    const gameRooms = useSelector(selectGameRooms);
    const gameConditions = useSelector(selectGameConditions);
    const loading = useSelector(selectOnUpdateData);
    const gameCondition = useSelector(selectGameCondition);

    const dispatch = useDispatch();

    const refAutoUpdateTimer = useRef<NodeJS.Timeout>();

    const handleUpdateData = () => {
        dispatch(updateDataAsync());

        // refAutoUpdateTimer.current = setTimeout(() => {
        //     handleUpdateData();
        // }, 10000);
    };

    const handleChangeCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(filter(e.target.value));
    };

    useEffect(() => {
        setTimeout(() => handleUpdateData());

        return () => {
            if (typeof refAutoUpdateTimer.current !== "undefined")
                clearTimeout(refAutoUpdateTimer.current);
        };
    }, []);

    return (
        <div className="game_list_box">
            <div className="box_title">房間列表</div>
            <div className="box_content">
                {gamerEmail !== "" ? <AddGameRoomItem /> : ""}
                <div className="list_filter">
                    <p>獲勝條件:</p>
                    <select
                        className="form-control"
                        onChange={handleChangeCondition}
                        value={gameCondition}
                    >
                        <option value="">ALL</option>
                        {typeof gameConditions === "object" &&
                            gameConditions.map((condition) => (
                                <option
                                    key={condition.description}
                                    value={condition.conditionId}
                                >
                                    {condition.name}
                                </option>
                            ))}
                    </select>
                </div>
                <ul>
                    {typeof gameRooms === "object" &&
                        gameRooms.map((gameRoom) => (
                            <li key={gameRoom.roomId}>
                                <GameRoomItem
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...gameRoom}
                                    joingameroomid={joinGameRoomId}
                                />
                            </li>
                        ))}
                </ul>
                {gameRooms.length === 0 && loading ? "努力載入中!!" : null}
            </div>
        </div>
    );
};

export default GameRoomList;
