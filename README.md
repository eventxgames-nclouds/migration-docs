# EventXGames - Azure to AWS Migration Documentation

This repository contains technical documentation for the EventXGames migration from Azure to AWS, shared with nClouds for the MAP Assessment collaboration.

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Current State** | Azure VPS with Docker containers |
| **Target State** | AWS (EKS, Aurora, Bedrock) |
| **Timeline** | 12 weeks |
| **Partner** | nClouds (AWS MAP Assessment) |

## Documentation Index

### Architecture
| File | Description |
|------|-------------|
| [AWS_ARCHITECTURE.md](docs/architecture/AWS_ARCHITECTURE.md) | Target AWS architecture design |

### Security
| File | Description |
|------|-------------|
| [POD-SECURITY-STANDARDS.md](docs/security/POD-SECURITY-STANDARDS.md) | EKS Pod Security Standards (PSS) implementation |
| [NETWORK-POLICY-GUIDE.md](docs/security/NETWORK-POLICY-GUIDE.md) | Kubernetes network policies |
| [COMPLIANCE_CHECKLIST.md](docs/security/COMPLIANCE_CHECKLIST.md) | Security compliance requirements |
| [SECURITY_AUDIT_PLAN.md](docs/security/SECURITY_AUDIT_PLAN.md) | Security audit planning |

### Migration
| File | Description |
|------|-------------|
| [NCLOUDS-AWS-MAP-RESEARCH.md](docs/migration/NCLOUDS-AWS-MAP-RESEARCH.md) | nClouds MAP assessment research |
| [HIRING-RECOMMENDATIONS-CEO.md](docs/migration/HIRING-RECOMMENDATIONS-CEO.md) | Specialist hiring recommendations |

### Infrastructure
| File | Description |
|------|-------------|
| [DEV-V26-SETUP-STATUS.md](docs/infrastructure/DEV-V26-SETUP-STATUS.md) | Development environment setup status |
| [SAFE-DEV-SUBDOMAIN-SETUP.md](docs/infrastructure/SAFE-DEV-SUBDOMAIN-SETUP.md) | Safe subdomain configuration guide |

### QA & Testing
| File | Description |
|------|-------------|
| [QA-REPORT-STAGING-2026-04-16.md](docs/qa/QA-REPORT-STAGING-2026-04-16.md) | Staging environment QA report |

### Load Testing
| File | Description |
|------|-------------|
| [CAPACITY-PLANNING.md](load-testing/CAPACITY-PLANNING.md) | Infrastructure capacity planning |
| [BASELINE-METRICS.md](load-testing/BASELINE-METRICS.md) | Performance baseline metrics |

### Project Management
| File | Description |
|------|-------------|
| [MASTER-TODO-LIST.md](MASTER-TODO-LIST.md) | Master task tracking |
| [GITHUB-MANAGEMENT-GUIDE.md](GITHUB-MANAGEMENT-GUIDE.md) | GitHub repository management |

## Repository Structure

```
migration-docs/
├── docs/
│   ├── architecture/     # System architecture documentation
│   ├── infrastructure/   # Infrastructure setup guides
│   ├── migration/        # Migration plans and research
│   ├── qa/               # QA test reports
│   └── security/         # Security policies and compliance
├── load-testing/         # Load testing documentation
├── tasks/                # Task tracking documents
└── README.md
```

## Access

This repository is shared between EventXGames Engineering and nClouds for the AWS migration collaboration.

---
*Last updated: 2026-04-21*
