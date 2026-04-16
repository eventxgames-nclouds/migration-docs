# EventXGames Migration - Master TODO List

**Project:** Azure to AWS Migration  
**Last Updated:** 2026-04-16  
**Status:** In Progress  

---

## Quick Links

| Document | Purpose | Link |
|----------|---------|------|
| CEO Hiring Guide | Specialist recommendations | [View](docs/migration/HIRING-RECOMMENDATIONS-CEO.md) |
| CTO GitHub Guide | Organization management | [View](GITHUB-MANAGEMENT-GUIDE.md) |
| Safe Subdomain Setup | Dev environment setup | [View](docs/infrastructure/SAFE-DEV-SUBDOMAIN-SETUP.md) |
| Task 001 | Dev subdomains | [View](tasks/TASK-001-DEV-SUBDOMAINS.md) |
| Task 002 | QA testing | [View](tasks/TASK-002-API-QA-TESTING.md) |

---

## Priority 1: CEO Actions (This Week)

### Hiring Specialists

| # | Action | Status | Document |
|---|--------|--------|----------|
| 1.1 | Review hiring recommendations | Pending | [HIRING-RECOMMENDATIONS-CEO.md](docs/migration/HIRING-RECOMMENDATIONS-CEO.md) |
| 1.2 | Approve hiring budget ($500-700K/year) | Pending | - |
| 1.3 | Decide: Full-time vs Contract | Pending | - |
| 1.4 | Post AWS Solutions Architect position | Pending | - |
| 1.5 | Post DevOps Engineer position | Pending | - |

**Recommended Hires (Priority Order):**

| Role | Priority | Timeline | Cost |
|------|----------|----------|------|
| AWS Solutions Architect | CRITICAL | Now | $150-200K/yr |
| DevOps Engineer | CRITICAL | Now | $130-170K/yr |
| AI/ML Engineer | HIGH | Week 4 | $140-180K/yr |
| QA Engineer | HIGH | Week 4 | $100-140K/yr |
| Security Engineer | MEDIUM | Week 8 | Contract |

---

## Priority 2: CTO Actions (This Week)

### GitHub Organization Management

| # | Action | Status | Document |
|---|--------|--------|----------|
| 2.1 | Review GitHub management guide | Pending | [GITHUB-MANAGEMENT-GUIDE.md](GITHUB-MANAGEMENT-GUIDE.md) |
| 2.2 | Create `nclouds-reviewers` team | Pending | GitHub Settings |
| 2.3 | Invite nClouds team members | Pending | - |
| 2.4 | Set branch protection on `main` | Pending | - |

### Azure DNS Setup (For Dev Subdomains)

| # | Action | Status | Document |
|---|--------|--------|----------|
| 2.5 | Login to Azure Portal | Pending | portal.azure.com |
| 2.6 | Go to DNS zones > eventxgames.com | Pending | - |
| 2.7 | Add A record: dev-app-v26 -> 40.90.168.38 | Pending | - |
| 2.8 | Add A record: dev-api-v26 -> 40.90.168.38 | Pending | - |
| 2.9 | Add A record: dev-ws-v26 -> 40.90.168.38 | Pending | - |
| 2.10 | Verify DNS propagation | Pending | nslookup test |

---

## Priority 3: Engineering Actions (After DNS Ready)

### Dev Environment Setup

| # | Action | Status | Document | Risk |
|---|--------|--------|----------|------|
| 3.1 | Create VPS backups | Pending | [Safe Setup Guide](docs/infrastructure/SAFE-DEV-SUBDOMAIN-SETUP.md) | None |
| 3.2 | Update Caddyfile | Pending | Task 001 | Low |
| 3.3 | Update CORS settings | Pending | Task 001 | Low |
| 3.4 | Restart Caddy | Pending | Task 001 | Low |
| 3.5 | Restart Backend | Pending | Task 001 | Low |
| 3.6 | Verify all domains work | Pending | Task 001 | None |

### QA Testing

| # | Action | Status | Document |
|---|--------|--------|----------|
| 3.7 | Test staging domains (no regression) | Pending | Task 002 |
| 3.8 | Test dev-app-v26 subdomain | Pending | Task 002 |
| 3.9 | Test dev-api-v26 health endpoint | Pending | Task 002 |
| 3.10 | Test all 60+ API endpoints | Pending | Task 002 |
| 3.11 | Create QA report | Pending | Task 002 |

