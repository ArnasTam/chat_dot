import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth_slice";
import serversReducer from "./server_slice";
import singleServerReducer from "./single_server_slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    servers: serversReducer,
    singleServer: singleServerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}cd
export type AppDispatch = typeof store.dispatch;
