import { getRequest } from "./http.js";

export function getUserPowerBIDashboards() {
  return getRequest("/api/category-insights/dashboards", {
    name: "getUserPowerBIDashboards",
    timeout: "0.2s",
  });
}

export function getUserPowerBIDashboardByID() {
  return getRequest(`/api/category-insights/dashboards/${__ENV.DEFAULT_DASHBOARD_ID}`, {
    name: "getUserPowerBIDashboardByID",
    timeout: "0.2s",
  });
}
