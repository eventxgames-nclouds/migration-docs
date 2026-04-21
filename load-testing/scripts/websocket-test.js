/**
 * K6 WebSocket Load Test Script
 * Scenario: 5000 concurrent WebSocket connections
 * Tests real-time chat and game state synchronization
 */

import { check, sleep } from 'k6';
import ws from 'k6/ws';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const wsConnectTime = new Trend('ws_connect_time', true);
const wsMessageLatency = new Trend('ws_message_latency', true);
const wsErrors = new Rate('ws_errors');
const wsConnectionErrors = new Rate('ws_connection_errors');
const activeConnections = new Gauge('ws_active_connections');
const messagesReceived = new Counter('ws_messages_received');
const messagesSent = new Counter('ws_messages_sent');

// Configuration
const WS_URL = __ENV.WS_URL || 'wss://ws.eventxgames.com';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export const options = {
  scenarios: {
    websocket_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1000 },   // Ramp to 1000
        { duration: '2m', target: 2500 },   // Ramp to 2500
        { duration: '2m', target: 5000 },   // Ramp to 5000
        { duration: '10m', target: 5000 },  // Sustain 5000
        { duration: '2m', target: 6000 },   // Spike to 6000
        { duration: '3m', target: 6000 },   // Hold spike
        { duration: '2m', target: 0 },      // Ramp down
      ],
      gracefulRampDown: '1m',
    },
  },
  thresholds: {
    'ws_connect_time': ['p(95)<5000'],         // Connection under 5s
    'ws_message_latency': ['p(95)<100'],       // Message latency under 100ms
    'ws_errors': ['rate<0.02'],                // Error rate under 2%
    'ws_connection_errors': ['rate<0.05'],     // Connection error rate under 5%
  },
  tags: {
    testType: 'websocket',
    environment: __ENV.ENVIRONMENT || 'staging',
  },
};

// Message types for testing
const MESSAGE_TYPES = {
  CHAT: 'chat',
  GAME_STATE: 'game_state',
  PRESENCE: 'presence',
  SYNC: 'sync',
  PING: 'ping',
};

function generateChatMessage() {
  const messages = [
    'Great game!',
    'Nice move!',
    'GG',
    'Ready?',
    'Let\'s go!',
    'Good luck!',
    'Well played',
    'Rematch?',
  ];
  return {
    type: MESSAGE_TYPES.CHAT,
    content: messages[Math.floor(Math.random() * messages.length)],
    timestamp: Date.now(),
  };
}

function generateGameStateUpdate() {
  return {
    type: MESSAGE_TYPES.GAME_STATE,
    state: {
      position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      health: Math.floor(Math.random() * 100),
      score: Math.floor(Math.random() * 10000),
      action: ['move', 'attack', 'defend', 'idle'][Math.floor(Math.random() * 4)],
    },
    sequence: Date.now(),
    timestamp: Date.now(),
  };
}

function generatePresenceUpdate() {
  return {
    type: MESSAGE_TYPES.PRESENCE,
    status: ['online', 'away', 'busy', 'in_game'][Math.floor(Math.random() * 4)],
    lastActive: Date.now(),
  };
}

function generateSyncRequest() {
  return {
    type: MESSAGE_TYPES.SYNC,
    requestId: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    since: Date.now() - Math.floor(Math.random() * 60000),
  };
}

