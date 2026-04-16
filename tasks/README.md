# Paperclip AI Tasks

This folder contains task definitions for the Paperclip AI agent.

## Task Status Legend

| Status | Meaning |
|--------|---------|
| Pending | Not started |
| In Progress | Being worked on |
| Review | Completed, needs review |
| Done | Completed and approved |
| Blocked | Waiting on dependency |

---

## Current Tasks

| ID | Task | Status | Priority | Assigned |
|----|------|--------|----------|----------|
| 001 | [Dev-V26 Subdomains](TASK-001-DEV-SUBDOMAINS.md) | Pending | High | Agent |
| 002 | [API QA Testing](TASK-002-API-QA-TESTING.md) | Pending | High | Agent |

---

## Task Dependencies

```
TASK-001 (Dev Subdomains)
    │
    └──► TASK-002 (API QA Testing)
```

---

## How to Use

### For Paperclip:

1. Open Paperclip: http://localhost:3100
2. Create new task
3. Copy task description from the .md file
4. Set working directory: /root/migration-docs
5. Assign to Claude agent

### For Manual Execution:

1. SSH to VPS: `ssh root@40.90.168.38`
2. Follow steps in task file
3. Update status in this README
4. Commit changes

---

## Completed Tasks

(None yet)

