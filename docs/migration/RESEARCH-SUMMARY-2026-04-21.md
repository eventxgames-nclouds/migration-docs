# nClouds Research Summary Report

**Date:** 2026-04-21  
**Prepared By:** CTO AI Agent  
**Purpose:** Summary of research findings for nClouds services and AWS migration best practices

---

## Executive Summary

This report summarizes key findings from research conducted on nClouds services, the AWS Migration Acceleration Program (MAP), the Concierto platform, and AWS migration best practices for the EventXGames Azure to AWS migration project.

---

## Key Findings

### 1. nClouds Partnership Value

| Metric | Value | Significance |
|--------|-------|--------------|
| AWS Partner Tier | Premier | Highest partner level, access to AWS resources and funding |
| AWS Competencies | 28+ | Comprehensive AWS expertise |
| DevOps Implementations | 250+ | Proven track record |
| Customer NPS | 83 | Excellent customer satisfaction |
| Experience | 10+ years | Deep AWS expertise |

**Recommendation:** nClouds is well-positioned as our MAP partner. Their DevOps-driven approach aligns with our containerized architecture.

### 2. AWS MAP Funding Potential

| Phase | Potential Funding |
|-------|-------------------|
| Assess Phase | Up to $60,000 |
| Mobilize + Migrate | Up to $400,000 |
| Migration Credits | Up to 25% of migrated workloads |
| **Total Potential** | **$125,000 - $205,000** |

**Recommendation:** Engage nClouds immediately to initiate MAP Assess phase and secure funding.

### 3. AWS 7 Rs Framework Update

The migration framework has evolved from 5 Rs to 7 Rs. Key insight: most successful migrations use 3-5 different strategies across their portfolio.

| Strategy | EventXGames Application |
|----------|------------------------|
| Rehost | Initial lift-and-shift of containers |
| Replatform | Database migration (PostgreSQL to Aurora), Redis to ElastiCache |
| Refactor | AI/ML integration with Bedrock |
| Retire | Identify 10-20% of unused services for immediate savings |

### 4. Concierto Platform Clarification

**Key Finding:** Concierto is a Trianz product, NOT affiliated with nClouds.

| Aspect | Detail |
|--------|--------|
| Vendor | Trianz (not nClouds) |
| Best For | VMware migrations, hybrid cloud management |
| AWS Marketplace | Available as SaaS solution |
| Relevance to EventXGames | Low priority - we are not VMware-based |

**Recommendation:** Not needed for initial migration. Consider for post-migration Day-2 ops only if hybrid cloud requirements emerge.

### 5. 2026 Migration Landscape Insights

| Trend | Impact |
|-------|--------|
| AI-Driven Discovery | AWS Migration Hub uses predictive analytics (99% accuracy in dependency mapping) |
| Cost Challenges | 84% of orgs cite cloud spend as top challenge; budgets exceed limits by 17% |
| Migration Risks | 70% of projects see partial/full reversals within 2 years |
| Energy Efficiency | AWS infrastructure is 4.1X more efficient than on-premises |
| Cost Savings Potential | Up to 66% reduction in compute/storage costs |

---

## Actionable Recommendations

### Immediate (This Week)

1. **Schedule nClouds kickoff meeting** - Initiate MAP Assess phase
2. **Prepare application inventory** - For nClouds discovery team
3. **Compile Azure cost data** - Last 6 months for TCO analysis
4. **Grant nClouds read access** - To Azure resources for assessment

### Short-Term (Weeks 1-4)

1. **Complete MAP Assess phase** - With nClouds guidance
2. **Apply 7 Rs strategy** - Map each workload to appropriate strategy
3. **Identify retirement candidates** - 10-20% of services for immediate savings
4. **Set up AWS Landing Zone** - As part of Mobilize phase

### Medium-Term (Weeks 5-12)

1. **Execute wave-based migration** - Per nClouds runbooks
2. **Implement Bedrock integration** - For AI capabilities
3. **Deploy DR region** - Multi-region failover setup
4. **Complete knowledge transfer** - From nClouds to internal team

---

## Documents Updated

| Document | Changes Made |
|----------|--------------|
| `NCLOUDS-AWS-MAP-RESEARCH.md` | Added 2026 trends, 7 Rs framework section, expanded Concierto details, updated sources |

---

## Sources Referenced

- nClouds official website and AWS partner listing
- AWS Migration Acceleration Program documentation
- AWS Prescriptive Guidance - Migration Strategies
- Concierto.cloud platform documentation
- Kellton AWS Cloud Migration Guide 2026
- AWS Tutorials Dojo 7 Rs framework guide

---

*Report Version: 1.0*  
*Generated: 2026-04-21*  
*Author: CTO AI Agent*
