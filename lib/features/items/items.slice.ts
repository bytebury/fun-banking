import { Item } from "@/lib/models/Item";
import { createSlice } from "@reduxjs/toolkit";

const items = createSlice({
  name: "items",
  initialState: {
    current: null as unknown as Item,
  },
  reducers: {
    setItem(state, action) {
      return { ...state, current: action.payload };
    },
  },
});

export const selectCurrentItem = (state: any): Item | undefined => state.items?.current;

export const { actions: itemsAction, reducer: itemsReducer } = items;