---

## Rollback Procedures (If Issues Occur)

### Quick Rollback Commands

```bash
# SSH to VPS
ssh root@40.90.168.38
cd /root/src

# Restore backups
cp Caddyfile.backup.TIMESTAMP Caddyfile
cp .env.backup.TIMESTAMP .env

# Restart
docker compose restart caddy backend

# Verify
curl -I https://staging.eventxgames.com
```

### Rollback Timeline

| Issue | Recovery Time | Command |
|-------|---------------|---------|
| Staging broken | < 2 minutes | Restore Caddyfile backup |
| CORS issues | < 1 minute | Restore .env backup |
| SSL cert failure | Auto-retry | Wait 5 minutes |

---

## Communication Templates

### For CEO (Hiring)

```
Subject: AWS Migration - Hiring Recommendations

Hi [CEO Name],

Please review the hiring recommendations for our AWS migration:
https://github.com/eventxgames-nclouds/migration-docs/blob/main/docs/migration/HIRING-RECOMMENDATIONS-CEO.md

Key points:
- Critical: AWS Architect + DevOps (hire now)
- High: AI/ML + QA Engineers (within 4 weeks)
- Budget: $500-700K/year

Action needed: Approve budget and start recruiting.
```

### For CTO (GitHub + DNS)

```
Subject: AWS Migration - GitHub & DNS Setup Required

Hi [CTO Name],

Two things needed from you:

1. GitHub Organization Setup:
   - Review: https://github.com/eventxgames-nclouds/migration-docs/blob/main/GITHUB-MANAGEMENT-GUIDE.md
   - Create nclouds-reviewers team
   - Invite nClouds team

2. Azure DNS Records (for dev environment):
   Add these A records in Azure Portal > DNS zones > eventxgames.com:
   - dev-app-v26 -> 40.90.168.38
   - dev-api-v26 -> 40.90.168.38
   - dev-ws-v26 -> 40.90.168.38

Let me know when done so we can proceed with server configuration.
```

### For Senior (Confirmation)

```
Subject: Dev-V26 Setup - Ready When DNS Complete

Hi [Senior Name],

Setup documents are ready:
- Safe setup guide with rollback procedures
- Task definitions for Paperclip agent
- QA test suite

Waiting for:
- CTO to add DNS records in Azure

Once DNS is ready, I'll:
1. Create backups
2. Update Caddyfile
3. Update CORS
4. Test everything
5. Create QA report

All documentation is in: https://github.com/eventxgames-nclouds/migration-docs
```

---

## Infrastructure Overview

### VPS Access

| Server | IP | Purpose |
|--------|-----|---------|
| Old VPS (Azure) | 40.90.168.38 | EventXGames app + Paperclip |
| New VPS (Azure) | 172.188.98.210 | Migration docs + Research |

### Current Domains

| Domain | Points To | Status |
|--------|-----------|--------|
| staging.eventxgames.com | 40.90.168.38 | Active |
| staging-api.eventxgames.com | 40.90.168.38 | Active |
| app.eventxgames.com | 40.90.168.38 | Production |
| app-api.eventxgames.com | 40.90.168.38 | Production |

### New Domains (After DNS Setup)

| Domain | Points To | Status |
|--------|-----------|--------|
| dev-app-v26.eventxgames.com | 40.90.168.38 | Pending DNS |
| dev-api-v26.eventxgames.com | 40.90.168.38 | Pending DNS |
| dev-ws-v26.eventxgames.com | 40.90.168.38 | Pending DNS |

---

## Timeline

| Week | Focus | Owner |
|------|-------|-------|
| Week 1 (Current) | DNS setup, Dev environment, Hiring started | CTO, CEO |
| Week 2 | QA testing, Documentation, Interviews | Engineering |
| Week 3-4 | AWS account setup, nClouds assessment | Team + nClouds |
| Week 5-8 | Migration execution | Team + nClouds |
| Week 9-12 | AI platform development | Team |

---

## Daily Standup Questions

1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?

---

*Document maintained by: Engineering Team*  
*GitHub: https://github.com/eventxgames-nclouds/migration-docs*
