import { AsyncStorage } from "react-native";
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { authReducer } from "./auth";
import { profileReducer } from "./profile";

const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ authReducer, profileReducer })
);
export const store = createStore(
  persistedReducer,
  undefined,
  applyMiddleware(thunk, logger)
);
