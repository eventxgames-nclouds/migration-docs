/**
 * K6 Asset Loading Test Script
 * Scenario: Burst of 10K asset requests
 * Tests CloudFront CDN and S3 origin performance
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const assetLatency = new Trend('asset_latency', true);
const assetErrors = new Rate('asset_errors');
const cacheHitRate = new Rate('cache_hit_rate');
const bytesDownloaded = new Counter('bytes_downloaded');
const requestsPerSecond = new Counter('requests_per_second');

// Configuration
const CDN_URL = __ENV.CDN_URL || 'https://cdn.eventxgames.com';
const ORIGIN_URL = __ENV.ORIGIN_URL || 'https://assets.eventxgames.com';

export const options = {
  scenarios: {
    // Scenario 1: Sustained load
    sustained_load: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
    // Scenario 2: Burst traffic (10K requests in 30s)
    burst_load: {
      executor: 'constant-arrival-rate',
      rate: 333,  // ~10K over 30 seconds
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      startTime: '5m', // Start after sustained load
    },
    // Scenario 3: Recovery after burst
    post_burst: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 50,
      maxVUs: 200,
      startTime: '5m30s',
    },
  },
  thresholds: {
    'asset_latency': [
      'p(50)<50',    // P50 under 50ms (cached)
      'p(95)<200',   // P95 under 200ms
      'p(99)<500',   // P99 under 500ms
    ],
    'asset_errors': ['rate<0.001'],      // Error rate under 0.1%
    'cache_hit_rate': ['rate>0.85'],     // Cache hit rate above 85%
    'http_req_failed': ['rate<0.01'],
  },
  tags: {
    testType: 'asset-loading',
    environment: __ENV.ENVIRONMENT || 'staging',
  },
};

// Asset categories and paths
const ASSET_CATEGORIES = {
  images: {
    weight: 0.4,
    paths: [
      '/games/puzzle-quest/sprites/player-{n}.png',
      '/games/puzzle-quest/backgrounds/level-{n}.jpg',
      '/games/space-battle/textures/ship-{n}.png',
      '/games/word-master/ui/button-{n}.png',
      '/avatars/user-{n}.jpg',
      '/thumbnails/game-{n}.jpg',
    ],
    sizes: ['small', 'medium', 'large', '2x'],
  },
  audio: {
    weight: 0.15,
    paths: [
      '/games/puzzle-quest/audio/bgm-{n}.mp3',
      '/games/space-battle/audio/sfx-{n}.wav',
      '/audio/ui/click.mp3',
      '/audio/ui/notification.mp3',
    ],
    sizes: null,
  },
  data: {
    weight: 0.25,
    paths: [
      '/games/puzzle-quest/levels/level-{n}.json',
      '/games/puzzle-quest/config.json',
      '/games/space-battle/missions/mission-{n}.json',
      '/localization/en.json',
      '/localization/es.json',
    ],
    sizes: null,
  },
  fonts: {
    weight: 0.1,
    paths: [
      '/fonts/game-title.woff2',
      '/fonts/body-text.woff2',
      '/fonts/mono.woff2',
    ],
    sizes: null,
  },
  video: {
    weight: 0.1,
    paths: [
      '/trailers/game-{n}-preview.mp4',
      '/tutorials/how-to-play-{n}.webm',
    ],
    sizes: ['720p', '1080p'],
  },
};

function selectAssetCategory() {
  const rand = Math.random();
  let cumulative = 0;

  for (const [category, config] of Object.entries(ASSET_CATEGORIES)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      return { category, config };
    }
  }

  return { category: 'images', config: ASSET_CATEGORIES.images };
}

function generateAssetUrl(category, config) {
  const pathTemplate = config.paths[Math.floor(Math.random() * config.paths.length)];
  let path = pathTemplate.replace(/{n}/g, () => Math.floor(Math.random() * 100) + 1);

  // Add size variant for applicable categories
  if (config.sizes && Math.random() < 0.7) {
    const size = config.sizes[Math.floor(Math.random() * config.sizes.length)];
    const ext = path.split('.').pop();
    path = path.replace(`.${ext}`, `-${size}.${ext}`);
  }

  return `${CDN_URL}${path}`;
}

export function setup() {
  // Verify CDN is reachable
  const healthRes = http.get(`${CDN_URL}/health`);
  const cdnOk = check(healthRes, {
    'CDN is reachable': (r) => r.status === 200 || r.status === 404,
  });

  if (!cdnOk) {
    console.warn('CDN health check failed, proceeding anyway...');
  }

  return {
    startTime: new Date().toISOString(),
  };
}

export default function (data) {
  const { category, config } = selectAssetCategory();
  const assetUrl = generateAssetUrl(category, config);

  group(`${category} assets`, function () {
    const startTime = Date.now();

    const res = http.get(assetUrl, {
      headers: {
        'Accept-Encoding': 'gzip, br',
        'Cache-Control': 'no-cache', // Force origin fetch occasionally
      },
      tags: {
        assetCategory: category,
      },
    });

    const latency = Date.now() - startTime;
    assetLatency.add(latency);
    requestsPerSecond.add(1);

    // Track bytes downloaded
    if (res.body) {
      bytesDownloaded.add(res.body.length);
    }

    // Check cache status
    const cacheStatus = res.headers['X-Cache'] || res.headers['x-cache'] || '';
    const cfCacheStatus = res.headers['CF-Cache-Status'] || res.headers['cf-cache-status'] || '';
    const isHit = cacheStatus.includes('Hit') || cfCacheStatus === 'HIT';

    cacheHitRate.add(isHit ? 1 : 0);

    const assetOk = check(res, {
      [`${category} status ok`]: (r) => [200, 206, 304].includes(r.status),
      [`${category} has content`]: (r) => r.body && r.body.length > 0,
      [`${category} response fast`]: (r) => r.timings.duration < 1000,
    });

    if (!assetOk) {
      assetErrors.add(1);
      console.log(`Asset error: ${assetUrl} - Status: ${res.status}`);
    } else {
      assetErrors.add(0);
    }

    // Log slow requests
    if (res.timings.duration > 500) {
      console.log(`Slow asset: ${assetUrl} - ${res.timings.duration}ms - Cache: ${cacheStatus || cfCacheStatus}`);
    }
  });
}

// Test specific CloudFront behaviors
export function handleSummary(data) {
  const summary = {
    testType: 'Asset Loading Test',
    completedAt: new Date().toISOString(),
    metrics: {
      totalRequests: data.metrics.http_reqs?.values?.count || 0,
      failedRequests: data.metrics.http_req_failed?.values?.rate || 0,
      avgLatency: data.metrics.asset_latency?.values?.avg || 0,
      p50Latency: data.metrics.asset_latency?.values['p(50)'] || 0,
      p95Latency: data.metrics.asset_latency?.values['p(95)'] || 0,
      p99Latency: data.metrics.asset_latency?.values['p(99)'] || 0,
      cacheHitRate: data.metrics.cache_hit_rate?.values?.rate || 0,
      totalBytesDownloaded: data.metrics.bytes_downloaded?.values?.count || 0,
    },
    thresholdsBreached: Object.entries(data.thresholds || {})
      .filter(([, v]) => !v.ok)
      .map(([k]) => k),
  };

  return {
    'results/asset-test-summary.json': JSON.stringify(summary, null, 2),
  };
}

export function teardown(data) {
  console.log(`Asset Loading Test completed. Started: ${data.startTime}`);
}
