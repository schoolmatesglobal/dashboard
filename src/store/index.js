import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
// import storage from 'reduxjs-toolkit-persist/lib/storage'
// import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
// import { persistReducer, createMigrate } from 'reduxjs-toolkit-persist'
// import hardSet from 'reduxjs-toolkit-persist/lib/stateReconciler/hardSet'
import storage from "redux-persist/lib/storage";
import localforage from "localforage";
import {
  persistReducer,
  // persistStore,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from "redux-persist";
// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
// import hardSet from "redux-persist/lib/stateReconciler/hardSet";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import cartReducer from "./userSlice";
// import quoteReducer from "./quoteSlice";
// import userReducer from "./userSlice";
import teacherAssignmentReducer from "./teacherAssignmentSlice";
import studentAssignmentReducer from "./studentAssignmentSlice";

const rootReducer = combineReducers({
  // quote: quoteReducer,
  // user: userReducer,
  teacherAssignment: teacherAssignmentReducer,
  studentAssignment: studentAssignmentReducer,
});

const persistConfig = {
  key: "root",
  //   version: 1,
  storage: localforage,
  // storage: storageSession,
  // stateReconciler: hardSet,
  blacklist: ["teacherAssignment", "studentAssignment"],
};

// const teacherPersistConfig = {
//   key: "teacher",
//   //   version: 1,
//   storage: localforage,
//   // storage: storageSession,
//   // stateReconciler: hardSet,
//   blacklist: ["teacher"],
// };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // middleware: [thunk],
});

export default store;

// export const persistor = persistStore(store)
