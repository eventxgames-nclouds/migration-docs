# nClouds AWS Migration Research

**Research Date:** 2026-04-20  
**Researched By:** CTO AI Agent  
**Project:** EventXGames Azure to AWS Migration  

---

## Executive Summary

This document provides comprehensive research on nClouds as our AWS migration partner and the AWS Migration Acceleration Program (MAP) that will guide our Azure to AWS migration.

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
- Migration strategy identification (6 Rs analysis)
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

## 3. Migration Strategy for EventXGames

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

## 4. Important Clarification: Concierto Platform

**Note:** During research, it was identified that **Concierto** is a separate platform by **Trianz**, not nClouds.

### Concierto Overview (Trianz Product)

- **Concierto MIGRATE** - Zero-code, hyper-automated SaaS platform
- **Purpose** - Bulk migrations from VMware/any cloud to AWS
- **Features:**
  - Pre-built automated migration catalogs
  - CloudIgnite (Assess + Mobilize)
  - CloudMach (Bulk Migrate)
  - 50% reduced migration investment
  - 3X faster migrations

### Recommendation

While Concierto is a powerful tool, it is **not affiliated with nClouds**. Our migration will use nClouds native methodology and AWS-native tools:
- AWS Application Discovery Service
- AWS Migration Hub
- AWS Database Migration Service (DMS)
- AWS Application Migration Service

---

## 5. Cost-Benefit Analysis

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

## 6. Next Steps

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

- nClouds Cloud Migration Services: https://www.nclouds.com/services/cloud-migration-services/
- nClouds AWS Consulting Services: https://www.nclouds.com/services/aws-consulting-services/
- nClouds AWS Partner Listing: https://partners.amazonaws.com/partners/001E000000cFlkkIAC/nClouds
- AWS Migration Acceleration Program: https://aws.amazon.com/migration-acceleration-program/
- AWS MAP Guide - Opsio: https://opsiocloud.com/blogs/aws-migration-acceleration-program-map-streamlining-your-journey-to-the-cloud/
- Trek10 AWS MAP Overview: https://www.trek10.com/interests/aws-map-migration-acceleration-program
- Concierto Platform by Trianz: https://www.trianz.com/concierto-platform

---

*Document Version: 1.0*  
*Created: 2026-04-20*  
*Author: CTO AI Agent*
