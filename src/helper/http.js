import http from "k6/http";
import { check } from "k6";

function appendParam(params, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendParam(params, key, item);
    }
    return;
  }

  params.push([key, String(value)]);
}

export function envList(name, fallback = []) {
  const value = __ENV[name];

  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function envBool(name) {
  const value = __ENV[name];

  if (value === undefined) {
    return undefined;
  }

  return value === "true";
}

export function buildQueryString(query = {}) {
  const params = [];

  for (const [key, value] of Object.entries(query)) {
    appendParam(params, key, value);
  }

  if (params.length === 0) {
    return "";
  }

  return (
    "?" +
    params
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")
  );
}

export function apiUrl(path, query) {
  return `${__ENV.BASE_URL}${path}${buildQueryString(query)}`;
}

export function authHeaders(extraHeaders = {}) {
  return {
    accept: "*/*",
    "content-type": "application/json",
    Authorization: `Bearer ${__ENV.TOKEN}`,
    ...extraHeaders,
  };
}

export function logOnFailure(name, response) {
  if (response.status >= 400) {
    console.log(`----- ${name} failed (${response.status}) -----`);
    console.log(response.body);
  }
}

export function assertSuccess(response, name, expectedStatus = 200) {
  check(response, {
    [`[${name}] response status must be ${expectedStatus}`]: (res) =>
      res.status === expectedStatus,
    [`[${name}] response body must not be empty`]: (res) => Boolean(res.body),
  });
}

export function getRequest(path, { name, query, timeout = "1s" } = {}) {
  const response = http.get(apiUrl(path, query), {
    headers: authHeaders(),
    timeout,
  });

  logOnFailure(name ?? path, response);
  assertSuccess(response, name ?? path);

  return response;
}

export function postRequest(path, body, { name, query, timeout = "1s" } = {}) {
  const response = http.post(
    apiUrl(path, query),
    JSON.stringify(body),
    {
      headers: authHeaders(),
      timeout,
    }
  );

  logOnFailure(name ?? path, response);
  assertSuccess(response, name ?? path);

  return response;
}
