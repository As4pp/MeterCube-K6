import { Counter } from "k6/metrics";
import { getAccountDetails } from "./helper/account.js";
import {
  getUserPowerBIDashboardByID,
  getUserPowerBIDashboards,
} from "./helper/category-dashboard.js";
import {
  getPresignedS3URL,
  getUserCategoryInsights,
} from "./helper/category-report.js";

export const options = {
  thresholds: {
    // Success and failure thresholds for dashboard access
    dashboard_access_success: ["count>1490"],
    dashboard_access_failed: ["count<10"],

    // Success and failure thresholds for report downloads
    report_download_success: ["count>1490"],
    report_download_failed: ["count<10"],
  },
  scenarios: {
    // TOTAL API CALL = 1500 VUs × 1 iterations × 3 API calls per iteration =  4500 API calls
    dashboardAccess: {
      exec: "dashboardAccessScenario",
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { target: 500, duration: "10s" },
        { target: 0, duration: "10s" },
        // { target: 500, duration: "10s" },
      ],
      gracefulRampDown: "0s",
    },
    // TOTAL API CALL = 1500 VUs × 1 iterations × 3 API calls per iteration =  4500 API calls
    reportDownload: {
      exec: "reportDownloadScenario",
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { target: 500, duration: "10s" },
        { target: 0, duration: "10s" },
      ],
      gracefulRampDown: "0s",
    },
  },
};

// Metrics counters for dashboard access
const dashboardAccessSuccessCounter = new Counter("dashboard_access_success");
const dashboardAccessFailedCounter = new Counter("dashboard_access_failed");

// Metrics counters for report downloads
const reportDownloadSuccessCounter = new Counter("report_download_success");
const reportDownloadFailedCounter = new Counter("report_download_failed");

// Function to simulate user accessing dashboard
export function dashboardAccessScenario() {
  // Step 1: User logs in and retrieves account details
  const accountResponse = getAccountDetails();

  //   // Step 2: User accesses the dashboard list
  //   const dashboardListResponse = getUserPowerBIDashboards();

  //   // Step 3: User opens a specific dashboard
  //   const dashboardDetailResponse = getUserPowerBIDashboardByID();

  // Count success or failure based on API response status
  if (
    accountResponse.status === 200
    // &&
    // dashboardListResponse.status === 200 &&
    // dashboardDetailResponse.status === 200
  ) {
    dashboardAccessSuccessCounter.add(1);
  } else {
    dashboardAccessFailedCounter.add(1);
  }
}

// Function to simulate user downloading reports
export function reportDownloadScenario() {
  // Step 1: User logs in and retrieves account details
  const accountResponse = getAccountDetails();

  //   // Step 2: User accesses the report list
  //   const reportListResponse = getUserCategoryInsights();

  //   // Step 3: User downloads a specific report
  //   const reportDownloadResponse = getPresignedS3URL();

  // Count success or failure based on API response status
  if (
    accountResponse.status === 200
    // &&
    // reportListResponse.status === 200 &&
    // reportDownloadResponse.status === 200
  ) {
    reportDownloadSuccessCounter.add(1);
  } else {
    reportDownloadFailedCounter.add(1);
  }
}
