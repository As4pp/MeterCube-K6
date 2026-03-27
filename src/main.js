import { sleep } from "k6";
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
const isLegacyTestsEnabled = __ENV.ENABLE_LEGACY_TESTS === "true";
const scenarioTargetVus = Number(__ENV.SCENARIO_TARGET_VUS ?? "2");
const minStepDelaySeconds = Number(__ENV.MIN_STEP_DELAY_SECONDS ?? "1");
const maxStepDelaySeconds = Number(__ENV.MAX_STEP_DELAY_SECONDS ?? "3");

function createThresholds(prefix, minSuccess) {
  return {
    [`${prefix}_success`]: [`count>${minSuccess}`],
    [`${prefix}_failed`]: ["count<10"],
  };
}

function buildScenario(exec) {
  return {
    exec,
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { target: scenarioTargetVus, duration: "10s" },
      { target: 0, duration: "10s" },
    ],
    gracefulRampDown: "0s",
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

function randomStepDelay() {
  const range = Math.max(maxStepDelaySeconds - minStepDelaySeconds, 0);
  return minStepDelaySeconds + Math.random() * range;
}

function runScenarioSteps(counters, steps) {
  const responses = [];

  for (let index = 0; index < steps.length; index += 1) {
    responses.push(steps[index]());

    if (index < steps.length - 1) {
      sleep(randomStepDelay());
    }
  }

  recordScenario(counters, responses);
}

export const options = {
  thresholds: {
    ...(isLegacyTestsEnabled
      ? {
          ...createThresholds("dashboard_access", 1490),
          ...createThresholds("report_download", 1490),
        }
      : {}),
    ...(isDigitalShelfEnabled
      ? {
          ...createThresholds("digital_shelf_banner_presence", 1490),
          ...createThresholds("digital_shelf_share_of_search_search_insights", 1490),
          ...createThresholds("digital_shelf_share_of_search_keyword_insights", 1490),
          ...createThresholds("digital_shelf_product_health_online_availability", 1490),
          ...createThresholds("digital_shelf_product_health_ratings_reviews", 1490),
          ...createThresholds("digital_shelf_product_health_price_competitiveness", 1490),
          ...createThresholds("digital_shelf_product_health_content_quality", 1490),
          ...createThresholds("digital_shelf_global_score_card", 1490),
        }
      : {}),
  },
  scenarios: {
    ...(isLegacyTestsEnabled
      ? {
          dashboardAccess: buildScenario("dashboardAccessScenario"),
          reportDownload: buildScenario("reportDownloadScenario"),
        }
      : {}),
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
  if (!isLegacyTestsEnabled) {
    return;
  }

  const accountResponse = getAccountDetails();

  if (accountResponse.status === 200) {
    dashboardAccessCounters.success.add(1);
  } else {
    dashboardAccessCounters.failed.add(1);
  }
}

export function reportDownloadScenario() {
  if (!isLegacyTestsEnabled) {
    return;
  }

  const accountResponse = getAccountDetails();

  if (accountResponse.status === 200) {
    reportDownloadCounters.success.add(1);
  } else {
    reportDownloadCounters.failed.add(1);
  }
}

export function digitalShelfBannerPresenceScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(bannerPresenceCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getDigitalShelfBannerPresence,
  ]);
}

export function digitalShelfShareOfSearchSearchInsightsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(sosSearchInsightsCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getShareOfSearchKeywordOptions,
    getShareOfSearchSearchInsightsMetrics,
    getShareOfSearchSearchInsightsRanking,
  ]);
}

export function digitalShelfShareOfSearchKeywordInsightsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(sosKeywordInsightsCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getShareOfSearchKeywordOptions,
    getShareOfSearchKeywordInsightsScatterPlot,
    getShareOfSearchKeywordDistribution,
    getShareOfSearchPositionTable,
  ]);
}

export function digitalShelfProductHealthOnlineAvailabilityScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(phOnlineAvailabilityCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getDigitalShelfShopsByBrands,
    getDigitalShelfCompetitorBrands,
    getProductHealthOnlineAvailabilityMetrics,
    getProductHealthOnlineAvailabilityProducts,
  ]);
}

export function digitalShelfProductHealthRatingsReviewsScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(phRatingsReviewsCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getDigitalShelfShopsByBrands,
    getDigitalShelfCompetitorBrands,
    getProductHealthRatingsReviewsMetrics,
    getProductHealthRatingsReviewsProducts,
  ]);
}

export function digitalShelfProductHealthPriceCompetitivenessScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(phPriceCompetitivenessCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getDigitalShelfShopsByBrands,
    getDigitalShelfCompetitorBrands,
    getProductHealthPriceCompetitivenessMetrics,
    getProductHealthPriceCompetitivenessProducts,
  ]);
}

export function digitalShelfProductHealthContentQualityScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(phContentQualityCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getDigitalShelfShopsByBrands,
    getDigitalShelfCompetitorBrands,
    getProductHealthContentQualityMetrics,
    getProductHealthContentQualityProducts,
  ]);
}

export function digitalShelfGlobalScoreCardScenario() {
  if (!isDigitalShelfEnabled) {
    return;
  }

  runScenarioSteps(globalScoreCardCounters, [
    getAccountDetails,
    getDigitalShelfSubscriptionDetails,
    getGlobalScoreCardTrendMetrics,
    getGlobalScoreCardTableMetrics,
    getGlobalScoreCardCountryTableMetricsBatch,
  ]);
}
