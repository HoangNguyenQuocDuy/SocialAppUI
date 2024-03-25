import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountSlice from "./slice/accountSlice";
import postSlice from "./slice/postSlice";
import appSlice from "./slice/appSlice";
import commentSlice from "./slice/commentSlice";
import roomSlice from "./slice/roomSlice";
import messageSlice from "./slice/messageSlice";

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    account: accountSlice,
    posts: postSlice,
    app: appSlice,
    comments: commentSlice,
    messages: messageSlice,
    rooms: roomSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export const persistor = persistStore(store)
