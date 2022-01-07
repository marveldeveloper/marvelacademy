const isLogged = localStorage.getItem("token") !== null;
export default function reducer(state = isLogged, action) {
  switch (action.type) {
    case "SET_IS_LOGGED":
      return action.data;
    default:
      return state;
  }
}
