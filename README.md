# MeterCube K6 Tests

This repo contains K6 scripts for authenticated API testing against the MeterCube app.

## What We Test

Current helper coverage lives under [`src/helper`](c:\Users\Vatic\Work\MeterCube-K6\src\helper):

- [`account.js`](c:\Users\Vatic\Work\MeterCube-K6\src\helper\account.js): account detail lookup
- [`category-dashboard.js`](c:\Users\Vatic\Work\MeterCube-K6\src\helper\category-dashboard.js): dashboard list and dashboard detail
- [`category-report.js`](c:\Users\Vatic\Work\MeterCube-K6\src\helper\category-report.js): report list and presigned URL generation
- [`digital-shelf.js`](c:\Users\Vatic\Work\MeterCube-K6\src\helper\digital-shelf.js): digital shelf subscription, share of search, product health, global score card, banner presence, competitor brands, and shops by brands

Digital shelf endpoints currently covered:

- `POST /api/digital-shelf/subscription-details`
- `POST /api/digital-shelf/banner-presence`
- `POST /api/digital-shelf/competitor-brands`
- `POST /api/digital-shelf/shops-by-brands`
- `POST /api/digital-shelf/share-of-search/keyword-options`
- `POST /api/digital-shelf/share-of-search/search-insights/metrics`
- `POST /api/digital-shelf/share-of-search/search-insights/ranking`
- `POST /api/digital-shelf/share-of-search/keyword-insights/scatter-plot`
- `POST /api/digital-shelf/share-of-search/keyword-insights/keyword-distribution`
- `POST /api/digital-shelf/share-of-search/keyword-insights/position-table`
- `POST /api/digital-shelf/product-health/online-availability/metrics`
- `POST /api/digital-shelf/product-health/online-availability/products`
- `POST /api/digital-shelf/product-health/ratings-reviews/metrics`
- `POST /api/digital-shelf/product-health/ratings-reviews/products`
- `POST /api/digital-shelf/product-health/price-competitiveness/metrics`
- `POST /api/digital-shelf/product-health/price-competitiveness/products`
- `POST /api/digital-shelf/product-health/content-quality/metrics`
- `POST /api/digital-shelf/product-health/content-quality/products`
- `POST /api/digital-shelf/global-score-card/trend-metrics`
- `POST /api/digital-shelf/global-score-card/table-metrics`
- `POST /api/digital-shelf/global-score-card/country-table-metrics-batch`

## Test Approach

There are two styles of execution in this repo:

- [`src/test.js`](c:\Users\Vatic\Work\MeterCube-K6\src\test.js): a simple smoke run. This executes each selected helper once with `1` VU and `1` iteration.
- [`src/main.js`](c:\Users\Vatic\Work\MeterCube-K6\src\main.js): a scenario-based load test using K6 `scenarios` with `ramping-vus`.
- [`src/main-stress.js`](c:\Users\Vatic\Work\MeterCube-K6\src\main-stress.js): a scenario-based repeated test using K6 `per-vu-iterations`.

Current scenario split:

- dashboard access
- report download
- digital shelf banner presence
- digital shelf share of search: search insights tab
- digital shelf share of search: keyword insights tab
- digital shelf product health: online availability tab
- digital shelf product health: ratings and reviews tab
- digital shelf product health: price competitiveness tab
- digital shelf product health: content quality tab
- digital shelf global score card

For product health specifically, the scenario split is now one scenario per tab, which means 4 separate scenarios.

## Configuration

Environment variables are documented in [`\.env.example`](c:\Users\Vatic\Work\MeterCube-K6\.env.example).

Important flags:

- `BASE_URL`: target MeterCube base URL
- `TOKEN`: bearer token for authenticated requests
- `ENABLE_DIGITAL_SHELF`: set to `false` to skip all digital shelf calls

## Commands

Smoke test:

```bash
npm run k6:test
```

Scenario-based run:

```bash
npm run k6:main
```

With digital shelf disabled, those commands only exercise the older account, dashboard, and category report flows.
