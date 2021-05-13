import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiAuth from "../apis/auth";
import * as apiGamer from "../apis/gamer";
import * as apiGameRooms from "../apis/gameRooms";
import { Result, resultError, resultOk } from "../apis/result";
import addMessage from "../components/combo/message/Message";
import { RootState } from "./store";

interface GamerState extends apiGamer.Gamer {
    inSignIn: boolean;
    signInErrorMsg: string;
    onChangeJoinRoom: boolean;
}

const initialState = <GamerState>{
    inSignIn: false,
    onChangeJoinRoom: false,
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

        if (resultSignIn.result) {
            const resultGetGamerInfo = await apiGamer.getGamerInfo();

            return resultGetGamerInfo;
        }

        return resultError("登入失敗", <apiGamer.Gamer>{});
    }
); // signInAsync()

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
); // registerAsync()

export const getGamerInfoAsync = createAsyncThunk(
    "gamerRedux/getGamerInfoAsync",
    async (setErrorMsg: boolean) => {
        const resultGetGamerInfo = await apiGamer.getGamerInfo();

        if (resultGetGamerInfo.result) {
            return resultGetGamerInfo;
        }

        if (setErrorMsg)
            return resultError("取得玩家資訊失敗", <apiGamer.Gamer>{});
        return resultError("", <apiGamer.Gamer>{});
    }
); // getGamerInfoAsync()

export const joinGameRoomAsync = createAsyncThunk(
    "gamerRedux/joinGameRoomAsync",
    async (
        gameRoomId: string,
        { getState }
    ): Promise<Result<string | false>> => {
        const store = getState() as RootState;
        const { email, joinGameRoomId } = store.gamer;

        if (email === "") {
            return resultError("需要登入才能加入房間!!", false);
        }

        if (joinGameRoomId.length !== 0) {
            return resultError("不行同時加入兩間房間!!", false);
        }

        if (gameRoomId.length === 0) {
            return resultError("請確認房間ID!!", false);
        }

        const reulst = await apiGameRooms.joinGameRoom(gameRoomId);
        return reulst;
    }
); // joinGameRoomAsync()

export const leaveGameRoomAsync = createAsyncThunk(
    "gamerRedux/leaveGameRoomAsync",
    async (gameRoomId: string, { getState }): Promise<Result<boolean>> => {
        const store = getState() as RootState;
        const { email, joinGameRoomId } = store.gamer;

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
); // leaveGameRoomAsync()

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
            state.inSignIn = true;
            state.signInErrorMsg = "";
        });
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            if (action.payload.result) {
                const gamer = action.payload.datas;

                state.email = gamer.email;
                state.gamerName = gamer.gamerName;
                state.joinGameRoomId = gamer.joinGameRoomId;
                state.signInErrorMsg = "";
                addMessage("登入成功!", "Ok");
            } else {
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
                addMessage("登入發生些意外", "Fail");
            }
        });
        builder.addCase(signInAsync.rejected, (state) => {
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
                addMessage("註冊成功!", "Ok");
            } else {
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
                addMessage("似乎註冊失敗 嘗試登入不行在註冊看看!", "Fail");
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

            if (action.payload.result) {
                const gamer = action.payload.datas;
                state.email = gamer.email;
                state.gamerName = gamer.gamerName;
                state.joinGameRoomId = gamer.joinGameRoomId;
                state.signInErrorMsg = "";
                addMessage("更新玩家資訊成功", "Ok");
            } /* else {
                state.email = "";
                state.gamerName = "";
                state.joinGameRoomId = "";
                state.signInErrorMsg = action.payload.resultMsg;
            } */
        });

        builder.addCase(getGamerInfoAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            state.gamerName = "";
            state.joinGameRoomId = "";
            state.signInErrorMsg = "取得玩家資訊時出現未知的錯誤";
        });
        // getGamerInfoAsync : END

        // joinGameRoomAsync : START
        builder.addCase(joinGameRoomAsync.pending, (state) => {
            state.onChangeJoinRoom = true;
        });
        builder.addCase(joinGameRoomAsync.fulfilled, (state, action) => {
            state.onChangeJoinRoom = false;

            if (action.payload.datas !== false) {
                state.joinGameRoomId = action.payload.datas;
                if (action.payload.datas !== "")
                    addMessage("成功加入房間!", "Ok");
            } else {
                addMessage("加入房間失敗!", "Fail");
            }
        });

        builder.addCase(joinGameRoomAsync.rejected, (state) => {
            state.onChangeJoinRoom = false;
        });
        // joinGameRoomAsync : END

        // leaveGameRoomAsync : START
        builder.addCase(leaveGameRoomAsync.pending, (state) => {
            state.onChangeJoinRoom = true;
        });
        builder.addCase(leaveGameRoomAsync.fulfilled, (state, action) => {
            state.onChangeJoinRoom = false;

            if (action.payload.datas !== false) {
                state.joinGameRoomId = "";
                addMessage(`離開房間成功`, "Ok");
            } else {
                addMessage(`離開房間失敗 ${action.payload.resultMsg}`, "Fail");
            }
        });

        builder.addCase(leaveGameRoomAsync.rejected, (state) => {
            state.onChangeJoinRoom = false;
        });
        // leaveGameRoomAsync : END
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
export const selectOnChangeJoinRoom = (state: RootState): boolean =>
    state.gamer.onChangeJoinRoom;

export default gamerSlice.reducer;
