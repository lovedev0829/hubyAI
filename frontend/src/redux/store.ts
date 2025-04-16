// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";

export const store = configureStore({
  reducer: {
    document: documentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
