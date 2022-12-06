import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchingStatus } from "../types/fetching_status";
import { Message } from "../types/message";
import { getMessageById } from "../services/message_service";
import { singleServerSlice } from './single_server_slice'

export const getMessageByIdAction = createAsyncThunk(
  "singleMessage/getById",
  async (
    props: { id: string; serverId: string; channelId: string },
    { rejectWithValue }
  ) => {
    try {
      return await getMessageById(props);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface ChannelState {
  getMessageStatus: FetchingStatus;
  message: Message | null;
}

const initialState: ChannelState = {
  getMessageStatus: "idle",
  message: null,
};

export const singleMessageSlice = createSlice({
  name: "singleMessage",
  initialState,
  reducers: {
    clear: (state) => {
      state.getMessageStatus = "idle";
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getMessageByIdAction.fulfilled, (state, action) => {
      state.getMessageStatus = "succeeded";
      state.message = action.payload ?? null;
    });

    builder.addCase(getMessageByIdAction.pending, (state, action) => {
      state.getMessageStatus = "pending";
    });

    builder.addCase(getMessageByIdAction.rejected, (state, action) => {
      state.getMessageStatus = "failed";
    });
  },
});

export const { clear } = singleMessageSlice.actions;

export default singleMessageSlice.reducer;
