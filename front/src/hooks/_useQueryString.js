import { useLocation } from "react-router-dom";
export default function useQueryString() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const queryString = Object.fromEntries(urlSearchParams.entries());
  return queryString;
}
