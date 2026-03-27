# MeterCube K6 Tests

This repo contains K6 scripts for authenticated API testing against the MeterCube app.

## What We Test

Current helper coverage lives under `src/helper`:

- `digital-shelf.js`: digital shelf subscription, share of search, product health, global score card, banner presence, competitor brands, and shops by brands

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

- `src/test.js`: a simple smoke run. This executes each selected helper once with `1` VU and `1` iteration.
- `src/main.js`: a scenario-based load test using K6 `scenarios` with `ramping-vus`.
- `src/main-stress.js`: a scenario-based repeated test using K6 `per-vu-iterations`.

Current scenario split:

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

Environment variables are documented in `.env.example`.

Important flags:

- `BASE_URL`: target MeterCube base URL
- `TOKEN`: bearer token for authenticated requests
- `ENABLE_DIGITAL_SHELF`: set to `false` to skip all digital shelf calls
- `ENABLE_LEGACY_TESTS`: set to `false` to skip all non-digital-shelf scenarios

## Commands

Smoke test:

```bash
npm run k6:test
```

Scenario-based run:

```bash
npm run k6:main
```

## Additional Docs

- Human-readable test plan: `docs/human-readable-plan.md`
- Scenario to endpoint and SQL mapping sheet: `docs/scenario-endpoint-sql.csv`