export default function () {
  const userId = `user-${__VU}-${__ITER}`;
  const roomId = `room-${Math.floor(__VU / 50)}`;  // 50 users per room
  const connectUrl = `${WS_URL}/connect?userId=${userId}&room=${roomId}&token=${AUTH_TOKEN}`;

  const connectStart = Date.now();
  let connected = false;
  let messageCount = 0;
  const pendingResponses = new Map();

  const res = ws.connect(connectUrl, {
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'X-Client-Version': '1.0.0',
    },
  }, function (socket) {
    const connectTime = Date.now() - connectStart;
    wsConnectTime.add(connectTime);

    socket.on('open', function () {
      connected = true;
      activeConnections.add(1);

      check(true, {
        'WebSocket connected': () => true,
        'Connection time acceptable': () => connectTime < 5000,
      });

      // Send initial presence
      const presenceMsg = JSON.stringify(generatePresenceUpdate());
      socket.send(presenceMsg);
      messagesSent.add(1);

      // Send authentication
      socket.send(JSON.stringify({
        type: 'auth',
        userId: userId,
        token: AUTH_TOKEN,
        room: roomId,
      }));
      messagesSent.add(1);
    });

    socket.on('message', function (msg) {
      const receiveTime = Date.now();
      messagesReceived.add(1);
      messageCount++;

      try {
        const data = JSON.parse(msg);

        // Handle ping/pong for latency measurement
        if (data.type === 'pong' && data.pingId) {
          const sendTime = pendingResponses.get(data.pingId);
          if (sendTime) {
            wsMessageLatency.add(receiveTime - sendTime);
            pendingResponses.delete(data.pingId);
          }
        }

        // Handle sync responses
        if (data.type === 'sync_response' && data.requestId) {
          const sendTime = pendingResponses.get(data.requestId);
          if (sendTime) {
            wsMessageLatency.add(receiveTime - sendTime);
            pendingResponses.delete(data.requestId);
          }
        }

        // Acknowledge game state broadcasts
        if (data.type === 'game_state_broadcast') {
          socket.send(JSON.stringify({
            type: 'ack',
            sequence: data.sequence,
            timestamp: Date.now(),
          }));
          messagesSent.add(1);
        }

      } catch (e) {
        // Non-JSON message, just count it
      }

      check(true, {
        'Message received': () => true,
      });
    });

    socket.on('error', function (e) {
      wsErrors.add(1);
      console.log(`WebSocket error for ${userId}: ${e.message || e}`);
    });

    socket.on('close', function () {
      activeConnections.add(-1);
      connected = false;
    });

    // Simulate realistic user behavior over connection lifetime
    // Connection stays open for 30-120 seconds
    const connectionDuration = Math.floor(Math.random() * 90000) + 30000;
    const endTime = Date.now() + connectionDuration;

    // Periodic activities during connection
    socket.setInterval(function () {
      if (Date.now() >= endTime) {
        socket.close();
        return;
      }

      // Send periodic ping for latency measurement
      const pingId = `ping-${Date.now()}`;
      pendingResponses.set(pingId, Date.now());
      socket.send(JSON.stringify({
        type: MESSAGE_TYPES.PING,
        pingId: pingId,
        timestamp: Date.now(),
      }));
      messagesSent.add(1);
    }, 5000); // Ping every 5 seconds

    // Random activity simulation
    socket.setInterval(function () {
      if (Date.now() >= endTime) return;

      const activityType = Math.random();

      if (activityType < 0.3) {
        // Send chat message (30% chance)
        socket.send(JSON.stringify(generateChatMessage()));
        messagesSent.add(1);
      } else if (activityType < 0.7) {
        // Send game state update (40% chance)
        socket.send(JSON.stringify(generateGameStateUpdate()));
        messagesSent.add(1);
      } else if (activityType < 0.85) {
        // Send presence update (15% chance)
        socket.send(JSON.stringify(generatePresenceUpdate()));
        messagesSent.add(1);
      } else {
        // Send sync request (15% chance)
        const syncReq = generateSyncRequest();
        pendingResponses.set(syncReq.requestId, Date.now());
        socket.send(JSON.stringify(syncReq));
        messagesSent.add(1);
      }
    }, 2000); // Activity every 2 seconds on average

    // Wait for connection duration
    socket.setTimeout(function () {
      // Graceful disconnect
      socket.send(JSON.stringify({
        type: 'disconnect',
        reason: 'test_complete',
        timestamp: Date.now(),
      }));
      messagesSent.add(1);

      // Give time for final messages
      socket.setTimeout(function () {
        socket.close();
      }, 1000);
    }, connectionDuration);
  });

  const connectionSucceeded = check(res, {
    'WebSocket session completed': (r) => r && r.status === 101,
  });

  if (!connectionSucceeded) {
    wsConnectionErrors.add(1);
    console.log(`WebSocket connection failed for user-${__VU}`);
  } else {
    wsConnectionErrors.add(0);
  }

  // Brief pause between iterations
  sleep(Math.random() * 3 + 1);
}

export function handleSummary(data) {
  const summary = {
    testType: 'WebSocket Load Test',
    completedAt: new Date().toISOString(),
    metrics: {
      peakConnections: data.metrics.ws_active_connections?.values?.max || 0,
      totalMessagesSent: data.metrics.ws_messages_sent?.values?.count || 0,
      totalMessagesReceived: data.metrics.ws_messages_received?.values?.count || 0,
      avgConnectTime: data.metrics.ws_connect_time?.values?.avg || 0,
      p95ConnectTime: data.metrics.ws_connect_time?.values['p(95)'] || 0,
      avgMessageLatency: data.metrics.ws_message_latency?.values?.avg || 0,
      p95MessageLatency: data.metrics.ws_message_latency?.values['p(95)'] || 0,
      errorRate: data.metrics.ws_errors?.values?.rate || 0,
      connectionErrorRate: data.metrics.ws_connection_errors?.values?.rate || 0,
    },
    thresholdsBreached: Object.entries(data.thresholds || {})
      .filter(([, v]) => !v.ok)
      .map(([k]) => k),
  };

  return {
    'results/websocket-test-summary.json': JSON.stringify(summary, null, 2),
  };
}
