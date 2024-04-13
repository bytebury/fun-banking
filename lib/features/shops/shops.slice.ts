import { GET } from "@/app/utils/http-client";
import { Shop } from "@/lib/models/Shop";
import { ThunkStatus } from "@/lib/thunk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type StateSlice<T> = {
  error: string;
  data: T;
  status: ThunkStatus;
};

const shops = createSlice({
  name: "shops",
  initialState: {
    all: {
      error: "",
      data: [],
      status: ThunkStatus.Idle,
    } as StateSlice<Shop[]>,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchShops.pending, (state, _) => {
        state.all.status = ThunkStatus.Loading;
        state.all.error = "";
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.all.status = ThunkStatus.Success;
        state.all.data = action.payload;
        state.all.error = "";
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.all.status = ThunkStatus.Error;
        state.all.error = action.payload as string;
      });
  },
});

export const fetchShops = createAsyncThunk("shops/all", async () => {
  const response = await GET("/shops");

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  return response.json();
});

export const selectAllShops = (state: any): StateSlice<Shop[]> => state.shops.all;

export const { actions: shopsAction, reducer: shopsReducer } = shops;
