# AWS DMS Migration Guide for Aurora PostgreSQL

**Created:** 2026-04-20  
**Author:** CTO AI Agent  
**Project:** EventXGames Azure to AWS Migration  

---

## Executive Summary

This guide provides detailed best practices for migrating PostgreSQL databases to Amazon Aurora PostgreSQL using AWS Database Migration Service (DMS). It covers configuration requirements, common pitfalls, and optimization strategies.

---

## 1. Migration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AWS DMS Migration Architecture                        │
│                                                                              │
│  ┌──────────────┐     ┌───────────────────────┐     ┌──────────────────┐   │
│  │    Source    │     │    DMS Replication    │     │     Target       │   │
│  │  PostgreSQL  │────▶│       Instance        │────▶│     Aurora       │   │
│  │   (Azure)    │     │                       │     │   PostgreSQL     │   │
│  └──────────────┘     └───────────────────────┘     └──────────────────┘   │
│         │                       │                           │               │
│         │              ┌────────┴────────┐                  │               │
│         │              │                 │                  │               │
│         ▼              ▼                 ▼                  ▼               │
│  ┌─────────────┐ ┌──────────┐ ┌───────────────┐ ┌───────────────────┐     │
│  │   Logical   │ │   Task   │ │   CloudWatch  │ │    Performance    │     │
│  │ Replication │ │ Logging  │ │    Metrics    │ │     Insights      │     │
│  └─────────────┘ └──────────┘ └───────────────┘ └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pre-Migration Checklist

### 2.1 Source Database Requirements

| Requirement | Setting | Notes |
|-------------|---------|-------|
| `rds.logical_replication` | 1 | Required for CDC |
| `sync_replication_slots` | 1 | Required for CDC |
| `synchronous_commit` | ON | Required for CDC |
| `wal_sender_timeout` | 10000+ ms | Minimum 10 seconds |
| `max_worker_processes` | ≥ sum of replication workers | Monitor performance impact |
| PostgreSQL Version | 10+ | Recommend 14+ for best performance |

### 2.2 DMS User Permissions

```sql
-- Create DMS user
CREATE USER dms_user WITH PASSWORD 'secure_password';

-- Grant required permissions
GRANT CONNECT ON DATABASE eventxgames TO dms_user;
GRANT USAGE ON SCHEMA public TO dms_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO dms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO dms_user;

-- For CDC (Change Data Capture)
GRANT rds_replication TO dms_user;
```

### 2.3 Network Requirements

- [ ] VPC Peering or Transit Gateway between source and DMS VPC
- [ ] Security groups allow PostgreSQL port (5432) from DMS
- [ ] DNS resolution working for source database endpoint
- [ ] Sufficient bandwidth for initial full load

---

## 3. DMS Instance Configuration

### 3.1 Replication Instance Sizing

| Migration Size | Instance Class | Storage | Notes |
|----------------|---------------|---------|-------|
| < 100 GB | dms.t3.medium | 50 GB | Development/testing |
| 100-500 GB | dms.r5.large | 100 GB | Small production |
| 500 GB - 2 TB | dms.r5.xlarge | 200 GB | Medium production |
| > 2 TB | dms.r5.2xlarge+ | 500 GB | Large production |

### 3.2 Terraform Configuration

```hcl
resource "aws_dms_replication_instance" "eventxgames" {
  replication_instance_id     = "eventxgames-dms"
  replication_instance_class  = "dms.r5.xlarge"
  allocated_storage          = 200
  
  # High Availability
  multi_az                   = true
  
  # Networking
  replication_subnet_group_id = aws_dms_replication_subnet_group.main.id
  vpc_security_group_ids     = [aws_security_group.dms.id]
  
  # Maintenance
  apply_immediately          = true
  auto_minor_version_upgrade = true
  preferred_maintenance_window = "sun:03:00-sun:04:00"
  
  # Engine version
  engine_version             = "3.5.2"
  
  # Public access (disable for production)
  publicly_accessible        = false
  
  tags = {
    Name        = "eventxgames-dms-instance"
    Environment = "production"
  }
}
```

---

## 4. Source and Target Endpoints

### 4.1 Source Endpoint (PostgreSQL)

```hcl
resource "aws_dms_endpoint" "source" {
  endpoint_id   = "eventxgames-source"
  endpoint_type = "source"
  engine_name   = "postgres"
  
  server_name   = var.source_db_host
  port          = 5432
  database_name = "eventxgames"
  username      = "dms_user"
  password      = var.dms_password
  
  # SSL Configuration
  ssl_mode      = "verify-full"
  
  # Extra connection attributes for CDC
  extra_connection_attributes = join(";", [
    "PluginName=test_decoding",
    "SlotName=dms_replication_slot",
    "HeartbeatEnable=true",
    "HeartbeatFrequency=5"
  ])
  
  tags = {
    Name = "eventxgames-source-endpoint"
  }
}
```

### 4.2 Target Endpoint (Aurora PostgreSQL)

