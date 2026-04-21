/**
 * K6 Game Session Load Test Script
 * Scenario: 500 concurrent game sessions
 * Simulates complete game lifecycle: create, play, save state, end
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const sessionLatency = new Trend('session_latency', true);
const sessionErrors = new Rate('session_errors');
const activeSessionsGauge = new Gauge('active_sessions');
const sessionCreateTime = new Trend('session_create_time', true);
const stateUpdateTime = new Trend('state_update_time', true);
const sessionEndTime = new Trend('session_end_time', true);

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://api.eventxgames.com';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export const options = {
  scenarios: {
    game_sessions: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 500 },    // Ramp to 500 sessions
        { duration: '10m', target: 500 },   // Sustain 500 concurrent sessions
        { duration: '2m', target: 750 },    // Spike to 750
        { duration: '5m', target: 750 },    // Hold spike
        { duration: '2m', target: 0 },      // Ramp down
      ],
      gracefulRampDown: '1m',
    },
  },
  thresholds: {
    'session_create_time': ['p(95)<2000'],      // Session creation under 2s
    'state_update_time': ['p(95)<200'],          // State updates under 200ms
    'session_end_time': ['p(95)<1000'],          // Session end under 1s
    'session_errors': ['rate<0.02'],             // Error rate under 2%
    'http_req_failed': ['rate<0.01'],
  },
  tags: {
    testType: 'game-session',
    environment: __ENV.ENVIRONMENT || 'staging',
  },
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
};

// Game IDs to use for testing
const GAME_IDS = [
  'puzzle-quest-001',
  'space-battle-002',
  'word-master-003',
  'card-duel-004',
  'racing-pro-005',
];

function randomGameId() {
  return GAME_IDS[Math.floor(Math.random() * GAME_IDS.length)];
}

function randomUserId() {
  return `loadtest-user-${__VU}-${Date.now()}`;
}

function generateGameState(level, score, progress) {
  return {
    level: level,
    score: score,
    progress: progress,
    checkpoint: `checkpoint-${level}`,
    inventory: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => ({
      itemId: `item-${i}`,
      quantity: Math.floor(Math.random() * 100),
    })),
    achievements: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => `achieve-${i}`),
    metadata: {
      playTime: Math.floor(Math.random() * 3600),
      lastAction: new Date().toISOString(),
    },
  };
}

export function setup() {
  // Verify API health
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'API is healthy': (r) => r.status === 200,
  });

  return {
    startTime: new Date().toISOString(),
  };
}

export default function (data) {
  const userId = randomUserId();
  const gameId = randomGameId();
  let sessionId = null;

  // Phase 1: Create Game Session
  group('Create Session', function () {
    const createStart = Date.now();
    const createRes = http.post(
      `${BASE_URL}/api/v1/games/${gameId}/sessions`,
      JSON.stringify({
        userId: userId,
        deviceInfo: {
          platform: 'web',
          browser: 'chrome',
          version: '120.0',
        },
        initialState: generateGameState(1, 0, 0),
      }),
      { headers }
    );
    const createTime = Date.now() - createStart;

    sessionCreateTime.add(createTime);
    sessionLatency.add(createTime);

    const createOk = check(createRes, {
      'session created': (r) => [200, 201].includes(r.status),
      'session has id': (r) => {
        try {
          const body = JSON.parse(r.body);
          sessionId = body.sessionId;
          return sessionId !== undefined;
        } catch {
          return false;
        }
      },
    });

    if (!createOk) {
      sessionErrors.add(1);
      return; // Exit early if session creation failed
    }
    sessionErrors.add(0);
  });

  if (!sessionId) {
    return; // Can't continue without session
  }

  activeSessionsGauge.add(1);

  // Phase 2: Simulate Gameplay (multiple state updates)
  group('Gameplay Loop', function () {
    // Simulate 5-15 game state updates (typical game session)
    const numUpdates = Math.floor(Math.random() * 11) + 5;

    for (let i = 0; i < numUpdates; i++) {
      const level = Math.floor(i / 3) + 1;
      const score = (i + 1) * 100 + Math.floor(Math.random() * 50);
      const progress = Math.min(((i + 1) / numUpdates) * 100, 100);

      const updateStart = Date.now();
      const updateRes = http.put(
        `${BASE_URL}/api/v1/games/${gameId}/sessions/${sessionId}/state`,
        JSON.stringify({
          state: generateGameState(level, score, progress),
          timestamp: new Date().toISOString(),
          eventType: 'progress',
        }),
        { headers }
      );
      const updateTime = Date.now() - updateStart;

      stateUpdateTime.add(updateTime);
      sessionLatency.add(updateTime);

      const updateOk = check(updateRes, {
        'state update successful': (r) => [200, 204].includes(r.status),
        'state update fast': (r) => r.timings.duration < 300,
      });

      if (!updateOk) {
        sessionErrors.add(1);
      } else {
        sessionErrors.add(0);
      }

      // Simulate gameplay think time (0.5-3 seconds between actions)
      sleep(Math.random() * 2.5 + 0.5);

      // Occasionally check leaderboard during gameplay (10% chance)
      if (Math.random() < 0.1) {
        http.get(`${BASE_URL}/api/v1/games/${gameId}/leaderboard?limit=10`, { headers });
      }
    }
  });

  // Phase 3: Occasional achievements
  group('Achievement Unlock', function () {
    if (Math.random() < 0.3) { // 30% chance of achievement
      const achieveRes = http.post(
        `${BASE_URL}/api/v1/games/${gameId}/sessions/${sessionId}/achievements`,
        JSON.stringify({
          achievementId: `achievement-${Math.floor(Math.random() * 20)}`,
          unlockedAt: new Date().toISOString(),
        }),
        { headers }
      );

      check(achieveRes, {
        'achievement recorded': (r) => [200, 201].includes(r.status),
      });
    }
  });

  // Phase 4: End Game Session
  group('End Session', function () {
    const endStart = Date.now();
    const endRes = http.post(
      `${BASE_URL}/api/v1/games/${gameId}/sessions/${sessionId}/end`,
      JSON.stringify({
        finalState: generateGameState(5, 5000, 100),
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        endReason: 'completed',
        metrics: {
          totalMoves: Math.floor(Math.random() * 500),
          hintsUsed: Math.floor(Math.random() * 5),
          undosUsed: Math.floor(Math.random() * 10),
        },
      }),
      { headers }
    );
    const endTime = Date.now() - endStart;

    sessionEndTime.add(endTime);
    sessionLatency.add(endTime);

    const endOk = check(endRes, {
      'session ended successfully': (r) => [200, 204].includes(r.status),
    });

    if (!endOk) {
      sessionErrors.add(1);
    } else {
      sessionErrors.add(0);
    }
  });

  activeSessionsGauge.add(-1);

  // Short pause before next iteration
  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  console.log(`Game Session Test completed. Started: ${data.startTime}`);
}
