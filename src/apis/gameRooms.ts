import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";

interface RoomGamerState {
    name: string;
    prevChoose: string;
    ready: boolean;
    result: string;
}

interface RoomGamers {
    [email: string]: RoomGamerState;
}

interface RoomState {
    gamers: RoomGamers;
    /** Waiting|Start|End */
    state: string;
    roomMaster: string;
}

// interface RoomChoose {
/** 存放玩家 Email : 剪刀 石頭 布 */
//     [email: string]: string;
// }

export interface InsertGameRoomInfo {
    gameConditionKey: string;
    gameConditionValue: number;
    loserAward: string;
    winnerAward: string;
    roomName: string;
}

export interface GameRoom extends InsertGameRoomInfo {
    /** doc ID. */
    roomId: string;
    /** Waiting|Start|End */
    winners: string[];
    timestamp: number;
    roomState: RoomState;
    creator: string;
}

export const getGameRooms = async (): Promise<Result<Array<GameRoom>>> => {
    try {
        console.log("getGameRooms #1");
        // eslint-disable-next-line no-shadow
        const getResult = await firebase
            .functions()
            .httpsCallable("getGameRooms")();
        console.log("getGameRooms #2");

        if (!getResult.data?.result) throw new Error(getResult.data);

        console.log("getGameRooms #3", getResult.data);
        return resultOk(<GameRoom[]>getResult.data.datas);
    } catch (e) {
        console.log("載入房間發生錯誤 ", e);
    }

    return resultError("載入房間發生錯誤", []);
};

export const insertGameRoom = async (
    gameRoomInfo: InsertGameRoomInfo
): Promise<Result<GameRoom>> => {
    try {
        console.log("insertGameRoom #1");
        // eslint-disable-next-line no-shadow
        const insertResult = await firebase
            .functions()
            .httpsCallable("insertGameRoom")({
            ...gameRoomInfo,
        });
        console.log("insertGameRoom #2");

        if (!insertResult.data?.result) throw new Error(insertResult.data);

        console.log("insertGameRoom #3", insertResult.data);
        return resultOk(<GameRoom>insertResult.data.datas);
    } catch (e) {
        console.log("新增房間發生錯誤 ");
        console.log(e);
    }

    return resultError("新增房間發生錯誤", <GameRoom>{});
};

export const joinGameRoom = async (
    roomId: string
): Promise<Result<boolean>> => {
    try {
        console.log("joinGameRoom #1");
        // eslint-disable-next-line no-shadow
        const joinResult = await firebase
            .functions()
            .httpsCallable("joinGameRoom")({
            roomId,
        });
        console.log("joinGameRoom #2");

        if (!joinResult.data?.result) throw new Error(joinResult.data);

        console.log("joinGameRoom #3", joinResult.data);
        if (joinResult.data.datas === true) return resultOk(true);
        console.log("加入房間發生錯誤 #1 ", joinResult.data);
    } catch (e) {
        console.log("加入房間發生錯誤 #2", e);
    }

    return resultError("加入房間料發生錯誤", false);
};

export const leaveGameRoom = async (
    roomId: string
): Promise<Result<boolean>> => {
    try {
        console.log("leaveGameRoom #1");
        // eslint-disable-next-line no-shadow
        const leaveResult = await firebase
            .functions()
            .httpsCallable("leaveGameRoom")({
            roomId,
        });
        console.log("leaveGameRoom #2");

        if (!leaveResult.data?.result) throw new Error(leaveResult.data);

        console.log("leaveGameRoom #3", leaveResult.data);
        if (leaveResult.data.datas === true) return resultOk(true);
        console.log("離開房間發生錯誤 #1 ", leaveResult.data);
    } catch (e) {
        console.log("離開房間發生錯誤 #2", e);
    }

    return resultError("離開房間發生錯誤", false);
};
