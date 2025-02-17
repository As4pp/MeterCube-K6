import { getAccountDetails } from "./helper/account.js";
import { getUserPowerBIDashboardByID, getUserPowerBIDashboards } from "./helper/category-dashboard.js";
import { getPresignedS3URL, getUserCategoryInsights } from "./helper/category-report.js";

export const options = {
    vus: 1, // Number of virtual users
    iterations: 1, // Number of iterations for the test
};

export default function () {
    // // Shows ENV to make sure that K6 can read stored ENV
    // console.info(__ENV.TEST_ENV);
    // console.info(__ENV.TOKEN);
    // console.info(__ENV.BASE_URL);
    // console.info(__ENV.USER_ID);

    // USER SCENARIOS
    getAccountDetails();

    // CATEGORY DASHBOARD SCENARIOS
    getUserPowerBIDashboards();
    getUserPowerBIDashboardByID();

    // CATEGORY REPORT SCENARIOS
    getUserCategoryInsights();
    getPresignedS3URL();
}
