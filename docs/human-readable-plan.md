
# MeterCube K6 Test Plan

  

## Goal

  

This test plan is designed to simulate a small feature launch with about 20 concurrent users while avoiding unnecessary database load and cost.

  

## User Model

  

- Total concurrent virtual users target: about 20

- Real-user behavior simulation: each scenario includes a random delay between API calls

- Current delay window: `1` to `3` seconds between steps

- Scenario-based load profile:

-  `src/main.js`: `2` VUs per scenario, ramped

-  `src/main-stress.js`: `2` VUs per scenario, `10` iterations each

  

There are 8 concurrent scenarios:

  

- digital shelf banner presence

- digital shelf share of search: search insights

- digital shelf share of search: keyword insights

- digital shelf product health: online availability

- digital shelf product health: ratings and reviews

- digital shelf product health: price competitiveness

- digital shelf product health: content quality

- digital shelf global score card

  

That means the default setup now approximates:

  

-  `8 scenarios x 2 VUs = 16 concurrent virtual users`

  

## Scenario Breakdown

  

1. Banner Presence

- Purpose: check digital shelf access and banner presence page availability

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/banner-presence`

- Main database usage:

	- PostgreSQL subscription lookup

- Relative query cost:

	- light

  

2. Share of Search: Search Insights

- Purpose: mimic loading the search insights tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/share-of-search/keyword-options`

	-  `POST /api/digital-shelf/share-of-search/search-insights/metrics`

	-  `POST /api/digital-shelf/share-of-search/search-insights/ranking`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for share-of-search analytics

- Relative query cost:

	- medium to heavy

  

3. Share of Search: Keyword Insights

- Purpose: mimic loading the keyword insights tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/share-of-search/keyword-options`

	-  `POST /api/digital-shelf/share-of-search/keyword-insights/scatter-plot`

	-  `POST /api/digital-shelf/share-of-search/keyword-insights/keyword-distribution`

	-  `POST /api/digital-shelf/share-of-search/keyword-insights/position-table`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for keyword analytics

- Relative query cost:

	- medium to heavy

  

4. Product Health: Online Availability

- Purpose: mimic loading the online availability tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/shops-by-brands`

	-  `POST /api/digital-shelf/competitor-brands`

	-  `POST /api/digital-shelf/product-health/online-availability/metrics`

	-  `POST /api/digital-shelf/product-health/online-availability/products`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for metrics and product list

- Relative query cost:

	- heavy

  

5. Product Health: Ratings and Reviews

- Purpose: mimic loading the ratings and reviews tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/shops-by-brands`

	-  `POST /api/digital-shelf/competitor-brands`

	-  `POST /api/digital-shelf/product-health/ratings-reviews/metrics`

	-  `POST /api/digital-shelf/product-health/ratings-reviews/products`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for metrics and product list

	- Relative query cost:

- heavy

  

6. Product Health: Price Competitiveness

- Purpose: mimic loading the price competitiveness tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/shops-by-brands`

	-  `POST /api/digital-shelf/competitor-brands`

	-  `POST /api/digital-shelf/product-health/price-competitiveness/metrics`

	-  `POST /api/digital-shelf/product-health/price-competitiveness/products`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for historical price aggregation and product list

- Relative query cost:

	- heavy

  

7. Product Health: Content Quality

- Purpose: mimic loading the content quality tab

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/shops-by-brands`

	-  `POST /api/digital-shelf/competitor-brands`

	-  `POST /api/digital-shelf/product-health/content-quality/metrics`

	-  `POST /api/digital-shelf/product-health/content-quality/products`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for content score aggregation and product list

- Relative query cost:

	- heavy

  

8. Global Score Card

- Purpose: mimic loading trend and table sections of the global score card page

- APIs:

	-  `POST /api/digital-shelf/subscription-details`

	-  `POST /api/digital-shelf/global-score-card/trend-metrics`

	-  `POST /api/digital-shelf/global-score-card/table-metrics`

	-  `POST /api/digital-shelf/global-score-card/country-table-metrics-batch`

- Main database usage:

	- PostgreSQL for subscription access

	- Snowflake for multi-metric aggregation

- Relative query cost:

	- heavy

  

Note `POST /api/digital-shelf/subscription-details` are called only once per page on load.

  

## Query Heaviness Notes

  

These heaviness ratings are inferred from the repository code, not measured from query plans.

  

- Light:

	- mostly simple PostgreSQL joins and lookup reads

- Medium:

	- Snowflake aggregation over filtered datasets

- Heavy:

	- Snowflake queries with multiple CTEs, aggregations, `QUALIFY ROW_NUMBER()`, historical comparisons, or repeated metric fan-out

  

## Gaps / Assumptions

  

- Query heaviness is inferred from code structure, not from live DB execution plans