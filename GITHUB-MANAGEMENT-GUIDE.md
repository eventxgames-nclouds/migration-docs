# GitHub Organization Management Guide

**Organization:** eventxgames-nclouds  
**Purpose:** Azure to AWS Migration Documentation for nClouds Assessment  
**Document Version:** 1.0  
**Date:** 2026-04-16  

---

## Table of Contents

1. [Organization Overview](#1-organization-overview)
2. [Repository Structure](#2-repository-structure)
3. [Folder Naming Conventions](#3-folder-naming-conventions)
4. [Access Management](#4-access-management)
5. [Recommended Repositories](#5-recommended-repositories)
6. [Branch Strategy](#6-branch-strategy)
7. [Documentation Standards](#7-documentation-standards)

---

## 1. Organization Overview

### Purpose

The `eventxgames-nclouds` GitHub organization serves as the central repository for all migration-related documentation, research, and deliverables that will be shared with nClouds during the AWS MAP (Migration Acceleration Program) assessment.

### Key Stakeholders

| Role | Access Level | Responsibility |
|------|--------------|----------------|
| **CTO** | Owner | Organization management, repo creation, access control |
| **Engineering Lead** | Admin | Repository management, code review |
| **Engineers** | Write | Documentation, research, commits |
| **nClouds Team** | Read | Review documentation, provide feedback |

---

## 2. Repository Structure

### Recommended Organization Layout

```
eventxgames-nclouds/
│
├── migration-docs/          # ✅ CREATED - Main documentation repository
│   ├── docs/
│   │   ├── api/             # API endpoint documentation
│   │   ├── architecture/    # System architecture docs
│   │   ├── qa/              # QA test suites and reports
│   │   ├── migration/       # Migration plans and checklists
│   │   └── infrastructure/  # Infrastructure setup docs
│   └── README.md
│
├── terraform-aws/           # 📋 RECOMMENDED - Infrastructure as Code
│   ├── modules/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── README.md
│
├── kubernetes-manifests/    # 📋 RECOMMENDED - K8s configurations
│   ├── base/
│   ├── overlays/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── README.md
│
├── scripts/                 # 📋 RECOMMENDED - Utility scripts
│   ├── migration/
│   ├── testing/
│   └── deployment/
│
└── .github/                 # Organization-level configs
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
```

---

## 3. Folder Naming Conventions

### Repository Names

| Convention | Example | Use Case |
|------------|---------|----------|
| `kebab-case` | `migration-docs` | All repository names |
| Descriptive | `terraform-aws` | Clear purpose indication |
| No abbreviations | `kubernetes-manifests` | Avoid `k8s-man` |

### Folder Names

| Convention | Example | Use Case |
|------------|---------|----------|
| `lowercase` | `docs/`, `api/` | All folder names |
| Singular | `module/` not `modules/` | Unless truly plural |
| No spaces | `qa-reports/` | Use hyphens |

### File Names

| Type | Convention | Example |
|------|------------|---------|
| Documentation | `UPPERCASE-HYPHEN.md` | `API-ENDPOINTS.md` |
| Reports with date | `NAME-YYYY-MM-DD.md` | `QA-REPORT-2026-04-16.md` |
| Config files | `lowercase.ext` | `config.json` |
| Scripts | `kebab-case.sh` | `deploy-staging.sh` |

---

## 4. Access Management

### Team Structure

Create the following teams in GitHub Organization Settings:

| Team Name | Access | Members |
|-----------|--------|---------|
| `@owners` | Admin | CTO |
| `@engineering` | Write | All engineers |
| `@nclouds-reviewers` | Read | nClouds team members |
| `@bots` | Write | CI/CD, automation accounts |

### Adding nClouds Team Members

1. Go to: `https://github.com/orgs/eventxgames-nclouds/teams`
2. Create team: `nclouds-reviewers`
3. Add members via email invitation
4. Grant **Read** access to relevant repositories

### Repository Access Matrix

| Repository | @owners | @engineering | @nclouds-reviewers |
|------------|---------|--------------|-------------------|
| migration-docs | Admin | Write | Read |
| terraform-aws | Admin | Write | Read |
| kubernetes-manifests | Admin | Write | Read |
| scripts | Admin | Write | None |

---

## 5. Recommended Repositories

### Phase 1: Documentation (Current)

| Repository | Purpose | Status |
|------------|---------|--------|
| `migration-docs` | All migration documentation | ✅ Created |

### Phase 2: Infrastructure (Week 2-3)

| Repository | Purpose | Priority |
|------------|---------|----------|
| `terraform-aws` | AWS infrastructure as code | High |
| `kubernetes-manifests` | EKS deployment configs | High |

### Phase 3: Application (Week 4+)

| Repository | Purpose | Priority |
|------------|---------|----------|
| `eventx-api` | Backend API (migrated) | Medium |
| `eventx-web` | Frontend (migrated) | Medium |
| `eventx-workers` | Background workers | Medium |

---

## 6. Branch Strategy

### Main Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready documentation | Protected |
| `develop` | Integration branch | Protected |

### Feature Branches

```
feature/[ticket-id]-short-description
example: feature/DOC-001-api-endpoints
```

### Branch Protection Rules (Recommended)

For `main` branch:
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Allow force pushes (disabled)
- ❌ Allow deletions (disabled)

---

## 7. Documentation Standards

### README Template

Every repository should have a README.md with:

```markdown
# Repository Name

Brief description of the repository purpose.

## Overview

What this repository contains and why it exists.

## Structure

Folder structure explanation.

## Getting Started

How to use this repository.

## Contributing

How to contribute.

## Contact

Team contact information.
```

### Documentation File Template

```markdown
# Document Title

**Created:** YYYY-MM-DD  
**Author:** Name  
**Status:** Draft | In Review | Approved  
**Version:** 1.0  

---

## Overview

Brief overview of the document.

## Content

Main content here.

## References

Links to related documents.

---

*Last updated: YYYY-MM-DD*
```

---

## Quick Actions for CTO

### Immediate Actions

- [ ] Review this document
- [ ] Create `nclouds-reviewers` team
- [ ] Invite nClouds team members
- [ ] Set up branch protection on `main`

### Week 1 Actions

- [ ] Create `terraform-aws` repository
- [ ] Create `kubernetes-manifests` repository
- [ ] Set up repository access matrix

### Ongoing

- [ ] Review pull requests
- [ ] Monitor repository activity
- [ ] Manage team access

---

## Support

For questions about this guide or the migration project:

- **Engineering Team**: Via Slack/Teams
- **Paperclip AI Dashboard**: http://localhost:3100 (via SSH tunnel)
- **VPS Access**: ssh root@172.188.98.210

---

*Document created by EventXGames Engineering Team*  
*For: CTO and Organization Management*
