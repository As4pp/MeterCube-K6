import http from "k6/http";
import { check } from "k6";

export function getUserPowerBIDashboards() {
  const API_URL = __ENV.BASE_URL + "/api/category-insights/dashboards";

  const response = http.get(API_URL, {
    headers: {
      accept: "*/*",
      "content-type": "application/json",
      Authorization: `Bearer ${__ENV.TOKEN}`,
    },
    timeout: "0.2s",
  });

  check(response, {
    "[getUserPowerBIDashboards] response status must be 200": (res) =>
      res.status === 200,
    "[getUserPowerBIDashboards] response data must not be null": (res) =>
      res.json().data != null,
  });

  return response.json();
}

export function getUserPowerBIDashboardByID() {
  const API_URL =
    __ENV.BASE_URL +
    "/api/category-insights/dashboards/" +
    __ENV.DEFAULT_DASHBOARD_ID;

  const response = http.get(API_URL, {
    headers: {
      accept: "*/*",
      "content-type": "application/json",
      Authorization: `Bearer ${__ENV.TOKEN}`,
    },
    timeout: "0.2s",
  });

  check(response, {
    "[getUserPowerBIDashboardByID] response status must be 200": (res) =>
      res.status === 200,
    "[getUserPowerBIDashboardByID] response data must not be null": (res) =>
      res.json().data != null,
  });

  return response.json();
}
