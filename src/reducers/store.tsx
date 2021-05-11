import { configureStore } from "@reduxjs/toolkit";
import gamerRedux from "./gamerRedux";
import roomsInfoRedux from "./roomsInfoRedux";

export const store = configureStore({
    reducer: {
        gamer: gamerRedux,
        roomsInfo: roomsInfoRedux,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
