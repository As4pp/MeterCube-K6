import { getRequest } from "./http.js";

export function getAccountDetails() {
  return getRequest(`/api/my-account/get-user-details/${__ENV.DEFAULT_USER_ID}`, {
    name: "getAccountDetails",
    timeout: "1s",
  });
}
