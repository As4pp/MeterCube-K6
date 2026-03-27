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
const scenarioVus = Number(__ENV.STRESS_SCENARIO_VUS ?? "2");
const scenarioIterations = Number(__ENV.STRESS_SCENARIO_ITERATIONS ?? "10");
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
    executor: "per-vu-iterations",
    vus: scenarioVus,
    iterations: scenarioIterations,
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
          ...createThresholds("dashboard_access", 2990),
          ...createThresholds("report_download", 2990),
        }
      : {}),
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

  runScenarioSteps(dashboardAccessCounters, [
    getAccountDetails,
    getUserPowerBIDashboards,
    getUserPowerBIDashboardByID,
  ]);
}

export function reportDownloadScenario() {
  if (!isLegacyTestsEnabled) {
    return;
  }

  runScenarioSteps(reportDownloadCounters, [
    getAccountDetails,
    getUserCategoryInsights,
    getPresignedS3URL,
  ]);
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