```hcl
resource "aws_dms_endpoint" "target" {
  endpoint_id   = "eventxgames-target"
  endpoint_type = "target"
  engine_name   = "aurora-postgresql"
  
  server_name   = aws_rds_cluster.eventxgames.endpoint
  port          = 5432
  database_name = "eventxgames"
  username      = "dms_admin"
  password      = var.aurora_dms_password
  
  # SSL Configuration
  ssl_mode      = "verify-full"
  
  # Extra connection attributes for performance
  extra_connection_attributes = join(";", [
    "maxFileSize=1048576",
    "executeTimeout=60",
    "parallelLoadThreads=4"
  ])
  
  tags = {
    Name = "eventxgames-target-endpoint"
  }
}
```

---

## 5. Replication Task Configuration

### 5.1 Full Load + CDC Task

```hcl
resource "aws_dms_replication_task" "migration" {
  replication_task_id       = "eventxgames-migration"
  replication_instance_arn  = aws_dms_replication_instance.eventxgames.replication_instance_arn
  source_endpoint_arn       = aws_dms_endpoint.source.endpoint_arn
  target_endpoint_arn       = aws_dms_endpoint.target.endpoint_arn
  migration_type            = "full-load-and-cdc"
  
  table_mappings = jsonencode({
    rules = [
      {
        rule-type = "selection"
        rule-id   = "1"
        rule-name = "include-all-tables"
        object-locator = {
          schema-name = "public"
          table-name  = "%"
        }
        rule-action = "include"
      },
      {
        rule-type = "transformation"
        rule-id   = "2"
        rule-name = "exclude-audit-tables"
        object-locator = {
          schema-name = "public"
          table-name  = "audit_%"
        }
        rule-action = "exclude"
      }
    ]
  })
  
  replication_task_settings = jsonencode({
    TargetMetadata = {
      SupportLobs         = true
      FullLobMode         = false
      LobChunkSize        = 64
      LimitedSizeLobMode  = true
      LobMaxSize          = 32
    }
    FullLoadSettings = {
      TargetTablePrepMode = "DROP_AND_CREATE"
      MaxFullLoadSubTasks = 8
      TransactionConsistencyTimeout = 600
      CommitRate          = 50000
    }
    Logging = {
      EnableLogging = true
      LogComponents = [
        {
          Id       = "TRANSFORMATION"
          Severity = "LOGGER_SEVERITY_DEFAULT"
        },
        {
          Id       = "SOURCE_UNLOAD"
          Severity = "LOGGER_SEVERITY_DEFAULT"
        },
        {
          Id       = "TARGET_LOAD"
          Severity = "LOGGER_SEVERITY_DEFAULT"
        },
        {
          Id       = "SOURCE_CAPTURE"
          Severity = "LOGGER_SEVERITY_DEFAULT"
        },
        {
          Id       = "TARGET_APPLY"
          Severity = "LOGGER_SEVERITY_DEFAULT"
        }
      ]
    }
    ChangeProcessingTuning = {
      BatchApplyEnabled        = true
      BatchApplyPreserveTransaction = true
      BatchApplyTimeoutMin     = 1
      BatchApplyTimeoutMax     = 30
      BatchApplyMemoryLimit    = 500
      BatchSplitSize           = 0
      MinTransactionSize       = 1000
      CommitTimeout            = 1
      MemoryLimitTotal         = 1024
      MemoryKeepTime           = 60
      StatementCacheSize       = 50
    }
    ErrorBehavior = {
      DataErrorPolicy          = "LOG_ERROR"
      DataTruncationErrorPolicy = "LOG_ERROR"
      DataErrorEscalationPolicy = "SUSPEND_TABLE"
      TableErrorPolicy         = "SUSPEND_TABLE"
      TableErrorEscalationPolicy = "STOP_TASK"
      TableErrorEscalationCount = 5
      RecoverableErrorCount    = 0
      RecoverableErrorInterval = 5
      ApplyErrorDeletePolicy   = "IGNORE_RECORD"
      ApplyErrorInsertPolicy   = "LOG_ERROR"
      ApplyErrorUpdatePolicy   = "LOG_ERROR"
    }
  })
  
  tags = {
    Name = "eventxgames-migration-task"
  }
}
```

---

## 6. Common Issues and Solutions

### 6.1 ODBC General Error

**Symptom:** Task fails with "ODBC general error"

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing replication privileges | Grant `rds_replication` to DMS user |
| Undersized replication instance | Upgrade to larger instance class |
| Logical replication not enabled | Set `rds.logical_replication = 1` |
| Network timeout | Increase `wal_sender_timeout` |

### 6.2 Replication Slot Issues

**Symptom:** WAL logs accumulating, disk filling up

**Solution:**
```sql
-- Check replication slots
SELECT * FROM pg_replication_slots;

-- Drop orphaned slots if needed
SELECT pg_drop_replication_slot('dms_replication_slot');
```

### 6.3 Foreign Key Constraint Failures

**Symptom:** Full load fails due to FK constraints

