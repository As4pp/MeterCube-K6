import { getAccountDetails } from "./helper/account.js";
import {getUserPowerBIDashboardByID, getUserPowerBIDashboards} from "./helper/category-dashboard.js";
import {getPresignedS3URL, getUserCategoryInsights} from "./helper/category-report.js";

let totalRequests = 0;

export default function () {
    // Shows ENV to make sure that K6 can read stored ENV
    console.info(__ENV.TEST_ENV);
    console.info(__ENV.TOKEN);
    console.info(__ENV.BASE_URL);
    console.info(__ENV.USER_ID);

    // USER SCENARIOS
    getAccountDetails();
    totalRequests++;

    // CATEGORY DASHBOARD SCENARIOS
    getUserPowerBIDashboards();
    totalRequests++;
    getUserPowerBIDashboardByID();
    totalRequests++;

    // CATEGORY REPORT SCENARIOS
    getUserCategoryInsights();
    totalRequests++;
    getPresignedS3URL();
    totalRequests++;
}

export function teardown() {
    console.log(`Total API requests executed: ${totalRequests}`);
}

