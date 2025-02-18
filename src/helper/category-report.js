import http from "k6/http";
import { check } from "k6";

export function getUserCategoryInsights() {
  const API_URL = __ENV.BASE_URL + "/api/category-insights/reports";

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

export function getPresignedS3URL() {
  const API_URL =
    __ENV.BASE_URL +
    "/api/category-insights/reports/" +
    __ENV.DEFAULT_REPORT_ID +
    "/presigned-url?title=" +
    __ENV.DEFAULT_REPORT_TITLE +
    "&fileName=" +
    __ENV.DEFAULT_REPORT_FILENAME;

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
