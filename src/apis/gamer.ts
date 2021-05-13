import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";

export interface Gamer {
    email: string;
    gamerName: string;
    joinGameRoomId: string;
}

export const getGamerInfo = async (): Promise<Result<Gamer>> => {
    try {
        // eslint-disable-next-line no-shadow
        const getGamerInfo = await firebase
            .functions()
            .httpsCallable("getGamerInfo")();

        if (!getGamerInfo.data?.result) throw new Error(getGamerInfo.data);

        return resultOk(getGamerInfo.data.datas);
    } catch (e) {
        console.log("載入玩家資料發生錯誤 ", e);
    }

    return resultError("載入玩家資料發生錯誤", <Gamer>{});
};

export const getGamerJoinRoomId = async (): Promise<Result<string>> => {
    try {
        // eslint-disable-next-line no-shadow
        const getGamerJoinRoomId = await firebase
            .functions()
            .httpsCallable("getGamerJoinRoomId")();

        if (!getGamerJoinRoomId.data?.result)
            throw new Error(getGamerJoinRoomId.data);

        return resultOk(getGamerJoinRoomId.data.datas);
    } catch (e) {
        console.log("取得玩家加入房間ID發生錯誤", e);
    }

    return resultError("取得玩家加入房間ID發生錯誤", "");
};
