import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiAuth from "../apis/auth";
import * as apiGamer from "../apis/gamer";
import * as apiGameRooms from "../apis/gameRooms";
import { resultError, resultOk } from "../apis/result";
import { RootState } from "./store";

interface GamerState extends apiGamer.Gamer {
    inSignIn: boolean;
    signInErrorMsg: string;
}

const initialState = <GamerState>{
    inSignIn: false,
    email: "",
    gamerName: "",
    joinGameRoomId: "",
    signInErrorMsg: "",
};

interface User {
    email: string;
    password: string;
}

export const signInAsync = createAsyncThunk(
    "gamerRedux/signInAsync",
    async ({ email, password }: User) => {
        const resultSignIn = await apiAuth.signIn(email, password);

        console.log(`signInAsync email:${email}, password:${password}`);
        if (resultSignIn.result) {
            const resultGetGamerInfo = await apiGamer.getGamerInfo();

            return resultGetGamerInfo;
        }

        return resultError("登入失敗", <apiGamer.Gamer>{});
    }
);

export const registerAsync = createAsyncThunk(
    "gamerRedux/registerAsync",
    async ({ email, password }: User) => {
        try {
            await apiAuth.register(email, password);
            return resultOk(<apiGamer.Gamer>{
                email,
                gamerName: email.slice(0, email.indexOf("@")),
                joinGameRoomId: "",
            });
        } catch (error) {
            return resultError("註冊失敗", <apiGamer.Gamer>{});
        }
    }
);

export const getGamerInfoAsync = createAsyncThunk(
    "gamerRedux/getGamerInfoAsync",
    async (setErrorMsg: boolean) => {
        console.log(`getGamerInfoAsync IN!`);
        const resultGetGamerInfo = await apiGamer.getGamerInfo();

        if (resultGetGamerInfo.result) {
            return resultGetGamerInfo;
            console.log(
                "getGamerInfoAsync resultGetGamerInfo",
                resultGetGamerInfo
            );
            return resultGetGamerInfo;
        }
        if (setErrorMsg)
            return resultError("取得玩家資訊失敗", <apiGamer.Gamer>{});
        return resultError("", <apiGamer.Gamer>{});
    }
);

export const joinGameRoomAsync = createAsyncThunk(
    "gamerRedux/joinGameRoomAsync",
    async (gameRoomId: string, { getState }) => {
        const { email, joinGameRoomId } = getState() as GamerState;

        if (email === "") {
            return resultError("需要登入才能加入房間!!", false);
        }

        if (joinGameRoomId.length !== 0) {
            return resultError("不行同時加入兩間房間!!", false);
        }

        if (gameRoomId.length !== 0) {
            return resultError("請確認房間ID!!", false);
        }

        const reulst = await apiGameRooms.joinGameRoom(gameRoomId);
        return reulst;
    }
);

export const leaveGameRoomAsync = createAsyncThunk(
    "gamerRedux/leaveGameRoomAsync",
    async (gameRoomId: string, { getState }) => {
        const { email, joinGameRoomId } = getState() as GamerState;

        if (email === "") {
            return resultError("需要登入才能離開房間!!", false);
        }

        if (joinGameRoomId.length === 0) {
            return resultError("尚未加入房間!!", false);
        }

        if (gameRoomId !== joinGameRoomId) {
            return resultError("請確認房間ID!!", false);
        }

        const reulst = await apiGameRooms.leaveGameRoom(gameRoomId);
        return reulst;
    }
);

export const gamerSlice = createSlice({
    name: "gamer",
    initialState,
    reducers: {
        signOut: (state) => {
            apiAuth.signOut();
            state.email = "";
            state.gamerName = "";
            state.joinGameRoomId = "";
            state.signInErrorMsg = "";
        },
    },
    extraReducers: (builder) => {
        // signInAsync : START
        builder.addCase(signInAsync.pending, (state) => {
            console.log("signInAsync pending!!!", state);
            state.inSignIn = true;
            state.signInErrorMsg = "";
        });
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            console.log("signInAsync fulfilled!!!", state, action);
            state.inSignIn = false;

            console.log(
                "signInAsync fulfilled action.payload.result",
                action.payload.result
            );
            if (action.payload.result) {
                const gamer = action.payload.datas;
                console.log("signInAsync fulfilled gamer", gamer);
                state.email = gamer.email;
                state.gamerName = gamer.gamerName;
                state.joinGameRoomId = gamer.joinGameRoomId;
                state.signInErrorMsg = "";
            } else {
                console.log(
                    "signInAsync fulfilled action.payload.result false"
                );
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
            }
        });
        builder.addCase(signInAsync.rejected, (state) => {
            console.log("signInAsync rejected!!!", state);
            state.inSignIn = false;
            state.email = "";
            state.gamerName = "";
            state.joinGameRoomId = "";
            state.signInErrorMsg = "登入時出現未知的錯誤";
        });
        // signInAsync : END

        // registerAsync : START
        builder.addCase(registerAsync.pending, (state) => {
            state.inSignIn = true;
            state.signInErrorMsg = "";
        });
        builder.addCase(registerAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            if (action.payload.result) {
                const gamer = action.payload.datas;
                state.email = gamer.email;
                state.gamerName = gamer.gamerName;
                state.joinGameRoomId = gamer.joinGameRoomId;
                state.signInErrorMsg = "";
            } else {
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
            }
        });

        builder.addCase(registerAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            state.gamerName = "";
            state.joinGameRoomId = "";
            state.signInErrorMsg = "註冊時出現未知的錯誤";
        });
        // registerAsync : END

        // getGamerInfoAsync : START
        builder.addCase(getGamerInfoAsync.pending, (state) => {
            state.inSignIn = true;
            state.signInErrorMsg = "";
        });
        builder.addCase(getGamerInfoAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            console.log("getGamerInfoAsync fulfilled!!", action.payload);
            if (action.payload.result) {
                const gamer = action.payload.datas;
                console.log("getGamerInfoAsync fulfilled!! gamer", gamer);
                state.email = gamer.email;
                state.gamerName = gamer.gamerName;
                state.joinGameRoomId = gamer.joinGameRoomId;
                state.signInErrorMsg = "";
            } else {
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
            }
        });

        builder.addCase(getGamerInfoAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            state.gamerName = "";
            state.joinGameRoomId = "";
            state.signInErrorMsg = "取得玩家資訊時出現未知的錯誤";
        });
        // getGamerInfoAsync : END
    },
});

export const { signOut } = gamerSlice.actions;

export const selectGamerEmail = (state: RootState): string => state.gamer.email;
export const selectGamerName = (state: RootState): string =>
    state.gamer.gamerName;
export const selectGamerJoinGameRoomId = (state: RootState): string =>
    state.gamer.joinGameRoomId;
export const selectGamerInSignIn = (state: RootState): boolean =>
    state.gamer.inSignIn;
export const selectGamerSignInErrorMsg = (state: RootState): string =>
    state.gamer.signInErrorMsg;

export default gamerSlice.reducer;
