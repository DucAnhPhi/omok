import { AsyncStorage } from "react-native";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { authReducer } from "./auth";

const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, authReducer);
export const store = createStore(
  persistedReducer,
  undefined,
  applyMiddleware(thunk, logger)
);
