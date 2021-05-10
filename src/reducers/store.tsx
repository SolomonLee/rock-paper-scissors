import { configureStore } from "@reduxjs/toolkit";
import gamerRedux from "./gamerRedux";

export const store = configureStore({
    reducer: {
        gamer: gamerRedux,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
