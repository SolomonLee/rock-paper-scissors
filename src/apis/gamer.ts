import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";

export interface Gamer {
    email: string;
    gamerName: string;
    joinGameRoomId: string;
}

const promiseTimer = (
    cb: () => Promise<Result<Gamer>>,
    msec = 1000
): Promise<Result<Gamer>> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(cb());
        }, msec);
    });

const getGamerInfoLoog = async (): Promise<Result<Gamer>> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return await promiseTimer(() => getGamerInfo(), 1000);
    } catch (e) {
        console.log("載入玩家資料發生錯誤 ", e);
    }

    return resultError("載入玩家資料發生錯誤", <Gamer>{});
};

export const getGamerInfo = async (): Promise<Result<Gamer>> => {
    try {
        // eslint-disable-next-line no-shadow
        const getGamerInfo = await firebase
            .functions()
            .httpsCallable("getGamerInfo")();

        if (typeof getGamerInfo.data.result === "undefined") throw new Error();

        if (getGamerInfo.data.result !== true) {
            if (getGamerInfo.data.resultMsg === "取得玩家資訊發生錯誤!") {
                const result = await promiseTimer(getGamerInfoLoog, 1000);
                return result;
            }
        } else if (firebase.auth().currentUser !== null) {
            return resultOk(getGamerInfo.data.datas);
        }

        // else  {
        //     return resultOk(getGamerInfo.data.datas);
        // }

        // else if (firebase.auth().currentUser !== null) {
        //     return resultOk(getGamerInfo.data.datas);
        // }
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
