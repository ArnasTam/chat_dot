import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addServer,
  deleteServer,
  getAllServers,
  updateServer,
} from "../services/server_service";
import { Server } from "../types/server";

export const getServers = createAsyncThunk(
  "server/getAll",
  async (arg, { rejectWithValue }) => {
    try {
      return await getAllServers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const addServerAction = createAsyncThunk(
  "server/add",
  async (props: { name: string; description: string }, { rejectWithValue }) => {
    try {
      return await addServer(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteServerAction = createAsyncThunk(
  "server/delete",
  async (props: { id: string }, { rejectWithValue }) => {
    try {
      return await deleteServer(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateServerAction = createAsyncThunk(
  "server/update",
  async (
    props: { id: string; name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateServer(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Define a type for the slice state
interface ServerState {
  getAllStatus: "idle" | "pending" | "succeeded" | "failed";
  addStatus: "idle" | "pending" | "succeeded" | "failed";
  deleteServerStatus: "idle" | "pending" | "succeeded" | "failed";
  updateStatus: "idle" | "pending" | "succeeded" | "failed";
  servers: Server[];
}

// Define the initial state using that type
const initialState: ServerState = {
  getAllStatus: "idle",
  addStatus: "idle",
  deleteServerStatus: "idle",
  updateStatus: "idle",
  servers: [],
};

export const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getServers.fulfilled, (state, action) => {
      state.getAllStatus = "succeeded";
      state.servers = action.payload ?? state.servers;
    });

    builder.addCase(getServers.pending, (state, action) => {
      state.getAllStatus = "pending";
    });

    builder.addCase(getServers.rejected, (state, action) => {
      state.getAllStatus = "failed";
    });

    builder.addCase(addServerAction.fulfilled, (state, action) => {
      state.addStatus = "succeeded";
    });

    builder.addCase(addServerAction.pending, (state, action) => {
      state.addStatus = "pending";
    });

    builder.addCase(addServerAction.rejected, (state, action) => {
      state.addStatus = "failed";
    });

    builder.addCase(deleteServerAction.fulfilled, (state, action) => {
      state.deleteServerStatus = "succeeded";
    });

    builder.addCase(deleteServerAction.pending, (state, action) => {
      state.deleteServerStatus = "pending";
    });

    builder.addCase(deleteServerAction.rejected, (state, action) => {
      state.deleteServerStatus = "failed";
    });

    builder.addCase(updateServerAction.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
    });

    builder.addCase(updateServerAction.pending, (state, action) => {
      state.updateStatus = "pending";
    });

    builder.addCase(updateServerAction.rejected, (state, action) => {
      state.updateStatus = "failed";
    });
  },
});

export default serverSlice.reducer;
