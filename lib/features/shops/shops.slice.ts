import { GET } from "@/app/utils/http-client";
import { Item } from "@/lib/models/Item";
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
    current: {
      error: "",
      data: [],
      status: ThunkStatus.Idle,
    } as StateSlice<Shop[]>,
    items: {
      error: "",
      data: [],
      status: ThunkStatus.Idle,
    } as StateSlice<Item[]>,
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
      .addCase(fetchShops.rejected, (state, { error }) => {
        state.all.status = ThunkStatus.Error;
        state.all.error = error.message as string;
      })
      .addCase(fetchShop.pending, (state, _) => {
        state.current.status = ThunkStatus.Loading;
        state.current.error = "";
        state.items = { ...state.items, data: [], error: "" };
      })
      .addCase(fetchShop.fulfilled, (state, action) => {
        state.current.status = ThunkStatus.Success;
        state.current.data = action.payload;
        state.current.error = "";
      })
      .addCase(fetchShop.rejected, (state, { error }) => {
        state.current.status = ThunkStatus.Error;
        state.current.error = error.message as string;
        state.items = {
          ...state.items,
          status: ThunkStatus.Error,
          data: [],
          error: "Unable to get items",
        };
      })
      .addCase(fetchItems.pending, (state, _) => {
        state.items.data = [];
        state.items.error = "";
        state.items.status = ThunkStatus.Loading;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items.data = action.payload;
        state.items.error = "";
        state.items.status = ThunkStatus.Success;
      })
      .addCase(fetchItems.rejected, (state, { error }) => {
        state.items.data = [];
        state.items.error = error.message as string;
        state.items.status = ThunkStatus.Error;
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

export const fetchShop = createAsyncThunk("shops/:id", async (id: string, { dispatch }) => {
  const response = await GET(`/shops/${id}`);

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  dispatch(fetchItems(id));

  return response.json();
});

export const fetchItems = createAsyncThunk("items", async (shopId: string) => {
  const response = await GET(`/shops/${shopId}/items`);

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  return response.json();
});

export const selectAllShops = (state: any): StateSlice<Shop[]> => state.shops.all;
export const selectShop = (state: any): StateSlice<Shop> => state.shops.current;
export const selectItems = (state: any): StateSlice<Item[]> => state.shops.items;

export const { actions: shopsAction, reducer: shopsReducer } = shops;
