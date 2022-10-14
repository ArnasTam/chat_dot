import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getServerById } from "../services/server_service";
import { Server } from "../types/server";
import { getServerChannels } from "../services/channel_service";
import { Channel } from "../types/channel";

export const getServerByIdAction = createAsyncThunk(
  "singleServer/getById",
  async (props: { serverId: string }, { rejectWithValue }) => {
    try {
      return await getServerById({ id: props.serverId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllServerChannelsAction = createAsyncThunk(
  "singleServer/channels",
  async (props: { serverId: string }, { rejectWithValue }) => {
    try {
      return await getServerChannels({ serverId: props.serverId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface ServerState {
  getServerStatus: "idle" | "pending" | "succeeded" | "failed";
  getChannelsState: "idle" | "pending" | "succeeded" | "failed";
  server: Server | null;
  channels: Channel[];
}

const initialState: ServerState = {
  getServerStatus: "idle",
  getChannelsState: "idle",
  server: null,
  channels: [],
};

export const singleServerSlice = createSlice({
  name: "singleServer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getServerByIdAction.fulfilled, (state, action) => {
      state.getServerStatus = "succeeded";
      state.server = action.payload ?? null;
    });

    builder.addCase(getServerByIdAction.pending, (state, action) => {
      state.getServerStatus = "pending";
    });

    builder.addCase(getServerByIdAction.rejected, (state, action) => {
      state.getServerStatus = "failed";
    });

    builder.addCase(getAllServerChannelsAction.fulfilled, (state, action) => {
      state.getChannelsState = "succeeded";
      state.channels = action.payload ?? [];
    });

    builder.addCase(getAllServerChannelsAction.pending, (state, action) => {
      state.getChannelsState = "pending";
    });

    builder.addCase(getAllServerChannelsAction.rejected, (state, action) => {
      state.getChannelsState = "failed";
    });
  },
});

export default singleServerSlice.reducer;
