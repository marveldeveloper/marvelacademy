import { toast } from "../../methods";
import { errors } from "../../constants";
import store from "../../redux";

function logout() {
  store.dispatch({ type: "SET_IS_LOGGED", data: false });
  store.dispatch({ type: "SET_ROLE", data: null });
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export default function handleErrors(error) {
  const response = error.response ?? null;
  console.log(response);
  if (response) {
    const errorCode = response.data.code;
    const errorItem = errors.find((e) => `${e.id}` === `${errorCode}`);
    if (errorItem) {
      response.status === 403 && logout();
      toast({ type: "error", text: `خطا: ${errorItem.text}` });
    } else {
      toast({ type: "error", text: `Error ${response.status}` });
    }
  } else {
    toast({ type: "error", text: "Network Error!" });
  }
}
