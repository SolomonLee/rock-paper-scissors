import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiGameRooms from "../apis/gameRooms";
import * as apiGemeConditions from "../apis/gemeConditions";
import { resultError, resultOk } from "../apis/result";
import { RootState } from "./store";

const initialState = {
    onInsertGameRoom: false,
    onUpdateData: false,
    gameRooms: <apiGameRooms.GameRoom[]>[],
    resultGameRooms: <apiGameRooms.GameRoom[]>[],
    gameConditions: <apiGemeConditions.GameCondition[]>[],
    gameCondition: "",
};

const filterGameRoom = (
    gameCondition: string,
    gameRooms: apiGameRooms.GameRoom[]
): apiGameRooms.GameRoom[] =>
    gameRooms.filter(
        (gameRoom) =>
            gameRoom.gameConditionKey === gameCondition || gameCondition === ""
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
            console.log("test updateDataAsync #2", result);
            return result;
        } catch (error) {
            console.log("更新資料發生錯誤", error);
        }

        console.log("test updateDataAsync #1");
        return resultError("更新資料發生錯誤", {
            resultGameRooms: <apiGameRooms.GameRoom[]>[],
            resultGameConditions: <apiGemeConditions.GameCondition[]>[],
        });
    }
);

export const roomsInfoSlice = createSlice({
    name: "roomsInfo",
    initialState,
    reducers: {
        filter: (state, action) => {
            console.log("filter");
            state.gameCondition = action.payload;

            state.resultGameRooms = filterGameRoom(
                action.payload,
                state.gameRooms
            );
        },
    },
    extraReducers: (builder) => {
        // updateDataAsync : START
        builder.addCase(insertGameRoomAsync.pending, (state) => {
            state.onInsertGameRoom = true;
        });
        builder.addCase(insertGameRoomAsync.fulfilled, (state, action) => {
            state.onInsertGameRoom = false;

            console.log("insertGameRoomAsync #1", action.payload);
            if (action.payload.result) {
                console.log("insertGameRoomAsync #2", action.payload.datas);

                // const gameRooms = [...state.gameRooms];
                // gameRooms.push(action.payload.datas);
                // state.gameRooms = gameRooms;
                state.gameRooms.unshift(action.payload.datas);
                // state.gameRooms = gameRooms;
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
            }
            console.log("insertGameRoomAsync #3");
        });
        builder.addCase(insertGameRoomAsync.rejected, (state) => {
            state.onInsertGameRoom = false;
        });

        // updateDataAsync : END

        // updateDataAsync : START
        builder.addCase(updateDataAsync.pending, (state) => {
            state.onUpdateData = true;
        });
        builder.addCase(updateDataAsync.fulfilled, (state, action) => {
            state.onUpdateData = false;
            console.log("test updateDataAsync #3");
            if (action.payload.result) {
                const { resultGameConditions } = action.payload.datas;
                const { resultGameRooms } = action.payload.datas;
                console.log("test updateDataAsync #4", resultGameConditions);
                console.log("test updateDataAsync #5", resultGameRooms);
                console.log(
                    "test updateDataAsync #6",
                    filterGameRoom(state.gameCondition, resultGameRooms)
                );

                state.gameRooms = resultGameRooms;
                state.gameConditions = resultGameConditions;
                state.resultGameRooms = filterGameRoom(
                    state.gameCondition,
                    resultGameRooms
                );
            }
        });
        builder.addCase(updateDataAsync.rejected, (state) => {
            state.onUpdateData = false;
        });
        // updateDataAsync : END
    },
});

export const { filter } = roomsInfoSlice.actions;

export const selectOnInsertGameRoom = (state: RootState): boolean =>
    state.roomsInfo.onInsertGameRoom;
export const selectOnUpdateData = (state: RootState): boolean =>
    state.roomsInfo.onUpdateData;
export const selectGameRooms = (state: RootState): apiGameRooms.GameRoom[] =>
    state.roomsInfo.resultGameRooms;
export const selectGameConditions = (
    state: RootState
): apiGemeConditions.GameCondition[] => state.roomsInfo.gameConditions;
export const selectGameCondition = (state: RootState): string =>
    state.roomsInfo.gameCondition;

export default roomsInfoSlice.reducer;
