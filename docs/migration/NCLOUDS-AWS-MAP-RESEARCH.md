# nClouds AWS Migration Research

**Research Date:** 2026-04-21 (Updated)  
**Originally Researched:** 2026-04-20  
**Researched By:** CTO AI Agent  
**Project:** EventXGames Azure to AWS Migration  

---

## Executive Summary

This document provides comprehensive research on nClouds as our AWS migration partner and the AWS Migration Acceleration Program (MAP) that will guide our Azure to AWS migration.

### 2026 Migration Landscape Update

The decision to migrate to AWS cloud in 2026 is a definitive business evolution, not just a technical upgrade. Key 2026 trends:

- **AI-Driven Discovery**: Tools like AWS Migration Hub now use predictive analytics to map complex application dependencies with up to 99% accuracy, reducing traditional discovery phases by months
- **Market Scale**: The global cloud market is projected to surpass $1.1 trillion in 2026
- **Challenges**: 84% of organizations cite managing cloud spend as their top challenge; cloud budgets are exceeding limits by 17%; over a quarter of migrations run slower than planned; nearly 70% of projects see partial or full reversals within two years
- **Opportunity**: AWS infrastructure has proven to be up to 4.1 times more energy efficient than typical on-premises setups, with well-executed migrations reducing compute and storage costs by up to 66%

---

## 1. nClouds Company Overview

### Partner Profile

| Attribute | Details |
|-----------|---------|
| **Company** | nClouds |
| **Founded** | 2012 |
| **Headquarters** | San Francisco, California |
| **Employees** | ~106 |
| **AWS Partner Status** | Premier Tier Services Partner (since 2018) |
| **Customer NPS** | 83 (Excellent) |
| **Case Studies** | 60+ public AWS customer case studies |

### AWS Certifications & Competencies

nClouds has achieved **28 AWS competencies, programs, tiers, and delivery designations**, including:

- AWS Premier Tier Services Partner
- AWS Migration Competency
- AWS DevOps Competency
- Audited AWS Managed Service Partner
- AWS Well-Architected Partner
- AWS Service Catalog Partner
- AWS CloudFormation Partner

### Track Record

| Metric | Value |
|--------|-------|
| DevOps AWS Implementations | 250+ |
| Pipelines Deployed | 500+ |
| Servers Managed | 10,000+ |

### Core Service Areas

1. **Cloud Migration** - Rehosting, replatforming, and refactoring
2. **Modern Cloud Operations** - Managed services and optimization
3. **DevOps** - CI/CD pipelines, automation, infrastructure as code
4. **Site Reliability Engineering (SRE)** - Observability and reliability
5. **Data & Analytics** - Data platforms and insights
6. **24/7 Support** - Round-the-clock monitoring and incident response
7. **Staff Augmentation** - Embedded cloud engineers

### Why nClouds for EventXGames

1. **DevOps-Driven Approach** - Strong automation focus aligns with our containerized architecture
2. **Migration Competency** - Proven experience with complex migrations
3. **AWS Premier Status** - Access to AWS resources and funding
4. **Microservices Expertise** - Experience with cloud-native transformations
5. **High Customer Satisfaction** - 83 NPS indicates reliable delivery

---

## 2. AWS Migration Acceleration Program (MAP)

### Program Overview

MAP is a comprehensive, proven cloud migration framework that combines:
- Financial incentives (AWS credits and funding)
- Prescriptive methodology
- Native AWS tools
- Certified partner expertise

### MAP Eligibility Requirements

| Requirement | Details |
|-------------|---------|
| Minimum AWS Spend | USD 100K+ ARR post-migration |
| Workload Source | On-premises or another cloud (Azure qualifies) |
| Partner Requirement | AWS Partner with MAP authorization (nClouds qualifies) |

### Three-Phase Framework

#### Phase 1: Assess (2-4 weeks)

**Objective:** Migration readiness assessment

**Activities:**
- Gap analysis across AWS Cloud Adoption Framework dimensions:
  - Business
  - Process
  - People
  - Platform
  - Operations
  - Security
- Total Cost of Ownership (TCO) model development
- Migration strategy identification (7 Rs analysis - see Section 3)
- Application portfolio discovery

**Funding:** Up to USD 60,000 (for Premier Partners like nClouds)

**Deliverables:**
- Migration Readiness Assessment (MRA) report
- TCO analysis comparing Azure vs AWS
- Recommended migration strategy per workload
- Prioritized migration wave plan

#### Phase 2: Mobilize (4-8 weeks)

**Objective:** Build operational foundation

