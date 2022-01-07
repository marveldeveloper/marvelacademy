import { axios } from "../boot";
import store from "../redux";
export default function logout() {
  delete axios.defaults.headers["x-auth-token"];
  localStorage.removeItem("token");
  store.dispatch({ type: "SET_IS_LOGGED", data: false });
}
