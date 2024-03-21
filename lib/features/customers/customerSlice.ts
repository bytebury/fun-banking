import { GET } from "@/app/utils/http-client";
import { Customer } from "@/lib/models/Customer";
import { ThunkStatus } from "@/lib/thunk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getTotalBalanceOfCustomer = (customer: any): number => {
  if (!customer) {
    return 0;
  }

  return customer.accounts.reduce((prevAccount: any, currAccount: any) => {
    return prevAccount + currAccount.balance;
  }, 0);
};

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    all: [] as Customer[],
    allStatus: ThunkStatus.Idle,
    current: null as Customer | null,
    currentStatus: ThunkStatus.Idle,
    totalBankBalance: 0,
    currentCustomerTotalBalance: 0,
    isMultiSelectEnabled: false,
  },
  reducers: {
    setCustomer(state, action) {
      return {
        ...state,
        current: action.payload,
        currentCustomerTotalBalance: getTotalBalanceOfCustomer(action.payload),
      };
    },
    setMultiSelect(state, action) {
      return {
        ...state,
        isMultiSelectEnabled: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCustomers.pending, (state, _) => {
        state.allStatus = ThunkStatus.Loading;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.allStatus = ThunkStatus.Success;
        state.all = action.payload;
        state.totalBankBalance = action.payload.reduce((prev: number, curr: any) => {
          return prev + curr.accounts[0].balance;
        }, 0);
      })
      .addCase(fetchCustomers.rejected, (state, _) => {
        state.allStatus = ThunkStatus.Error;
        state.all = [];
      })
      .addCase(fetchCustomer.pending, (state, _) => {
        state.currentStatus = ThunkStatus.Loading;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.currentStatus = ThunkStatus.Success;
        state.current = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, _) => {
        state.currentStatus = ThunkStatus.Error;
        state.current = null;
      });
  },
});

export const fetchCustomers = createAsyncThunk("customers/all", async (bankId: string | number) => {
  const response = await GET(`/banks/${bankId}/customers`);

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
});

export const fetchCustomer = createAsyncThunk(
  "customers/find",
  async (customerId: string | number) => {
    const response = await GET(`/customers/${customerId}`);

    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  }
);

export const selectIsMultiSelectMode = (state: any): boolean => state.isMultiSelectEnabled || false;
export const selectCustomers = (state: any): Customer[] => state.customers.all;
export const selectCustomersStatus = (state: any): ThunkStatus => state.customers.allStatus;
export const selectCustomer = (state: any): Customer | null => state.customers.current;
export const selectCustomerStatus = (state: any): ThunkStatus => state.customers.currentStatus;
export const selectCustomerTotalBalance = (state: any): number =>
  state.customers.currentCustomerTotalBalance;
export const selectTotalBankValue = (state: any): number => state.customers.totalBankBalance;

export const { actions: customerAction, reducer: customerReducer } = customerSlice;
