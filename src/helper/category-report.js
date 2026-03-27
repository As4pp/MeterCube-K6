import { getRequest } from "./http.js";

export function getUserCategoryInsights() {
  return getRequest("/api/category-insights/reports", {
    name: "getUserCategoryInsights",
    timeout: "0.2s",
  });
}

export function getPresignedS3URL() {
  return getRequest(`/api/category-insights/reports/${__ENV.DEFAULT_REPORT_ID}/presigned-url`, {
    name: "getPresignedS3URL",
    query: {
      title: __ENV.DEFAULT_REPORT_TITLE,
      fileName: __ENV.DEFAULT_REPORT_FILENAME,
    },
    timeout: "0.2s",
  });
}
