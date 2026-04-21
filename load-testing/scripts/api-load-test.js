/**
 * K6 API Load Test Script
 * Scenario: 1000 concurrent users, 60-second ramp
 * Target: P50 < 100ms, P95 < 500ms, P99 < 1s
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const apiLatency = new Trend('api_latency', true);
const apiErrors = new Rate('api_errors');
const requestCount = new Counter('request_count');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://api.eventxgames.com';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export const options = {
  scenarios: {
    api_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 1000 },   // Ramp up to 1000 users over 60s
        { duration: '5m', target: 1000 },   // Stay at 1000 for 5 minutes
        { duration: '1m', target: 1500 },   // Spike to 1500
        { duration: '2m', target: 1500 },   // Hold spike
        { duration: '1m', target: 0 },      // Ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    'api_latency': [
      'p(50)<100',   // P50 under 100ms
      'p(95)<500',   // P95 under 500ms
      'p(99)<1000',  // P99 under 1s
    ],
    'api_errors': ['rate<0.01'],  // Error rate under 1%
    'http_req_duration': ['p(95)<500'],
  },
  tags: {
    testType: 'api-load',
    environment: __ENV.ENVIRONMENT || 'staging',
  },
};

// Common headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Accept': 'application/json',
};

// Test data generators
function randomUserId() {
  return `user-${Math.floor(Math.random() * 100000)}`;
}

function randomGameId() {
  return `game-${Math.floor(Math.random() * 1000)}`;
}

export function setup() {
  // Verify API is reachable before running tests
  const healthCheck = http.get(`${BASE_URL}/health`);
  check(healthCheck, {
    'API is healthy': (r) => r.status === 200,
  });

  return {
    startTime: new Date().toISOString(),
    baseUrl: BASE_URL,
  };
}

export default function (data) {
  // Distribute requests across different API endpoints
  const scenario = Math.random();

  if (scenario < 0.3) {
    group('User Profile Operations', function () {
      userProfileOperations();
    });
  } else if (scenario < 0.6) {
    group('Game Listing Operations', function () {
      gameListingOperations();
    });
  } else if (scenario < 0.8) {
    group('Leaderboard Operations', function () {
      leaderboardOperations();
    });
  } else {
    group('Search Operations', function () {
      searchOperations();
    });
  }

  sleep(Math.random() * 2 + 0.5); // Random think time 0.5-2.5s
}

function userProfileOperations() {
  const userId = randomUserId();

  // GET user profile
  const profileStart = Date.now();
  const profileRes = http.get(`${BASE_URL}/api/v1/users/${userId}/profile`, { headers });
  const profileLatency = Date.now() - profileStart;

  apiLatency.add(profileLatency);
  requestCount.add(1);

  const profileOk = check(profileRes, {
    'profile status is 200 or 404': (r) => [200, 404].includes(r.status),
    'profile response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (!profileOk) {
    apiErrors.add(1);
  } else {
    apiErrors.add(0);
  }

  // GET user achievements
  const achieveStart = Date.now();
  const achieveRes = http.get(`${BASE_URL}/api/v1/users/${userId}/achievements`, { headers });
  const achieveLatency = Date.now() - achieveStart;

  apiLatency.add(achieveLatency);
  requestCount.add(1);

  const achieveOk = check(achieveRes, {
    'achievements status is 200 or 404': (r) => [200, 404].includes(r.status),
  });

  if (!achieveOk) apiErrors.add(1);
  else apiErrors.add(0);
}

function gameListingOperations() {
  // GET games list with pagination
  const page = Math.floor(Math.random() * 10) + 1;
  const pageSize = 20;

  const listStart = Date.now();
  const listRes = http.get(`${BASE_URL}/api/v1/games?page=${page}&pageSize=${pageSize}`, { headers });
  const listLatency = Date.now() - listStart;

  apiLatency.add(listLatency);
  requestCount.add(1);

  const listOk = check(listRes, {
    'games list status is 200': (r) => r.status === 200,
    'games list response time < 300ms': (r) => r.timings.duration < 300,
    'games list has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.games && body.games.length >= 0;
      } catch {
        return false;
      }
    },
  });

  if (!listOk) apiErrors.add(1);
  else apiErrors.add(0);

  // GET specific game details
  const gameId = randomGameId();
  const detailStart = Date.now();
  const detailRes = http.get(`${BASE_URL}/api/v1/games/${gameId}`, { headers });
  const detailLatency = Date.now() - detailStart;

  apiLatency.add(detailLatency);
  requestCount.add(1);

  const detailOk = check(detailRes, {
    'game detail status is 200 or 404': (r) => [200, 404].includes(r.status),
  });

  if (!detailOk) apiErrors.add(1);
  else apiErrors.add(0);
}

function leaderboardOperations() {
  const gameId = randomGameId();
  const timeframes = ['daily', 'weekly', 'monthly', 'alltime'];
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];

  // GET leaderboard
  const lbStart = Date.now();
  const lbRes = http.get(
    `${BASE_URL}/api/v1/games/${gameId}/leaderboard?timeframe=${timeframe}&limit=100`,
    { headers }
  );
  const lbLatency = Date.now() - lbStart;

  apiLatency.add(lbLatency);
  requestCount.add(1);

  const lbOk = check(lbRes, {
    'leaderboard status is 200 or 404': (r) => [200, 404].includes(r.status),
    'leaderboard response time < 200ms': (r) => r.timings.duration < 200,
  });

  if (!lbOk) apiErrors.add(1);
  else apiErrors.add(0);

  // GET user rank
  const userId = randomUserId();
  const rankStart = Date.now();
  const rankRes = http.get(
    `${BASE_URL}/api/v1/games/${gameId}/leaderboard/rank/${userId}`,
    { headers }
  );
  const rankLatency = Date.now() - rankStart;

  apiLatency.add(rankLatency);
  requestCount.add(1);

  const rankOk = check(rankRes, {
    'rank status is 200 or 404': (r) => [200, 404].includes(r.status),
  });

  if (!rankOk) apiErrors.add(1);
  else apiErrors.add(0);
}

function searchOperations() {
  const searchTerms = ['puzzle', 'action', 'strategy', 'arcade', 'multiplayer', 'adventure'];
  const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];

  const searchStart = Date.now();
  const searchRes = http.get(
    `${BASE_URL}/api/v1/search?q=${term}&type=games&limit=20`,
    { headers }
  );
  const searchLatency = Date.now() - searchStart;

  apiLatency.add(searchLatency);
  requestCount.add(1);

  const searchOk = check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 400ms': (r) => r.timings.duration < 400,
  });

  if (!searchOk) apiErrors.add(1);
  else apiErrors.add(0);
}

export function teardown(data) {
  console.log(`Test completed. Started at: ${data.startTime}`);
  console.log(`Base URL: ${data.baseUrl}`);
}
