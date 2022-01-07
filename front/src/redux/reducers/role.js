const role = localStorage.getItem("role");
export default function reducer(state = role, action) {
  switch (action.type) {
    case "SET_ROLE":
      return action.data;
    default:
      return state;
  }
}
