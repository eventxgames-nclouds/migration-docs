#!/bin/bash
#
# EventXGames Load Test Runner
# Usage: ./run-tests.sh [test-name] [options]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_DIR="$SCRIPT_DIR/results"

# Default configuration
BASE_URL="${BASE_URL:-https://api.eventxgames.com}"
CDN_URL="${CDN_URL:-https://cdn.eventxgames.com}"
WS_URL="${WS_URL:-wss://ws.eventxgames.com}"
ENVIRONMENT="${ENVIRONMENT:-staging}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_k6() {
    if ! command -v k6 &> /dev/null; then
        log_error "k6 is not installed. Please install it first:"
        echo "  brew install k6  # macOS"
        echo "  apt install k6   # Linux (after adding repo)"
        echo "  See README.md for full instructions"
        exit 1
    fi
}

create_results_dir() {
    mkdir -p "$RESULTS_DIR"
}

run_test() {
    local test_name=$1
    local script_path="$SCRIPT_DIR/scripts/${test_name}.js"
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local result_file="$RESULTS_DIR/${test_name}-${timestamp}.json"

    if [[ ! -f "$script_path" ]]; then
        log_error "Test script not found: $script_path"
        exit 1
    fi

    log_info "Running $test_name test..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Results will be saved to: $result_file"

    k6 run \
        --out json="$result_file" \
        -e BASE_URL="$BASE_URL" \
        -e CDN_URL="$CDN_URL" \
        -e WS_URL="$WS_URL" \
        -e AUTH_TOKEN="$AUTH_TOKEN" \
        -e ENVIRONMENT="$ENVIRONMENT" \
        "$script_path"

    log_info "Test completed. Results saved to: $result_file"
}

run_all_tests() {
    log_info "Running all load tests sequentially..."

    log_info "=== Test 1/4: API Load Test ==="
    run_test "api-load-test"

    log_info "Cooldown (60 seconds)..."
    sleep 60

    log_info "=== Test 2/4: Game Session Test ==="
    run_test "game-session-test"

    log_info "Cooldown (60 seconds)..."
    sleep 60

    log_info "=== Test 3/4: Asset Loading Test ==="
    run_test "asset-loading-test"

    log_info "Cooldown (60 seconds)..."
    sleep 60

    log_info "=== Test 4/4: WebSocket Test ==="
    run_test "websocket-test"

    log_info "All tests completed!"
}

show_usage() {
    echo "EventXGames Load Test Runner"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  api          Run API load test"
    echo "  game         Run game session test"
    echo "  asset        Run asset loading test"
    echo "  websocket    Run WebSocket test"
    echo "  all          Run all tests sequentially"
    echo "  help         Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  BASE_URL     API base URL (default: https://api.eventxgames.com)"
    echo "  CDN_URL      CDN URL (default: https://cdn.eventxgames.com)"
    echo "  WS_URL       WebSocket URL (default: wss://ws.eventxgames.com)"
    echo "  AUTH_TOKEN   Authentication token for tests"
    echo "  ENVIRONMENT  Test environment label (default: staging)"
    echo ""
    echo "Examples:"
    echo "  $0 api                              # Run API test with defaults"
    echo "  BASE_URL=http://localhost:8080 $0 api  # Run against local server"
    echo "  $0 all                              # Run full test suite"
}

# Main
check_k6
create_results_dir

case "${1:-help}" in
    api)
        run_test "api-load-test"
        ;;
    game)
        run_test "game-session-test"
        ;;
    asset)
        run_test "asset-loading-test"
        ;;
    websocket)
        run_test "websocket-test"
        ;;
    all)
        run_all_tests
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        log_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
