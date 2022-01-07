import { cloneDeep } from "lodash";
const loading = [];
export default function reducer(state = loading, action) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case "SHOW_LOADING":
      newState.push("");
      return newState;
    case "HIDE_LOADING":
      newState.pop();
      return newState;
    case "SET_LOADING":
      return action.data;
    default:
      return state;
  }
}
