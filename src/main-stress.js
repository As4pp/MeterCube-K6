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

function createThresholds(prefix, minSuccess) {
  return {
    [`${prefix}_success`]: [`count>${minSuccess}`],
    [`${prefix}_failed`]: ["count<10"],
  };
}

function buildScenario(exec) {
  return {
    exec,
    executor: "per-vu-iterations",
    vus: 1,
    iterations: 100,
    maxDuration: "1m",
  };
}

function createScenarioCounters(prefix) {
  return {
    success: new Counter(`${prefix}_success`),
    failed: new Counter(`${prefix}_failed`),
  };
}

function recordScenario(counters, responses) {
  if (responses.every((response) => response.status === 200)) {
    counters.success.add(1);
  } else {
    counters.failed.add(1);
  }
}

export const options = {
  thresholds: {
    ...createThresholds("dashboard_access", 2990),
    ...createThresholds("report_download", 2990),
    ...(isDigitalShelfEnabled
      ? {
          ...createThresholds("digital_shelf_banner_presence", 2990),
          ...createThresholds("digital_shelf_share_of_search_search_insights", 2990),
          ...createThresholds("digital_shelf_share_of_search_keyword_insights", 2990),
          ...createThresholds("digital_shelf_product_health_online_availability", 2990),
          ...createThresholds("digital_shelf_product_health_ratings_reviews", 2990),
          ...createThresholds("digital_shelf_product_health_price_competitiveness", 2990),
          ...createThresholds("digital_shelf_product_health_content_quality", 2990),
          ...createThresholds("digital_shelf_global_score_card", 2990),
        }
      : {}),
  },
  scenarios: {
    dashboardAccess: buildScenario("dashboardAccessScenario"),
    reportDownload: buildScenario("reportDownloadScenario"),
    ...(isDigitalShelfEnabled
      ? {
          digitalShelfBannerPresence: buildScenario(
            "digitalShelfBannerPresenceScenario"
          ),
          digitalShelfShareOfSearchSearchInsights: buildScenario(
            "digitalShelfShareOfSearchSearchInsightsScenario"
          ),
          digitalShelfShareOfSearchKeywordInsights: buildScenario(
            "digitalShelfShareOfSearchKeywordInsightsScenario"
          ),
          digitalShelfProductHealthOnlineAvailability: buildScenario(
            "digitalShelfProductHealthOnlineAvailabilityScenario"
          ),
          digitalShelfProductHealthRatingsReviews: buildScenario(
            "digitalShelfProductHealthRatingsReviewsScenario"
          ),
          digitalShelfProductHealthPriceCompetitiveness: buildScenario(
            "digitalShelfProductHealthPriceCompetitivenessScenario"
          ),
          digitalShelfProductHealthContentQuality: buildScenario(
            "digitalShelfProductHealthContentQualityScenario"
          ),
          digitalShelfGlobalScoreCard: buildScenario(
            "digitalShelfGlobalScoreCardScenario"
          ),
        }
      : {}),
  },
};

const dashboardAccessCounters = createScenarioCounters("dashboard_access");
const reportDownloadCounters = createScenarioCounters("report_download");
const bannerPresenceCounters = createScenarioCounters(
  "digital_shelf_banner_presence"
);
const sosSearchInsightsCounters = createScenarioCounters(
  "digital_shelf_share_of_search_search_insights"
);
const sosKeywordInsightsCounters = createScenarioCounters(
  "digital_shelf_share_of_search_keyword_insights"
);
const phOnlineAvailabilityCounters = createScenarioCounters(
  "digital_shelf_product_health_online_availability"
);
const phRatingsReviewsCounters = createScenarioCounters(
  "digital_shelf_product_health_ratings_reviews"
);
const phPriceCompetitivenessCounters = createScenarioCounters(
  "digital_shelf_product_health_price_competitiveness"
);
const phContentQualityCounters = createScenarioCounters(
  "digital_shelf_product_health_content_quality"
);
const globalScoreCardCounters = createScenarioCounters(
  "digital_shelf_global_score_card"
);

export function dashboardAccessScenario() {
  const accountResponse = getAccountDetails();
  const dashboardListResponse = getUserPowerBIDashboards();
  const dashboardDetailResponse = getUserPowerBIDashboardByID();

  recordScenario(dashboardAccessCounters, [
    accountResponse,
    dashboardListResponse,
    dashboardDetailResponse,
  ]);
}

export function reportDownloadScenario() {
  const accountResponse = getAccountDetails();
  const reportListResponse = getUserCategoryInsights();
  const reportDownloadResponse = getPresignedS3URL();

  recordScenario(reportDownloadCounters, [
    accountResponse,
    reportListResponse,
    reportDownloadResponse,
  ]);
}

export function digitalShelfBannerPresenceScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(bannerPresenceCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getDigitalShelfBannerPresence(),
  ]);
}

export function digitalShelfShareOfSearchSearchInsightsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(sosSearchInsightsCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getShareOfSearchKeywordOptions(),
    getShareOfSearchSearchInsightsMetrics(),
    getShareOfSearchSearchInsightsRanking(),
  ]);
}

export function digitalShelfShareOfSearchKeywordInsightsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(sosKeywordInsightsCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getShareOfSearchKeywordOptions(),
    getShareOfSearchKeywordInsightsScatterPlot(),
    getShareOfSearchKeywordDistribution(),
    getShareOfSearchPositionTable(),
  ]);
}

export function digitalShelfProductHealthOnlineAvailabilityScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(phOnlineAvailabilityCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getDigitalShelfShopsByBrands(),
    getDigitalShelfCompetitorBrands(),
    getProductHealthOnlineAvailabilityMetrics(),
    getProductHealthOnlineAvailabilityProducts(),
  ]);
}

export function digitalShelfProductHealthRatingsReviewsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(phRatingsReviewsCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getDigitalShelfShopsByBrands(),
    getDigitalShelfCompetitorBrands(),
    getProductHealthRatingsReviewsMetrics(),
    getProductHealthRatingsReviewsProducts(),
  ]);
}

export function digitalShelfProductHealthPriceCompetitivenessScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(phPriceCompetitivenessCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getDigitalShelfShopsByBrands(),
    getDigitalShelfCompetitorBrands(),
    getProductHealthPriceCompetitivenessMetrics(),
    getProductHealthPriceCompetitivenessProducts(),
  ]);
}

export function digitalShelfProductHealthContentQualityScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(phContentQualityCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getDigitalShelfShopsByBrands(),
    getDigitalShelfCompetitorBrands(),
    getProductHealthContentQualityMetrics(),
    getProductHealthContentQualityProducts(),
  ]);
}

export function digitalShelfGlobalScoreCardScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  recordScenario(globalScoreCardCounters, [
    getAccountDetails(),
    getDigitalShelfSubscriptionDetails(),
    getGlobalScoreCardTrendMetrics(),
    getGlobalScoreCardTableMetrics(),
    getGlobalScoreCardCountryTableMetricsBatch(),
  ]);
}
