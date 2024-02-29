import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginError: null,
  signupError: null,
  signupMessage: null,
  passwordResetMessage: null,
  passwordResetError: null,
  verificationMessage: null,
  logoutError: null,
  userDetails: null,
  userNames: {
    firstName: "",
    lastName: "",
  },
  showModal: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateLoginError: (state, action) => {
      state.loginError = action.payload;
    },
    updateSignupError: (state, action) => {
      state.signupError = action.payload;
    },
    updateUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    updateUserNames: (state, action) => {
      state.userNames = action.payload;
    },
    updateLogoutError: (state, action) => {
      state.logoutError = action.payload;
    },
    updateSignupMessage: (state, action) => {
      state.signupMessage = action.payload;
    },
    updatePasswordResetMessage: (state, action) => {
      state.passwordResetMessage = action.payload;
    },
    updatePasswordResetError: (state, action) => {
      state.passwordResetError = action.payload;
    },
    updateVerificationMessage: (state, action) => {
      state.verificationMessage = action.payload;
    },
    toggleShowModal: (state, action) => {
      state.showModal = !state.showModal;
    },
  },
});

export const {
  updateLoginError,
  updateSignupError,
  updateUserDetails,
  updateUserNames,
  updateLogoutError,
  updateSignupMessage,
  updatePasswordResetMessage,
  updatePasswordResetError,
  updateVerificationMessage,
} = userSlice.actions;

export const getAllUserDetails = (state) => state.user;

export default userSlice.reducer;
