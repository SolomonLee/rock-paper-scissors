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
        console.log("getGamerInfo #1");
        // eslint-disable-next-line no-shadow
        const getGamerInfo = await firebase
            .functions()
            .httpsCallable("getGamerInfo")();
        console.log("getGamerInfo #2");

        if (!getGamerInfo.data?.result) throw new Error(getGamerInfo.data);

        console.log("getGamerInfo #3", getGamerInfo.data);
        return resultOk(getGamerInfo.data.datas);
    } catch (e) {
        console.log("載入玩家資料發生錯誤 ", e);
    }

    return resultError("載入玩家資料發生錯誤", <Gamer>{});
};
