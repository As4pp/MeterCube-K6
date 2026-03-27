import { getAccountDetails } from "./helper/account.js";
import {
  getUserPowerBIDashboardByID,
  getUserPowerBIDashboards,
} from "./helper/category-dashboard.js";
import { getPresignedS3URL, getUserCategoryInsights } from "./helper/category-report.js";
import {
  getDigitalShelfBannerPresence,
  getDigitalShelfCompetitorBrands,
  getDigitalShelfShopsByBrands,
  getDigitalShelfSubscriptionDetails,
  getGlobalScoreCardCountryTableMetricsBatch,
  getGlobalScoreCardTableMetrics,
  getGlobalScoreCardTrendMetrics,
  getProductHealthContentQualityMetrics,
  getProductHealthContentQualityProducts,
  getProductHealthOnlineAvailabilityMetrics,
  getProductHealthOnlineAvailabilityProducts,
  getProductHealthPriceCompetitivenessMetrics,
  getProductHealthPriceCompetitivenessProducts,
  getProductHealthRatingsReviewsMetrics,
  getProductHealthRatingsReviewsProducts,
  getShareOfSearchKeywordDistribution,
  getShareOfSearchKeywordInsightsScatterPlot,
  getShareOfSearchKeywordOptions,
  getShareOfSearchPositionTable,
  getShareOfSearchSearchInsightsMetrics,
  getShareOfSearchSearchInsightsRanking,
} from "./helper/digital-shelf.js";

const isDigitalShelfEnabled = __ENV.ENABLE_DIGITAL_SHELF === "true";
const isLegacyTestsEnabled = __ENV.ENABLE_LEGACY_TESTS === "true";

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

    if (isLegacyTestsEnabled) {
        getAccountDetails();
        getUserPowerBIDashboards();
        getUserPowerBIDashboardByID();
        getUserCategoryInsights();
        getPresignedS3URL();
    }

    if (isDigitalShelfEnabled) {
        getDigitalShelfSubscriptionDetails();
        getDigitalShelfBannerPresence();
        getDigitalShelfCompetitorBrands();
        getDigitalShelfShopsByBrands();
        getShareOfSearchKeywordOptions();
        getShareOfSearchSearchInsightsMetrics();
        getShareOfSearchSearchInsightsRanking();
        getShareOfSearchKeywordInsightsScatterPlot();
        getShareOfSearchKeywordDistribution();
        getShareOfSearchPositionTable();
        getProductHealthOnlineAvailabilityMetrics();
        getProductHealthOnlineAvailabilityProducts();
        getProductHealthRatingsReviewsMetrics();
        getProductHealthRatingsReviewsProducts();
        getProductHealthPriceCompetitivenessMetrics();
        getProductHealthPriceCompetitivenessProducts();
        getProductHealthContentQualityMetrics();
        getProductHealthContentQualityProducts();
        getGlobalScoreCardTrendMetrics();
        getGlobalScoreCardTableMetrics();
        getGlobalScoreCardCountryTableMetricsBatch();
    }
}
