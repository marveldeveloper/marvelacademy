import { combineReducers, createStore } from "redux";
import loading from "./reducers/loading";
import isLogged from "./reducers/isLogged";
import role from "./reducers/role";
const rootReducer = combineReducers({
  loading,
  isLogged,
  role,
});
const store = createStore(rootReducer);
export default store;
