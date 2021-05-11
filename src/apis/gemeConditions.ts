import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";

export interface GameCondition {
    /** doc ID. */
    conditionId: string;
    name: string;
    /** 玩法描述. */
    description: string;
} // GameCondition

export const getGameConditions = async (): Promise<
    Result<Array<GameCondition>>
> => {
    try {
        console.log("getGameConditions #1");
        // eslint-disable-next-line no-shadow
        const getGameConditions = await firebase
            .functions()
            .httpsCallable("getGameConditions")();
        console.log("getGameConditions #2");

        if (!getGameConditions.data?.result)
            throw new Error(getGameConditions.data);

        console.log("getGameConditions #3", getGameConditions.data);
        return resultOk(getGameConditions.data.datas);
    } catch (e) {
        console.log("載入玩家資料發生錯誤 ", e);
    }

    return resultError("載入玩家資料發生錯誤", []);
};
