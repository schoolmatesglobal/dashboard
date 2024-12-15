import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  loginStatus: null,
  signupStatus: null,
  passwordResetStatus: null,
  emailVerificationStatus: null,
  logoutStatus: null,
  userDetails: null,
  userNames: null,
  authMessage: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resendEmailVerification: async () => {},
};

const authDetails = (set) => ({
  ...initialState,

  setLoginStatus: (data) =>
    set((state) => ({
      loginStatus: data,
    })),
  setSignupStatus: (data) =>
    set((state) => ({
      signupStatus: data,
    })),

  setPasswordResetStatus: (data) =>
    set((state) => ({
      passwordResetStatus: data,
    })),

  setEmailVerificationStatus: (data) =>
    set((state) => ({
      emailVerificationStatus: data,
    })),

  setLogoutStatus: (data) =>
    set((state) => ({
      logoutStatus: data,
    })),

  setUserDetails: (data) =>
    set((state) => ({
      userDetails: data,
    })),

  setUserNames: (data) =>
    set((state) => ({
      userNames: data,
    })),

  setAuthMessage: (data) =>
    set((state) => ({
      authMessage: data,
    })),

  setSignUp: (data) =>
    set((state) => ({
      signUp: data,
    })),

  setSignIn: (data) =>
    set((state) => ({
      signIn: data,
    })),

  setLogout: (data) =>
    set((state) => ({
      logout: data,
    })),

  setForgotPassword: (data) =>
    set((state) => ({
      forgotPassword: data,
    })),

  setResendEmailVerification: (data) =>
    set((state) => ({
      resendEmailVerification: data,
    })),

  // Reset all state to initial values
  reset: () => set({ ...initialState }),
});

export const useAuthDetails = create(
  persist(authDetails, {
    name: "auth-details",
    // storage: createJSONStorage(() => localStorage),
    // partialize: (state ) => ({ isModalOpen: state.isModalOpen })
  })
);
