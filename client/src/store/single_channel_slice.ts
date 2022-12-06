import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getChannelById } from "../services/channel_service";
import { Channel } from "../types/channel";
import { FetchingStatus } from "../types/fetching_status";
import { Message } from "../types/message";
import {
  addMessage,
  deleteMessage,
  getChannelMessages,
  updateMessage,
} from "../services/message_service";

export const getChannelByIdAction = createAsyncThunk(
  "singleChannel/getById",
  async (props: { id: string; serverId: string }, { rejectWithValue }) => {
    try {
      return await getChannelById(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllChannelMessagesByIdAction = createAsyncThunk(
  "singleChannel/channels",
  async (
    props: { serverId: string; channelId: string },
    { rejectWithValue }
  ) => {
    try {
      return await getChannelMessages(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const addMessageAction = createAsyncThunk(
  "channels/add",
  async (
    props: { content: string; serverId: string; channelId: string },
    { rejectWithValue }
  ) => {
    try {
      return await addMessage(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateMessageAction = createAsyncThunk(
  "channels/update",
  async (
    props: { id: string; content: string; serverId: string; channelId: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateMessage(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteMessageAction = createAsyncThunk(
  "channels/delete",
  async (
    props: { id: string; serverId: string; channelId: string },
    { rejectWithValue }
  ) => {
    try {
      return await deleteMessage(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface ChannelState {
  getServerStatus: FetchingStatus;
  getChannelsState: FetchingStatus;
  addChannelState: FetchingStatus;
  editChannelState: FetchingStatus;
  deleteChannelState: FetchingStatus;
  channel: Channel | null;
  messages: Message[];
}

const initialState: ChannelState = {
  getServerStatus: "idle",
  getChannelsState: "idle",
  addChannelState: "idle",
  editChannelState: "idle",
  deleteChannelState: "idle",
  channel: null,
  messages: [],
};

export const singleChannelSlice = createSlice({
  name: "singleChannel",
  initialState,
  reducers: {
    clear: (state) => {
      state.getServerStatus = "idle";
      state.getChannelsState = "idle";
      state.addChannelState = "idle";
      state.editChannelState = "idle";
      state.deleteChannelState = "idle";
      state.channel = null;
      state.messages = [];
    },
    clearDelete: (state) => {
      state.deleteChannelState = "idle";
    },
    clearPost: (state) => {
      state.addChannelState = "idle";
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getChannelByIdAction.fulfilled, (state, action) => {
      state.getServerStatus = "succeeded";
      state.channel = action.payload ?? null;
    });

    builder.addCase(getChannelByIdAction.pending, (state, action) => {
      state.getServerStatus = "pending";
    });

    builder.addCase(getChannelByIdAction.rejected, (state, action) => {
      state.getServerStatus = "failed";
    });

    builder.addCase(
      getAllChannelMessagesByIdAction.fulfilled,
      (state, action) => {
        state.getChannelsState = "succeeded";
        state.messages = action.payload ?? [];
      }
    );

    builder.addCase(
      getAllChannelMessagesByIdAction.pending,
      (state, action) => {
        state.getChannelsState = "pending";
      }
    );

    builder.addCase(
      getAllChannelMessagesByIdAction.rejected,
      (state, action) => {
        state.getChannelsState = "failed";
      }
    );

    builder.addCase(addMessageAction.fulfilled, (state, action) => {
      state.addChannelState = "succeeded";
    });

    builder.addCase(addMessageAction.pending, (state, action) => {
      state.addChannelState = "pending";
    });

    builder.addCase(addMessageAction.rejected, (state, action) => {
      state.addChannelState = "failed";
    });

    builder.addCase(updateMessageAction.fulfilled, (state, action) => {
      state.editChannelState = "succeeded";
    });

    builder.addCase(updateMessageAction.pending, (state, action) => {
      state.editChannelState = "pending";
    });

    builder.addCase(updateMessageAction.rejected, (state, action) => {
      state.editChannelState = "failed";
    });

    builder.addCase(deleteMessageAction.fulfilled, (state, action) => {
      state.deleteChannelState = "succeeded";
    });

    builder.addCase(deleteMessageAction.pending, (state, action) => {
      state.deleteChannelState = "pending";
    });

    builder.addCase(deleteMessageAction.rejected, (state, action) => {
      state.deleteChannelState = "failed";
    });
  },
});

export const { clear, clearDelete, clearPost } = singleChannelSlice.actions;

export default singleChannelSlice.reducer;
