import { GET } from "@/app/utils/http-client";
import { User } from "@/lib/models/User";
import { ThunkStatus } from "@/lib/thunk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { configAction, fetchConfig } from "../config/configSlice";

export const logout = () => {
  return { type: "LOGOUT" };
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    current: null as User | null,
    currentStatus: ThunkStatus.Idle,
  },
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentUser.pending, (state, _) => {
        state.currentStatus = ThunkStatus.Loading;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.current = action.payload;
        state.currentStatus = ThunkStatus.Success;
      })
      .addCase(fetchCurrentUser.rejected, (state, _) => {
        state.current = null;
        state.currentStatus = ThunkStatus.Error;
      });
  },
});

export const { actions: usersActions, reducer: usersReducer } = usersSlice;

export const fetchCurrentUser = createAsyncThunk<User>("users/current", async (_, { dispatch }) => {
  const response = await GET(`/current-user`);

  dispatch(fetchConfig());

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  return response.json();
});

export const selectCurrentUser = (state: any): User | undefined => state.users.current;
export const selectCurrentUserStatus = (state: any): ThunkStatus => state.users.currentStatus;
