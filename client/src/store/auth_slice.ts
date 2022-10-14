import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postLogin } from "../services/auth/auth_service";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (
    userData: { userName: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await postLogin({
        ...userData,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Define a type for the slice state
interface AuthState {
  status: "idle" | "pending" | "succeeded" | "failed";
}

// Define the initial state using that type
const initialState: AuthState = {
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      localStorage.removeItem("token");
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      localStorage.setItem("token", action.payload);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + action.payload;
    });

    builder.addCase(login.pending, (state, action) => {
      state.status = "pending";
    });

    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const isAuthenticated = () => {
  return getJWT() != null;
};

export const getJWT = () => {
  console.log(localStorage.getItem("token"));
  return localStorage.getItem("token");
};

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
