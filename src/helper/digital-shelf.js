import { envBool, envList, postRequest } from "./http.js";

function digitalShelfFilters() {
  return {
    startDate: __ENV.DIGITAL_SHELF_START_DATE,
    endDate: __ENV.DIGITAL_SHELF_END_DATE,
    startTime: __ENV.DIGITAL_SHELF_START_TIME ?? __ENV.DIGITAL_SHELF_START_DATE,
    endTime: __ENV.DIGITAL_SHELF_END_TIME ?? __ENV.DIGITAL_SHELF_END_DATE,
    date: __ENV.DIGITAL_SHELF_POSITION_DATE ?? __ENV.DIGITAL_SHELF_END_DATE,
    country: __ENV.DIGITAL_SHELF_COUNTRY,
    countries: envList("DIGITAL_SHELF_COUNTRIES"),
    channels: envList("DIGITAL_SHELF_CHANNELS"),
    categoryL2: envList("DIGITAL_SHELF_CATEGORY_L2"),
    categoryL3: envList("DIGITAL_SHELF_CATEGORY_L3"),
    categoryL4: envList("DIGITAL_SHELF_CATEGORY_L4"),
    brands: envList("DIGITAL_SHELF_BRANDS"),
    brandNames: envList("DIGITAL_SHELF_BRANDS"),
    keywords: envList("DIGITAL_SHELF_KEYWORDS"),
    shopNames: envList("DIGITAL_SHELF_SHOPS"),
    shops: envList("DIGITAL_SHELF_SHOPS"),
  };
}

function productListFilters() {
  return {
    startTime: __ENV.DIGITAL_SHELF_START_TIME ?? __ENV.DIGITAL_SHELF_START_DATE,
    endTime: __ENV.DIGITAL_SHELF_END_TIME ?? __ENV.DIGITAL_SHELF_END_DATE,
    country: __ENV.DIGITAL_SHELF_COUNTRY,
    channels: envList("DIGITAL_SHELF_CHANNELS"),
    categoryL2: envList("DIGITAL_SHELF_CATEGORY_L2"),
    categoryL3: envList("DIGITAL_SHELF_CATEGORY_L3"),
    categoryL4: envList("DIGITAL_SHELF_CATEGORY_L4"),
    brandNames: envList("DIGITAL_SHELF_BRANDS"),
    shopNames: envList("DIGITAL_SHELF_SHOPS"),
    searchText: __ENV.DIGITAL_SHELF_SEARCH_TEXT,
    isOfficial: envBool("DIGITAL_SHELF_IS_OFFICIAL"),
    limit: __ENV.DIGITAL_SHELF_LIMIT ?? "50",
    sortBy: __ENV.DIGITAL_SHELF_SORT_BY,
    sortOrder: __ENV.DIGITAL_SHELF_SORT_ORDER,
    "cursor.productKey": __ENV.DIGITAL_SHELF_CURSOR_PRODUCT_KEY,
    "cursor.sortValue": __ENV.DIGITAL_SHELF_CURSOR_SORT_VALUE,
  };
}

function globalScoreCardBenchmark() {
  return {
    ratings: {
      productRatingBenchmark: Number(__ENV.DIGITAL_SHELF_PRODUCT_RATING_BENCHMARK),
    },
    reviews: {
      productReviewBenchmark: Number(__ENV.DIGITAL_SHELF_PRODUCT_REVIEW_BENCHMARK),
    },
    contentQuality: {
      productContentQualityBenchmark: Number(
        __ENV.DIGITAL_SHELF_PRODUCT_CONTENT_QUALITY_BENCHMARK
      ),
    },
  };
}

export function getDigitalShelfSubscriptionDetails() {
  return postRequest("/api/digital-shelf/subscription-details", {}, {
    name: "getDigitalShelfSubscriptionDetails",
  });
}

export function getDigitalShelfBannerPresence() {
  return postRequest("/api/digital-shelf/banner-presence", {}, {
    name: "getDigitalShelfBannerPresence",
  });
}

export function getDigitalShelfCompetitorBrands() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/competitor-brands",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      countries: filters.countries,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
    },
    {
      name: "getDigitalShelfCompetitorBrands",
    }
  );
}

export function getDigitalShelfShopsByBrands() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/shops-by-brands",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
    },
    {
      name: "getDigitalShelfShopsByBrands",
    }
  );
}

export function getShareOfSearchKeywordOptions() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/keyword-options",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
    },
    {
      name: "getShareOfSearchKeywordOptions",
    }
  );
}

export function getShareOfSearchSearchInsightsMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/search-insights/metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      keywords: filters.keywords,
    },
    {
      name: "getShareOfSearchSearchInsightsMetrics",
    }
  );
}

export function getShareOfSearchSearchInsightsRanking() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/search-insights/ranking",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      keywords: filters.keywords,
    },
    {
      name: "getShareOfSearchSearchInsightsRanking",
    }
  );
}

export function getShareOfSearchKeywordInsightsScatterPlot() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/keyword-insights/scatter-plot",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      keywords: filters.keywords,
    },
    {
      name: "getShareOfSearchKeywordInsightsScatterPlot",
    }
  );
}

export function getShareOfSearchKeywordDistribution() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/keyword-insights/keyword-distribution",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      keywords: filters.keywords,
    },
    {
      name: "getShareOfSearchKeywordDistribution",
    }
  );
}

