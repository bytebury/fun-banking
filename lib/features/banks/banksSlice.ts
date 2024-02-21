import { GET } from "@/app/utils/http-client";
import { Bank } from "@/lib/models/Bank";
import { Employee } from "@/lib/models/Employee";
import { ThunkStatus } from "@/lib/thunk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const banksSlice = createSlice({
  name: "banks",
  initialState: {
    all: [] as Bank[],
    allStatus: ThunkStatus.Idle,
    current: null as Bank | null,
    currentStatus: ThunkStatus.Idle,
    employees: [] as Employee[],
    employeesStatus: ThunkStatus.Idle,
  },
  reducers: {
    setBank(state, action) {
      return { ...state, current: action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBank.pending, (state, _) => {
        state.currentStatus = ThunkStatus.Loading;
      })
      .addCase(fetchBank.fulfilled, (state, action) => {
        state.currentStatus = ThunkStatus.Success;
        state.current = action.payload;
      })
      .addCase(fetchBank.rejected, (state, _action) => {
        state.currentStatus = ThunkStatus.Error;
        state.current = null;
      })
      .addCase(fetchBanks.pending, (state, _) => {
        state.allStatus = ThunkStatus.Loading;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.allStatus = ThunkStatus.Success;
        state.all = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, _) => {
        state.allStatus = ThunkStatus.Error;
        state.all = [];
      })
      .addCase(fetchEmployees.pending, (state, _) => {
        state.employeesStatus = ThunkStatus.Loading;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employeesStatus = ThunkStatus.Success;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, _) => {
        state.employeesStatus = ThunkStatus.Error;
        state.all = [];
      });
  },
});

export const fetchBanks = createAsyncThunk("banks/all", async () => {
  const response = await GET("/my-banks");

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  return response.json();
});

export const fetchBank = createAsyncThunk("banks/find", async (id: string | number) => {
  const response = await GET(`/banks/${id}`);

  if (!response.ok) {
    const { message } = await response.json();
    throw message;
  }

  return response.json();
});

export const fetchEmployees = createAsyncThunk(
  "employees/bank",
  async (bankId: string | number) => {
    const response = await GET(`/employees/banks/${bankId}`);
    return response.json();
  }
);

export const selectAllBanks = (state: any): Bank[] => state.banks.all;
export const selectAllBanksStatus = (state: any): ThunkStatus => state.banks.allStatus;
export const selectCurrentBank = (state: any): Bank | null => state.banks.current;
export const selectCurrentBankStatus = (state: any): ThunkStatus => state.banks.currentStatus;
export const selectEmployees = (state: any): Employee[] => state.banks.employees;
export const selectEmployeesStatus = (state: any): ThunkStatus => state.banks.employeesStatus;

export const { actions: banksAction, reducer: banksReducer } = banksSlice;