**Solution:**
```sql
-- Disable triggers during full load
ALTER TABLE table_name DISABLE TRIGGER ALL;

-- Re-enable after migration
ALTER TABLE table_name ENABLE TRIGGER ALL;
```

Or use task setting:
```json
{
  "TargetMetadata": {
    "SupportLobs": true
  },
  "FullLoadSettings": {
    "CreatePkAfterFullLoad": true
  }
}
```

### 6.4 Sequence Synchronization

**Important:** DMS does not migrate sequences. After cutover:

```sql
-- Get current max values from migrated data
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('games_id_seq', (SELECT MAX(id) FROM games));
SELECT setval('sessions_id_seq', (SELECT MAX(id) FROM sessions));

-- Or generate script for all sequences
SELECT 'SELECT setval(''' || sequence_name || ''', (SELECT COALESCE(MAX(' || 
       column_name || '), 1) FROM ' || table_name || '));'
FROM information_schema.columns 
WHERE column_default LIKE 'nextval%';
```

---

## 7. Monitoring and Validation

### 7.1 CloudWatch Metrics to Monitor

| Metric | Threshold | Action |
|--------|-----------|--------|
| `CDCLatencySource` | > 60 seconds | Check source load |
| `CDCLatencyTarget` | > 60 seconds | Scale up target |
| `FullLoadThroughputRowsSource` | Dropping | Check network |
| `FullLoadThroughputRowsTarget` | Dropping | Scale up target/DMS |
| `FreeableMemory` | < 20% | Scale up DMS instance |
| `FreeStorageSpace` | < 20% | Increase DMS storage |

### 7.2 Validation Query

```sql
-- Compare row counts
SELECT 
    schemaname || '.' || tablename as table_name,
    n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Compare checksums for critical tables
SELECT 
    md5(string_agg(t.*::text, '')) as checksum
FROM (SELECT * FROM users ORDER BY id) t;
```

### 7.3 CloudWatch Alarms

```hcl
resource "aws_cloudwatch_metric_alarm" "dms_latency" {
  alarm_name          = "eventxgames-dms-cdc-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CDCLatencyTarget"
  namespace           = "AWS/DMS"
  period              = 60
  statistic           = "Average"
  threshold           = 120
  alarm_description   = "DMS CDC latency exceeds 2 minutes"
  
  dimensions = {
    ReplicationInstanceIdentifier = aws_dms_replication_instance.eventxgames.replication_instance_id
    ReplicationTaskIdentifier     = aws_dms_replication_task.migration.replication_task_id
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}
```

---

## 8. Cutover Procedure

### 8.1 Pre-Cutover Checklist

- [ ] CDC latency < 10 seconds consistently
- [ ] All validation queries pass
- [ ] Application tested against Aurora (read-only)
- [ ] Runback procedure documented and tested
- [ ] Maintenance window scheduled
- [ ] All stakeholders notified

### 8.2 Cutover Steps

1. **Stop application writes to source** (T+0)
   ```bash
   # Scale down write pods
   kubectl scale deployment api-worker --replicas=0
   ```

2. **Wait for CDC to drain** (T+1-5 min)
   ```sql
   -- Verify no pending changes
   SELECT * FROM pg_replication_slots WHERE active = true;
   ```

3. **Stop DMS task** (T+5 min)
   ```bash
   aws dms stop-replication-task \
     --replication-task-arn $TASK_ARN
   ```

4. **Final validation** (T+5-10 min)
   - Row counts match
   - Checksums match
   - Sequences updated

5. **Update sequences** (T+10 min)
   ```sql
   -- Run sequence sync script
   ```

6. **Switch application to Aurora** (T+15 min)
   ```bash
   kubectl set env deployment/api-worker DATABASE_URL=$AURORA_URL
   kubectl scale deployment api-worker --replicas=3
   ```

7. **Verify application health** (T+15-30 min)
   - Health checks passing
   - No error spikes
   - Latency acceptable

### 8.3 Rollback Procedure

If issues detected within 4 hours:

1. Stop application writes to Aurora
2. Resume DMS task in reverse direction (Aurora → Source)
3. Wait for sync
4. Switch application back to source
5. Post-mortem and retry

---

## 9. Cost Estimate

| Component | Specification | Monthly Cost |
|-----------|--------------|--------------|
| DMS Instance | dms.r5.xlarge, Multi-AZ | ~$650 |
| DMS Storage | 200 GB | ~$40 |
| Data Transfer | 500 GB during migration | ~$45 |
| CloudWatch Logs | Task logging | ~$10 |
| **Total Migration** | | **~$745/month** |

*Note: DMS costs are temporary during migration period.*

---

## 10. References

- [AWS DMS PostgreSQL Source Documentation](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html)
- [Migrating to Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html)
- [AWS DMS Best Practices](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html)
- [Cross-Account Aurora PostgreSQL Migration](https://aws.amazon.com/blogs/database/cross-account-amazon-aurora-postgresql-and-amazon-rds-for-postgresql-migration-with-reduced-downtime-using-aws-dms/)

---

*Document Version: 1.0*  
*Created: 2026-04-20*  
*Author: CTO AI Agent*
