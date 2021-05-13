import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";

export const roomStateMap = {
    Waiting: "Waiting",
    Start: "Start",
    End: "End",
};

export const gamerResultMap = {
    Gaming: "gaming",
    Winner: "winner",
    Loser: "loser",
};

export const gameConditionMap = {
    /** 4gxgWJvbrUA55j5B7SzK : 依照獲勝場數, 選出最終獲得勝利的玩家  */
    cA: "4gxgWJvbrUA55j5B7SzK",
    /** GnQBE5XJjS7g6NOp5ytn : 希望最終剩下多少最終優勝者  */
    cB: "GnQBE5XJjS7g6NOp5ytn",
};

export interface RoomGamer {
    name: string;
    ready: boolean;
    /** gaming|winner|loser */
    result: string;
    prevChoose: string;
    score: number;
}

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
    creator: string;

    gamers: RoomGamer[];
    /** Waiting|Start|End */
    state: string;
    roomMaster: string;
}

export interface GameRoomSnapshot extends InsertGameRoomInfo {
    /** Waiting|Start|End */
    winners: string[];
    timestamp: number;
    creator: string;

    /** Waiting|Start|End */
    state: string;
    roomMaster: string;
}

export interface RoomGamerChoose {
    roomId: string;
    choose: string;
}

export const getGameRooms = async (): Promise<Result<Array<GameRoom>>> => {
    try {
        // eslint-disable-next-line no-shadow
        const getResult = await firebase
            .functions()
            .httpsCallable("getGameRooms")();

        if (!getResult.data?.result) throw new Error(getResult.data);

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
        // eslint-disable-next-line no-shadow
        const insertResult = await firebase
            .functions()
            .httpsCallable("insertGameRoom")({
            ...gameRoomInfo,
        });

        if (!insertResult.data?.result) throw new Error(insertResult.data);

        return resultOk(<GameRoom>insertResult.data.datas);
    } catch (e) {
        console.log("新增房間發生錯誤 ", e);
    }

    return resultError("新增房間發生錯誤", <GameRoom>{});
};

export const joinGameRoom = async (
    roomId: string
): Promise<Result<false | string>> => {
    try {
        // eslint-disable-next-line no-shadow
        const joinResult = await firebase
            .functions()
            .httpsCallable("joinGameRoom")({
            roomId,
        });

        if (!joinResult.data?.result) throw new Error(joinResult.data);

        return joinResult.data;
    } catch (e) {
        console.log("加入房間發生錯誤 #2", e);
    }

    return resultError("加入房間料發生錯誤", false);
};

export const leaveGameRoom = async (
    roomId: string
): Promise<Result<boolean>> => {
    try {
        // eslint-disable-next-line no-shadow
        const leaveResult = await firebase
            .functions()
            .httpsCallable("leaveGameRoom")({
            roomId,
        });

        if (!leaveResult.data?.result) throw new Error(leaveResult.data);
        return leaveResult.data;
    } catch (e) {
        console.log("離開房間發生錯誤 #2", e);
    }

    return resultError("離開房間發生錯誤", false);
};

export const gameStart = async (roomId: string): Promise<Result<boolean>> => {
    try {
        // eslint-disable-next-line no-shadow
        const gameStartResult = await firebase
            .functions()
            .httpsCallable("gameStart")({
            roomId,
        });

        if (!gameStartResult.data?.result)
            throw new Error(gameStartResult.data);

        return resultOk(gameStartResult.data.datas);
    } catch (e) {
        console.log("遊戲開始時 發生錯誤 ", e);
    }

    return resultError("遊戲開始時 發生錯誤");
};

export const gameReady = async (
    roomId: string,
    choose: string
): Promise<Result<boolean>> => {
    try {
        // eslint-disable-next-line no-shadow
        const gameReadyResult = await firebase
            .functions()
            .httpsCallable("gameReady")({
            roomId,
            choose,
        });

        if (!gameReadyResult.data?.result)
            throw new Error(gameReadyResult.data);

        return resultOk(gameReadyResult.data.datas);
    } catch (e) {
        console.log("遊戲準備時 發生錯誤 ", e);
    }

    return resultError("遊戲準備時 發生錯誤");
};
