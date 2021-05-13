import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiGameRooms from "../apis/gameRooms";
import { RoomGamerChoose } from "../apis/gameRooms";
import * as apiGemeConditions from "../apis/gemeConditions";
import { resultError, resultOk } from "../apis/result";
import { RootState } from "./store";
import addMessage from "../components/combo/message/Message";

const initialState = {
    onInsertGameRoom: false,
    onUpdateData: false,
    onReadyOrStart: false,
    gameRooms: <apiGameRooms.GameRoom[]>[],
    resultGameRooms: <apiGameRooms.GameRoom[]>[],
    gameConditions: <apiGemeConditions.GameCondition[]>[],
    gameCondition: "",
    lastCreateGameRoomId: "",
};

const filterGameRoom = (
    gameCondition: string,
    gameRooms: apiGameRooms.GameRoom[]
): apiGameRooms.GameRoom[] =>
    gameRooms.filter(
        (gameRoom) =>
            (gameRoom.gameConditionKey === gameCondition ||
                gameCondition === "") &&
            gameRoom.state === "Waiting"
    );

export const insertGameRoomAsync = createAsyncThunk(
    "roomsInfoRedux/insertGameRoomAsync",
    async (gameRoomInfo: apiGameRooms.InsertGameRoomInfo) => {
        try {
            const result = await apiGameRooms.insertGameRoom(gameRoomInfo);
            return result;
        } catch (error) {
            console.log("新增房間失敗 insertGameRoomAsync", error);
        }

        return resultError("新增房間失敗", <apiGameRooms.GameRoom>{});
    }
);

export const updateDataAsync = createAsyncThunk(
    "roomsInfoRedux/updateDataAsync",
    async () => {
        try {
            const result = await Promise.all([
                apiGameRooms.getGameRooms(),
                apiGemeConditions.getGameConditions(),
            ]).then(([resultGameRooms, resultGameConditions]) =>
                resultOk({
                    resultGameRooms: resultGameRooms.datas,
                    resultGameConditions: resultGameConditions.datas,
                })
            );
            return result;
        } catch (error) {
            console.log("更新資料發生錯誤", error);
        }

        return resultError("更新資料發生錯誤", {
            resultGameRooms: <apiGameRooms.GameRoom[]>[],
            resultGameConditions: <apiGemeConditions.GameCondition[]>[],
        });
    }
);

export const gameStartAsync = createAsyncThunk(
    "roomsInfoRedux/gameStartAsync",
    async (roomId: string) => {
        try {
            const result = await apiGameRooms.gameStart(roomId);

            return result;
        } catch (error) {
            console.log("gameStartAsync Catch Error", error);
        }

        return resultError("遊戲開始時 發生錯誤", false);
    }
);

export const gameReadyAsync = createAsyncThunk(
    "roomsInfoRedux/gameReadyAsync",
    async ({ roomId, choose }: RoomGamerChoose) => {
        try {
            const result = await apiGameRooms.gameReady(roomId, choose);

            return result;
        } catch (error) {
            console.log("gameReadyAsync Catch Error", error);
        }

        return resultError("遊戲準備時 發生錯誤", false);
    }
);

export const roomsInfoSlice = createSlice({
    name: "roomsInfo",
    initialState,
    reducers: {
        filter: (state, action) => {
            state.gameCondition = action.payload;

            state.resultGameRooms = filterGameRoom(
                action.payload,
                state.gameRooms
            );
        },
        clearLastRoomId: (state) => {
            state.lastCreateGameRoomId = "";
        },
    },
    extraReducers: (builder) => {
        // insertGameRoomAsync : START
        builder.addCase(insertGameRoomAsync.pending, (state) => {
            state.onInsertGameRoom = true;
        });
        builder.addCase(insertGameRoomAsync.fulfilled, (state, action) => {
            state.onInsertGameRoom = false;

            if (action.payload.result) {
                state.gameRooms.unshift(action.payload.datas);
                if (
                    action.payload.datas.gameConditionKey ===
                        state.gameCondition ||
                    state.gameCondition === ""
                ) {
                    // const resultGameRooms = [...state.resultGameRooms];
                    // resultGameRooms.push(action.payload.datas);
                    // state.resultGameRooms = resultGameRooms;
                    state.resultGameRooms.unshift(action.payload.datas);
                }
                addMessage(`新增房間成功!`, "Ok");
            }
            state.lastCreateGameRoomId = action.payload.datas.roomId;
        });
        builder.addCase(insertGameRoomAsync.rejected, (state) => {
            state.onInsertGameRoom = false;
            addMessage("新增房間時 發生意料外的事情!", "Fail");
        });
        // insertGameRoomAsync : END

        // updateDataAsync : START
        builder.addCase(updateDataAsync.pending, (state) => {
            state.onUpdateData = true;
        });
        builder.addCase(updateDataAsync.fulfilled, (state, action) => {
            state.onUpdateData = false;
            if (action.payload.result) {
                const { resultGameConditions } = action.payload.datas;
                const { resultGameRooms } = action.payload.datas;

                state.gameRooms = resultGameRooms;
                state.gameConditions = resultGameConditions;
                state.resultGameRooms = filterGameRoom(
                    state.gameCondition,
                    resultGameRooms
                );
                addMessage("成功更新房間資訊!", "Ok");
            }
        });
        builder.addCase(updateDataAsync.rejected, (state) => {
            state.onUpdateData = false;
        });
        // updateDataAsync : END

        // gameStartAsync : START
        builder.addCase(gameStartAsync.pending, (state) => {
            state.onReadyOrStart = true;
        });
        builder.addCase(gameStartAsync.fulfilled, (state) => {
            state.onReadyOrStart = false;
        });
        builder.addCase(gameStartAsync.rejected, (state) => {
            state.onReadyOrStart = false;
        });
        // gameStartAsync : END

        // gameReadyAsync : START
        builder.addCase(gameReadyAsync.pending, (state) => {
            state.onReadyOrStart = true;
        });
        builder.addCase(gameReadyAsync.fulfilled, (state) => {
            state.onReadyOrStart = false;
        });
        builder.addCase(gameReadyAsync.rejected, (state) => {
            state.onReadyOrStart = false;
        });
        // gameReadyAsync : END
    },
});

export const { filter, clearLastRoomId } = roomsInfoSlice.actions;

export const selectOnInsertGameRoom = (state: RootState): boolean =>
    state.roomsInfo.onInsertGameRoom;
export const selectOnUpdateData = (state: RootState): boolean =>
    state.roomsInfo.onUpdateData;
export const selectOnReadyOrStart = (state: RootState): boolean =>
    state.roomsInfo.onReadyOrStart;
export const selectGameRooms = (state: RootState): apiGameRooms.GameRoom[] =>
    state.roomsInfo.resultGameRooms;
export const selectGameConditions = (
    state: RootState
): apiGemeConditions.GameCondition[] => state.roomsInfo.gameConditions;
export const selectGameCondition = (state: RootState): string =>
    state.roomsInfo.gameCondition;
export const selectLastCreateGameRoomId = (state: RootState): string =>
    state.roomsInfo.lastCreateGameRoomId;

export default roomsInfoSlice.reducer;
