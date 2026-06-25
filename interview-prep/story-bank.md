# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Architecture Ownership] GFT: Owning the Blueprint
**Source:** Report #009 — GM Financial — Sr. Technical Principal Architect, Salesforce
**S (Situation):** At GFT Group, I joined a multi-squad Salesforce program where no architecture standards existed — every team was making independent decisions on data modeling, security, and integrations.
**T (Task):** As Salesforce Architect, I needed to define and enforce architecture standards across Sales Cloud, Service Cloud, and integration layers for the entire program.
**A (Action):** Created data model standards, a security strategy using Permission Sets and sharing rules, and an integration pattern playbook; led code reviews across all squads to enforce consistency.
**R (Result):** Zero critical architecture defects at go-live; all squads aligned to a single integration pattern, reducing integration rework significantly in later sprints.
**Reflection:** Earlier involvement of business stakeholders would have reduced rework in the data model — I would now run a data modeling workshop before any squad starts building.
**Best for questions about:** architecture leadership, standards definition, multi-team influence, technical governance

### [Financial Integration] C6 Bank: Banking Integration at Scale
**Source:** Report #009 — GM Financial — Sr. Technical Principal Architect, Salesforce
**S (Situation):** C6 Bank needed Salesforce FSC to communicate with core banking systems in real time so customer service agents could see complete financial data without leaving Salesforce.
**T (Task):** Design and build sync and async REST integrations for mission-critical financial data: accounts, transactions, credit limits.
**A (Action):** Designed REST APIs (sync for real-time lookups, async for batch updates), Omni Integration Procedures for orchestration, and Omni Data Mappers for transformation — all following Salesforce FSC patterns.
**R (Result):** Unified customer service experience — agents saw the complete financial picture without leaving Salesforce. Zero production integration failures in the first 6 months post-launch.
**Reflection:** Better monitoring (event-driven logs) earlier would have accelerated debugging during UAT. I now instrument every async integration from day one.
**Best for questions about:** complex integrations, financial systems, REST API design, production reliability, Salesforce FSC

### [Global Delivery] AB-InBev: Three Countries, One Rollout
**Source:** Report #009 — GM Financial — Sr. Technical Principal Architect, Salesforce
**S (Situation):** AB-InBev needed simultaneous Salesforce managed package customization and rollout across Mexico, Tanzania, and India with no local technical leads in any market.
**T (Task):** Lead technical delivery across three time zones and cultures, ensuring consistent quality and a functional Einstein Vision MVP for Grupo Modelo.
**A (Action):** Established a shared code base, documented a customization guide for local admins, set up async communication norms for cross-timezone collaboration, and built the Einstein Vision MVP hands-on.
**R (Result):** Successful go-live in all three markets; Einstein Vision MVP approved for productionization by the AB-InBev product team.
**Reflection:** Timezone overlap was the biggest bottleneck — async communication norms established earlier would have saved at least 2-3 weeks of coordination delay.
**Best for questions about:** global delivery, cross-cultural leadership, multi-timezone projects, hands-on architecture, innovation/MVP delivery

### [Release Engineering] HCLTech: Shipping Without Breaking Production
**Source:** Report #009 (revised) — GM Financial — Platform Engineer
**S (Situation):** The C6 Bank FSC codebase at HCLTech was growing rapidly with concurrent feature work across multiple developers in a high-stakes fintech production environment with zero tolerance for regression.
**T (Task):** Establish a reliable, repeatable deployment process to protect the fintech Salesforce org from production regressions while maintaining delivery velocity.
**A (Action):** Implemented PMD static analysis gates and code review standards; enforced 80%+ test coverage requirements across the team; configured GitLab CI for metadata validation and deployment sequencing before promotion to production.
**R (Result):** Zero production-breaking deployments during tenure; the team adopted consistent deployment patterns that reduced integration rework across sprints.
**Reflection:** Automated org-comparison tooling (like Gearset) would have caught environment-specific failures sooner than manual diff reviews — planning to introduce that layer in future engagements.
**Best for questions about:** CI/CD, Salesforce deployments, release engineering, platform reliability, DevOps mindset, code quality standards

### [Incident Response] Cisco Meraki: Enterprise Systems at Scale
**Source:** Report #009 (revised) — GM Financial — Platform Engineer
**S (Situation):** At Cisco Meraki, enterprise-scale data flow and integration systems processed information for thousands of enterprise devices. Any failure in the integration pipeline had immediate downstream impact on customers and internal operations.
**T (Task):** Operate and continuously improve integration reliability, with fast diagnosis and resolution when incidents occurred.
**A (Action):** Built monitoring signals into integration pipelines for proactive anomaly detection; participated in cross-team incident response with structured root cause analysis; documented failure modes and resolution steps to build operational runbooks.
**R (Result):** Improved system reliability through instrumentation; contributed to a post-mortem culture that systematically reduced repeat incidents.
**Reflection:** A more formal on-call rotation and paging system would have made incident handoffs more efficient — I now treat observability and runbook documentation as first-class deliverables in any integration engagement.
**Best for questions about:** incident response, SRE mindset, operational reliability, root cause analysis, observability, enterprise integration