export function getShareOfSearchPositionTable() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/share-of-search/keyword-insights/position-table",
    {
      date: filters.date,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      keywords: filters.keywords,
    },
    {
      name: "getShareOfSearchPositionTable",
    }
  );
}

export function getProductHealthOnlineAvailabilityMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/product-health/online-availability/metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      shopNames: filters.shopNames,
    },
    {
      name: "getProductHealthOnlineAvailabilityMetrics",
    }
  );
}

export function getProductHealthOnlineAvailabilityProducts() {
  return postRequest(
    "/api/digital-shelf/product-health/online-availability/products",
    productListFilters(),
    {
      name: "getProductHealthOnlineAvailabilityProducts",
    }
  );
}

export function getProductHealthRatingsReviewsMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/product-health/ratings-reviews/metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      shopNames: filters.shopNames,
      ratingBenchmark: __ENV.DIGITAL_SHELF_RATING_BENCHMARK,
    },
    {
      name: "getProductHealthRatingsReviewsMetrics",
    }
  );
}

export function getProductHealthRatingsReviewsProducts() {
  return postRequest(
    "/api/digital-shelf/product-health/ratings-reviews/products",
    productListFilters(),
    {
      name: "getProductHealthRatingsReviewsProducts",
    }
  );
}

export function getProductHealthPriceCompetitivenessMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/product-health/price-competitiveness/metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      shopNames: filters.shopNames,
      ratingBenchmark: __ENV.DIGITAL_SHELF_RATING_BENCHMARK,
      groupBy: __ENV.DIGITAL_SHELF_PRICE_GROUP_BY ?? "brand",
    },
    {
      name: "getProductHealthPriceCompetitivenessMetrics",
    }
  );
}

export function getProductHealthPriceCompetitivenessProducts() {
  return postRequest(
    "/api/digital-shelf/product-health/price-competitiveness/products",
    productListFilters(),
    {
      name: "getProductHealthPriceCompetitivenessProducts",
    }
  );
}

export function getProductHealthContentQualityMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/product-health/content-quality/metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      country: filters.country,
      channels: filters.channels,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      brands: filters.brands,
      shopNames: filters.shopNames,
      contentOverallPassScoreBenchmark:
        __ENV.DIGITAL_SHELF_CONTENT_OVERALL_PASS_SCORE_BENCHMARK,
      contentProductTitleBenchmark:
        __ENV.DIGITAL_SHELF_CONTENT_PRODUCT_TITLE_BENCHMARK,
      contentProductDescriptionBenchmark:
        __ENV.DIGITAL_SHELF_CONTENT_PRODUCT_DESCRIPTION_BENCHMARK,
      contentRichMediaBenchmark:
        __ENV.DIGITAL_SHELF_CONTENT_RICH_MEDIA_BENCHMARK,
      ratioGroupBy: __ENV.DIGITAL_SHELF_RATIO_GROUP_BY,
    },
    {
      name: "getProductHealthContentQualityMetrics",
    }
  );
}

export function getProductHealthContentQualityProducts() {
  return postRequest(
    "/api/digital-shelf/product-health/content-quality/products",
    productListFilters(),
    {
      name: "getProductHealthContentQualityProducts",
    }
  );
}

export function getGlobalScoreCardTrendMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/global-score-card/trend-metrics",
    {
      groupBy: __ENV.DIGITAL_SHELF_GLOBAL_SCORECARD_GROUP_BY ?? "country",
      startDate: filters.startDate,
      endDate: filters.endDate,
      countries: filters.countries,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      channels: filters.channels,
      brands: filters.brands,
      shops: filters.shops,
      productRatingBenchmark: __ENV.DIGITAL_SHELF_PRODUCT_RATING_BENCHMARK,
      productReviewBenchmark: __ENV.DIGITAL_SHELF_PRODUCT_REVIEW_BENCHMARK,
      productContentQualityBenchmark:
        __ENV.DIGITAL_SHELF_PRODUCT_CONTENT_QUALITY_BENCHMARK,
    },
    {
      name: "getGlobalScoreCardTrendMetrics",
    }
  );
}

export function getGlobalScoreCardTableMetrics() {
  const filters = digitalShelfFilters();

  return postRequest(
    "/api/digital-shelf/global-score-card/table-metrics",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      countries: filters.countries,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      channels: filters.channels,
      brands: filters.brands,
      tab: __ENV.DIGITAL_SHELF_GLOBAL_SCORECARD_TAB ?? "Country",
      benchmark: globalScoreCardBenchmark(),
    },
    {
      name: "getGlobalScoreCardTableMetrics",
    }
  );
}

export function getGlobalScoreCardCountryTableMetricsBatch() {
  const filters = digitalShelfFilters();
  const benchmark = globalScoreCardBenchmark();

  return postRequest(
    "/api/digital-shelf/global-score-card/country-table-metrics-batch",
    {
      startDate: filters.startDate,
      endDate: filters.endDate,
      countries: filters.countries,
      categoryL2: filters.categoryL2,
      categoryL3: filters.categoryL3,
      categoryL4: filters.categoryL4,
      channels: filters.channels,
      brands: filters.brands,
      globalBenchmark: benchmark,
      countryBenchmarks: {
        [__ENV.DIGITAL_SHELF_COUNTRY_BENCHMARK_KEY ?? filters.country ?? "default"]:
          benchmark,
      },
    },
    {
      name: "getGlobalScoreCardCountryTableMetricsBatch",
    }
  );
}
