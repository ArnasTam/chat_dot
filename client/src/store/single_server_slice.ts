import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getServerById } from "../services/server_service";
import { Server } from "../types/server";
import {
  addChannel,
  deleteChannel,
  getServerChannels,
  updateChannel,
} from "../services/channel_service";
import { Channel } from "../types/channel";
import { FetchingStatus } from "../types/fetching_status";
import { singleChannelSlice } from './single_channel_slice'

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

export const addChannelAction = createAsyncThunk(
  "channels/add",
  async (props: { name: string; serverId: string }, { rejectWithValue }) => {
    try {
      return await addChannel(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateChannelAction = createAsyncThunk(
  "channels/update",
  async (
    props: { id: string; name: string; serverId: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateChannel(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteChannelAction = createAsyncThunk(
  "channels/delete",
  async (props: { id: string; serverId: string }, { rejectWithValue }) => {
    try {
      return await deleteChannel(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface ServerState {
  getServerStatus: FetchingStatus;
  getChannelsState: FetchingStatus;
  addChannelState: FetchingStatus;
  editChannelState: FetchingStatus;
  deleteChannelState: FetchingStatus;
  server: Server | null;
  channels: Channel[];
}

const initialState: ServerState = {
  getServerStatus: "idle",
  getChannelsState: "idle",
  addChannelState: "idle",
  editChannelState: "idle",
  deleteChannelState: "idle",
  server: null,
  channels: [],
};

export const singleServerSlice = createSlice({
  name: "singleServer",
  initialState,
  reducers: {
    clear: (state) => {
      state.getServerStatus= "idle";
      state.getChannelsState= "idle";
      state.addChannelState= "idle";
      state.editChannelState= "idle";
      state.deleteChannelState= "idle";
      state.server= null;
      state.channels= [];
    },
    clearDelete: (state) => {
      state.deleteChannelState = "idle";
    },
  },
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

    builder.addCase(addChannelAction.fulfilled, (state, action) => {
      state.addChannelState = "succeeded";
    });

    builder.addCase(addChannelAction.pending, (state, action) => {
      state.addChannelState = "pending";
    });

    builder.addCase(addChannelAction.rejected, (state, action) => {
      state.addChannelState = "failed";
    });

    builder.addCase(updateChannelAction.fulfilled, (state, action) => {
      state.editChannelState = "succeeded";
    });

    builder.addCase(updateChannelAction.pending, (state, action) => {
      state.editChannelState = "pending";
    });

    builder.addCase(updateChannelAction.rejected, (state, action) => {
      state.editChannelState = "failed";
    });

    builder.addCase(deleteChannelAction.fulfilled, (state, action) => {
      state.deleteChannelState = "succeeded";
    });

    builder.addCase(deleteChannelAction.pending, (state, action) => {
      state.deleteChannelState = "pending";
    });

    builder.addCase(deleteChannelAction.rejected, (state, action) => {
      state.deleteChannelState = "failed";
    });
  },
});

export const { clear, clearDelete } = singleServerSlice.actions;

export default singleServerSlice.reducer;
