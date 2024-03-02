import { GET } from "@/app/utils/http-client";
import { Account } from "@/lib/models/Account";
import { ThunkStatus } from "@/lib/thunk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    current: null as Account | null,
    currentStatus: ThunkStatus.Idle,
    completedTransactions: {
      data: {},
      status: ThunkStatus.Idle,
      error: "",
    },
    pendingTransactions: {
      data: {},
      status: ThunkStatus.Idle,
    },
  },
  reducers: {
    setCurrentAccount(state, action) {
      return { ...state, current: action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccount.pending, (state, _) => {
        state.currentStatus = ThunkStatus.Loading;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.currentStatus = ThunkStatus.Success;
        state.current = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, _action) => {
        state.currentStatus = ThunkStatus.Error;
        state.current = null;
      })
      .addCase(fetchCompletedTransactions.pending, (state, _) => {
        state.completedTransactions.status = ThunkStatus.Loading;
      })
      .addCase(fetchCompletedTransactions.fulfilled, (state, action) => {
        state.completedTransactions.status = ThunkStatus.Success;
        state.completedTransactions.data = action.payload;
      })
      .addCase(fetchCompletedTransactions.rejected, (state, action) => {
        state.completedTransactions.status = ThunkStatus.Error;
        state.completedTransactions.error = action.error.message as string;
      });
  },
});

export const fetchAccount = createAsyncThunk("accounts/find", async (id: string | number) => {
  const response = await GET(`/accounts/${id}`);
  return response.json();
});

export const fetchCompletedTransactions = createAsyncThunk(
  "transactions/completed",
  async (payload: { account: any; itemsPerPage?: number; pageNumber?: number }) => {
    const response = await GET(
      `/accounts/${payload.account.id}/transactions?status=approved&status=declined&itemsPerPage=${payload.itemsPerPage}&pageNumber=${payload.pageNumber}`
    );
    return response.json();
  }
);

export const selectAccount = (state: any): Account => state.accounts.current;
export const selectAccountStatus = (state: any): ThunkStatus => state.accounts.currentStatus;
export const selectCompletedTransactions = (state: any) => state.accounts.completedTransactions;

export const { actions: accountsAction, reducer: accountsReducer } = accountsSlice;