**Activities:**
- AWS Landing Zone setup (Control Tower)
- Multi-account governance structure
- Network connectivity (Direct Connect, VPN, Transit Gateway)
- Security baselines and IAM policies
- Compliance guardrails
- Pilot migrations to validate approach
- Team training and enablement

**Funding:** Part of combined Mobilize and Migration funding (up to USD 400K)

**Deliverables:**
- AWS Landing Zone deployed
- Security and compliance baseline
- Network architecture implemented
- Pilot migration completed
- Migration runbooks created

#### Phase 3: Migrate and Modernize (Variable)

**Objective:** Execute large-scale migration

**Activities:**
- Wave-based migration execution
- Database migrations (Azure SQL to Aurora)
- Application refactoring where needed
- Performance optimization
- Knowledge transfer
- Post-migration validation

**Funding:** Up to 25% AWS credits on migrated workloads

**Deliverables:**
- All workloads migrated to AWS
- Performance benchmarks met
- Documentation completed
- Team fully enabled

### MAP 2.0 Requirements (Since Nov 2022)

- **Workload Tagging** - Required for credit allocation
- **Structured Funding Model** - More defined milestone requirements
- **Partner Engagement** - Must work through authorized MAP partner

### Typical Timeline

| Phase | Duration | EventXGames Target |
|-------|----------|-------------------|
| Assess | 2-4 weeks | Weeks 1-2 |
| Mobilize | 4-8 weeks | Weeks 3-4 |
| Migrate | Variable (depends on waves) | Weeks 5-10 |
| **Total** | 6-18 months | **12 weeks** |

---

## 3. AWS 7 Rs Migration Framework (2026 Update)

AWS's 7 Rs framework evolved from Gartner's original 5 Rs model, expanded first to 6 Rs (adding Retire), then to 7 Rs (introducing Relocate). Most successful migrations use 3-5 different strategies across their portfolio.

### The Seven Strategies

| Strategy | Description | Effort | Benefit | Best For |
|----------|-------------|--------|---------|----------|
| **Rehost** (Lift and Shift) | Move applications to AWS without changes | Low | 30-50% cost reduction | Large-scale legacy migrations, quick wins |
| **Replatform** | Make cloud optimizations without changing core architecture | Medium | 40-60% of full modernization benefits | Databases, middleware |
| **Refactor** | Re-architect using cloud-native features | High (6-12 months/app) | Maximum transformation | Workloads with strong business justification |
| **Relocate** | Move workloads using VMware Cloud on AWS | Low | Minimal changes required | VMware-heavy environments |
| **Repurchase** | Move to a different product (typically SaaS) | Medium | Reduced operational overhead | Legacy software replaceable by SaaS |
| **Retain** | Keep in source environment for now | None | Flexibility | Apps not ready to migrate |
| **Retire** | Decommission or archive | Low | 10-20% instant savings | Unused workloads |

### Strategy Selection Guidelines

- **Rehost first** for speed and quick cost savings
- **Replatform** for best balance of effort vs. benefit
- **Refactor** only for high-value workloads with clear ROI
- **Retire 10-20%** of applications upfront to unlock instant savings

---

## 4. Migration Strategy for EventXGames

### Recommended Approach

Based on our current Azure architecture and target AWS state:

| Component | Current (Azure) | Target (AWS) | Strategy |
|-----------|-----------------|--------------|----------|
| Compute | Azure VPS + Docker | EKS | Replatform |
| Database | PostgreSQL (Docker) | Aurora PostgreSQL | Replatform |
| Cache | Redis (Docker) | ElastiCache | Replatform |
| CDN | Cloudflare | CloudFront | Replatform |
| AI/ML | External APIs | Amazon Bedrock | Refactor |

### Migration Waves

**Wave 1: Foundation** (Week 1-2)
- Landing Zone setup
- Network architecture
- Security baselines

**Wave 2: Data Layer** (Week 3-4)
- Aurora PostgreSQL migration
- ElastiCache Redis setup
- S3 for assets

**Wave 3: Application** (Week 5-6)
- EKS cluster deployment
- Container migrations
- Load balancer setup

**Wave 4: Integration** (Week 7-8)
- CloudFront CDN
- Bedrock AI integration
- DR region setup

**Wave 5: Cutover** (Week 9-10)
- DNS migration
- Final validation
- Performance tuning

---

## 5. Important Clarification: Concierto Platform

**Note:** Concierto is a separate platform by **Trianz**, not nClouds. It is, however, available in the AWS Marketplace and can complement migration efforts.

### Concierto Platform Overview (Trianz Product)

