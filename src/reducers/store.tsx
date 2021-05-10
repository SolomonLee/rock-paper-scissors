import { configureStore } from "@reduxjs/toolkit";
import gamerRedux from "./gamerRedux";

export const store = configureStore({
    reducer: {
        gamer: gamerRedux,
    },
});

export default store;
