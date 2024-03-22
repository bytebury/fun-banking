import { createSlice } from "@reduxjs/toolkit";

const dialogsSlice = createSlice({
  name: "dialogsSlice",
  initialState: {
    createBank: false,
    addCustomer: false,
    deleteCustomer: false,
    editCustomer: false,
    deleteBank: false,
    viewCustomer: false,
    transferMoney: false,
    editAccount: false,
    bulkTransfer: false,
    payBuddyTransfer: false,
  },
  reducers: {
    openCreateBankDialog(state) {
      return {
        ...state,
        createBank: true,
      };
    },
    closeCreateBankDialog(state) {
      return {
        ...state,
        createBank: false,
      };
    },
    openAddCustomerDialog(state) {
      return {
        ...state,
        addCustomer: true,
      };
    },
    closeAddCustomerDialog(state) {
      return {
        ...state,
        addCustomer: false,
      };
    },
    openDeleteCustomer(state) {
      return {
        ...state,
        deleteCustomer: true,
      };
    },
    closeDeleteCustomer(state) {
      return {
        ...state,
        deleteCustomer: false,
      };
    },
    openEditCustomer(state) {
      return {
        ...state,
        editCustomer: true,
      };
    },
    closeEditCustomer(state) {
      return {
        ...state,
        editCustomer: false,
      };
    },
    openTransferMoney(state) {
      return {
        ...state,
        transferMoney: true,
      };
    },
    closeTransferMoney(state) {
      return {
        ...state,
        transferMoney: false,
      };
    },
    openDeleteBank(state) {
      return {
        ...state,
        deleteBank: true,
      };
    },
    closeDeleteBank(state) {
      return {
        ...state,
        deleteBank: false,
      };
    },
    openViewCustomer(state) {
      return {
        ...state,
        viewCustomer: true,
      };
    },
    closeViewCustomer(state) {
      return {
        ...state,
        viewCustomer: false,
      };
    },
    openEditAccount(state) {
      return { ...state, editAccount: true };
    },
    closeEditAccount(state) {
      return { ...state, editAccount: false };
    },
    openBulkTransfer(state) {
      return { ...state, bulkTransfer: true };
    },
    closeBulkTransfer(state) {
      return { ...state, bulkTransfer: false };
    },
    openPayBuddyTransfer(state) {
      return { ...state, payBuddyTransfer: true };
    },
    closePayBuddyTransfer(state) {
      return { ...state, payBuddyTransfer: false };
    },
  },
});

export const { actions: dialogsAction, reducer: dialogsReducer } = dialogsSlice;