| Feature | Description |
|---------|-------------|
| **Type** | Zero-code, AI-powered SaaS platform for cloud migration, modernization, and management |
| **Multi-Cloud Support** | AWS, Azure, GCP, and On-Premises/Private Cloud |
| **Certifications** | ISO 27001, CSA Star certified, ITIL-based |
| **Deployment Time** | 4 weeks for Concierto MANAGE |

### Key Capabilities

**Migration & Modernization:**
- Pre-built automated migration catalogs with 1000+ automations
- CloudIgnite (Assess + Mobilize) and CloudMach (Bulk Migrate)
- Claims up to 3X faster migrations through AI-powered automation
- 50% reduced migration investment

**Day-2 Operations (Concierto MANAGE):**
- Single-pane-of-glass view across multi-cloud environments
- IT Service Management (ITSM) and IT Operations Management (ITOM)
- Observability, event management, patching, compliance checks
- ITIL-compliant catalog, incident, and change management
- Over 600 automated processes

**FinOps & Analytics:**
- Real-time FinOps insights and automated cost forecasting
- Up to 30% reduction in steady-state costs reported by clients
- 40% higher operational productivity with self-service capabilities

### AWS Marketplace Availability

Concierto MANAGE is available in the AWS Marketplace as "Concierto MANAGE SaaS Solution: Base and Advanced Hybrid Cloud Ops."

### Recommendation

While Concierto is a powerful tool for hybrid cloud management and VMware migrations, it is **not affiliated with nClouds**. Our primary migration will use nClouds native methodology and AWS-native tools:
- AWS Application Discovery Service
- AWS Migration Hub
- AWS Database Migration Service (DMS)
- AWS Application Migration Service

**Potential Future Use:** Concierto MANAGE could be evaluated for post-migration Day-2 operations if hybrid cloud management becomes a requirement.

---

## 6. Cost-Benefit Analysis

### MAP Funding Potential

| Funding Type | Amount | Notes |
|--------------|--------|-------|
| Assess Phase | Up to USD 60K | Direct funding |
| Mobilize + Migrate | Up to USD 400K | Cash funding |
| Migration Credits | Up to 25% | Credits on migrated workloads |

### Estimated Total Benefit

Assuming USD 15K/month AWS spend post-migration (USD 180K ARR):

| Benefit | Estimated Value |
|---------|-----------------|
| Assess Funding | USD 30-60K |
| Mobilize Funding | USD 50-100K |
| Migration Credits (25% for 12 mo) | USD 45K |
| **Total Potential** | **USD 125-205K** |

---

## 7. Next Steps

### Immediate Actions

1. **Schedule nClouds Kickoff** - Initiate Assess phase
2. **Application Discovery** - Prepare inventory for nClouds team
3. **Access Provisioning** - Grant nClouds read access to Azure resources
4. **TCO Data Gathering** - Compile current Azure costs

### Required Information for nClouds

- [ ] Current Azure monthly spend (last 6 months)
- [ ] Application architecture diagrams
- [ ] Database sizes and growth projections
- [ ] Traffic patterns and peak loads
- [ ] Compliance requirements
- [ ] Business continuity requirements

---

## Sources

### nClouds & AWS MAP
- nClouds Cloud Migration Services: https://www.nclouds.com/services/cloud-migration-services/
- nClouds nSights Intro to AWS MAP: https://www.nclouds.com/nsights/intro-to-aws-map/
- nClouds AWS Partner Listing: https://partners.amazonaws.com/partners/001E000000cFlkkIAC/nClouds
- AWS Migration Acceleration Program: https://aws.amazon.com/migration-acceleration-program/
- AWS MAP Guide - Opsio: https://opsiocloud.com/blogs/aws-migration-acceleration-program-map-streamlining-your-journey-to-the-cloud/

### AWS 7 Rs Framework
- AWS Prescriptive Guidance - Migration Strategies: https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html
- AWS Migration Strategies 7 Rs - Tutorials Dojo: https://tutorialsdojo.com/aws-migration-strategies-the-7-rs/
- AWS Cloud Migration Guide 2026 - Kellton: https://www.kellton.com/kellton-tech-blog/aws-cloud-migration-guide
- AWS Cloud Migration Strategy Explained: https://aws.amazon.com/what-is/cloud-migration-strategy/

### Concierto Platform
- Concierto Platform: https://www.concierto.cloud/
- Concierto MANAGE: https://www.concierto.cloud/manage
- Concierto Platform by Trianz: https://www.trianz.com/concierto-platform
- AWS Marketplace - Concierto MANAGE: https://aws.amazon.com/marketplace/pp/prodview-zdd7mfz72q6bs

---

*Document Version: 2.0*  
*Created: 2026-04-20*  
*Updated: 2026-04-21*  
*Author: CTO AI Agent*
