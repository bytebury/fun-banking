import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createBank: false,
  addCustomer: false,
  deleteCustomer: false,
  editCustomer: false,
  deleteBank: false,
  viewCustomer: false,
  transferMoney: false,
  editAccount: false,
  bulkTransfer: false,
  bankBuddyTransfer: false,
  accountTransfer: false,
  createShop: false,
  editShop: false,
  deleteShop: false,
  createItem: false,
  editItem: false,
  deleteItem: false,
};

const dialogsSlice = createSlice({
  name: "dialogs",
  initialState,
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
    openBankBuddyTransfer(state) {
      return { ...state, bankBuddyTransfer: true };
    },
    closeBankBuddyTransfer(state) {
      return { ...state, bankBuddyTransfer: false };
    },
    openAccountTransfer(state) {
      return { ...state, accountTransfer: true };
    },
    closeAccountTransfer(state) {
      return { ...state, accountTransfer: false };
    },
    toggleCreateShop(state, action) {
      return { ...state, createShop: action.payload };
    },
    toggleEditShop(state, action) {
      return { ...state, editShop: action.payload };
    },
    toggleDeleteShop(state, action) {
      return { ...state, deleteShop: action.payload };
    },
    toggleCreateItem(state, action) {
      return { ...state, createItem: action.payload };
    },
    toggleEditItem(state, action) {
      return { ...state, editItem: action.payload };
    },
    toggleDeleteItem(state, action) {
      return { ...state, deleteItem: action.payload };
    },
  },
});

export const { actions: dialogsAction, reducer: dialogsReducer } = dialogsSlice;

export const selectDialogs = (state: any) =>
  state.dialogs as { [k in keyof typeof initialState]: boolean };
