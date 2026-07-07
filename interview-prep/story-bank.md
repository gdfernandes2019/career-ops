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

### [DevOps Ownership] Cisco Meraki: Full CI/CD Lifecycle with Copado
**Source:** Report #023 — Docker — Senior Salesforce Developer
**S (Situation):** At Cisco Meraki, the Salesforce instance had no structured release management process — deployments were ad hoc and change governance was informal, creating risk for an enterprise-scale system.
**T (Task):** Own the Salesforce CI/CD lifecycle end to end: source control, automated deployments, environment promotion, deployment governance, and production change management.
**A (Action):** Implemented Copado as the CI/CD platform: branch-based source control, automated deployment validation, environment promotion pipeline, production change management procedures, and technical documentation for the release process.
**R (Result):** Structured, repeatable deployments with full audit trail; eliminated manual change deployment errors; team could ship with confidence.
**Reflection:** Gearset implements the same DevOps principles with a different interface — the skills transfer directly. A more formal staging environment cadence would have caught environment-specific configuration issues earlier.
**Best for questions about:** Salesforce DevOps, CI/CD, Copado, Gearset, release management, deployment governance, change management

### [MuleSoft Integration Architecture] Provider IT: API Gateway for Salesforce Experience Cloud
**Source:** Report #023 — Docker — Senior Salesforce Developer
**S (Situation):** At Provider IT, Salesforce Experience Cloud needed to consume external services through a governed, secure API layer that did not expose internal systems directly.
**T (Task):** Design and build a MuleSoft API Gateway layer on Anypoint Platform that exposed external services to Salesforce Experience Cloud with proper auth, routing, transformation, and error handling.
**A (Action):** Designed REST Reverse Proxy APIs on MuleSoft API Gateway + Anypoint Platform; implemented OAuth-secured endpoints with request routing and response transformation using Spring Boot; documented the pattern for the team.
**R (Result):** Working API layer in production serving Salesforce Experience Cloud; clean separation between internal systems and Salesforce consumer; patterns reused for subsequent integrations.
**Reflection:** Centralized logging from day one would have accelerated integration debugging in production. I now treat observability as a first-class requirement in any API Gateway design.
**Best for questions about:** MuleSoft, API integration, Salesforce integrations, Anypoint Platform, integration architecture, GTM systems

### [CPQ and Billing Integration] Enel: Configure-Price-Quote Implementation
**Source:** Report #023 — Docker — Senior Salesforce Developer
**S (Situation):** Enel Energy (Energy & Utilities) needed a configure-price-quote system integrated with Salesforce and their billing platform so customer service agents could generate quotes and manage billing without leaving Salesforce.
**T (Task):** Implement CPQ Bit2Win within Salesforce — configure product catalog, pricing rules, and quote generation workflows; integrate with the billing system.
**A (Action):** Configured CPQ rules, product catalog, and pricing logic in Bit2Win; built the integration between Salesforce CPQ and the billing system for end-to-end quote-to-invoice flow; delivered customer service processes on top of the CPQ foundation.
**R (Result):** Working end-to-end configure-price-quote flow in production; customer service agents generated quotes and managed billing without leaving Salesforce.
**Reflection:** CPQ projects need a dedicated data modeling phase before configuration begins — skip it and the pricing logic becomes unmaintainable as rules multiply. I now front-load a product catalog design workshop before any CPQ build.
**Best for questions about:** CPQ, quote-to-cash, billing integration, Salesforce CPQ, configure-price-quote, ERP integration, Energy & Utilities

### [Omni Integration / Agentic Orchestration] HCLTech: Omni Integration Procedures for Multi-Channel Financial Services
**Source:** Report #032 — Grupo SysMap — Desenvolvedor Salesforce Senior - IA Developer
**S (Situation):** At HCLTech (working with C6 Bank), a digital bank needed to unify customer service journeys across multiple channels — each backed by different external systems — into a single Salesforce-powered experience.
**T (Task):** Build the integration and orchestration layer that pulled data from external services and composed it into a coherent experience for agents, using Salesforce's native orchestration tooling.
**A (Action):** Built REST API integrations (sync and async) between Salesforce and external services; used Omni Integration Procedures for multi-step orchestration and Omni Data Mappers for response transformation across multi-channel customer support journeys.
**R (Result):** Delivered a unified customer service experience where agents saw complete, real-time external system data without leaving Salesforce; reduced context-switching for support agents across channels.
**Reflection:** Omni Integration Procedures are the closest native Salesforce pattern to what Agentforce Actions do — they orchestrate multi-step processes by calling external systems, transforming responses, and routing results. This experience directly maps to Agentforce implementation patterns.
**Best for questions about:** Omni Integration Procedures, Omni Data Mappers, multi-channel orchestration, Agentforce-adjacent patterns, financial services, service cloud, complex integrations

### [Legacy Integration / BSS-OSS Analogue] Comgás: CRM-to-Billing System Integration
**Source:** Report #031 — Confidencial via Leme Recruiting (Everymind) — Analista Desenvolvedor Salesforce Sênior
**S (Situation):** At Deloitte, Comgás (gas distribution utility) needed its Vantive CRM to exchange customer and billing data with Cordaptix (Oracle) — a legacy billing and field-service system — to enable end-to-end customer service operations.
**T (Task):** Design and implement the integration layer between the CRM and the billing system so customer service agents could access contract, billing, and service order data without switching systems.
**A (Action):** Designed and built the CRM-to-billing integration at Deloitte: mapped data contracts between Vantive and Cordaptix, built the synchronization layer handling customer records, billing events, and service orders, and tested under production-equivalent conditions with the Comgás operations team.
**R (Result):** Integration went live and remained in production for years after handover; customer service agents had a unified view of billing and service data directly from CRM.
**Reflection:** Legacy billing system integrations (BSS/OSS in Telecom, core banking in Fintech, Cordaptix in E&U) follow the same architecture pattern: REST/event-driven sync with stateful retry logic and data transformation. Domain acronyms differ; the integration design does not. Entering a new vertical earlier with a domain glossary session would accelerate mapping.
**Best for questions about:** BSS/OSS-equivalent integrations, legacy system connectivity, CRM-to-billing integration, utilities industry, data transformation, Telecom adjacency

### [Data Governance] C6 Bank: Data Model Ownership on FSC
**Source:** Report #033 — Riveron — Salesforce Technical Architect
**S (Situation):** At C6 Bank, one of Brazil's largest digital banks, the Financial Services Cloud implementation needed a complete custom data model — and every design decision (object types, relationship cardinality, sharing rules, permissions) was permanent once data entered production.
**T (Task):** Own all data-model decisions for the FSC implementation: custom objects, lookup vs master-detail trade-offs, sharing rules for compliance, and Permission Sets for role-based access.
**A (Action):** Evaluated the rollup and cascade implications of each relationship type before committing; defined sharing rules aligned to banking compliance requirements; designed Permission Sets that mapped to product roles without granting over-privilege; documented every decision with the rationale for the team.
**R (Result):** No data model rework in production; the team could extend the model safely in later sprints because the foundation was documented and principled.
**Reflection:** These decisions are irreversible — a master-detail chosen for rollup convenience becomes a blocker if you later need to reparent records. I now prototype rollup behavior and test sharing rules in a scratch org before committing any relationship design.
**Best for questions about:** data governance, data modeling, FSC, security and sharing, architecture ownership, permanent design decisions, Financial Services Cloud

### [Business-Tech Bridge] everis / Banco Itaú: Spec Writer Who Also Ships Code
**Source:** Report #030 — FCamara — Pessoa Desenvolvedora Salesforce - Sênior
**S (Situation):** At everis on the Banco Itaú account, business stakeholders and the Salesforce development team were struggling to communicate requirements clearly — the business used banking terms, the dev team spoke platform-first. Both sides were misaligned on what the Sales Cloud and Service Cloud integration with core banking systems should do.
**T (Task):** Act as the bridge: write functional and technical specifications that both sides could use, then later take on development responsibilities on the same program.
**A (Action):** Ran stakeholder interviews with business areas to capture banking workflow requirements; translated those into Salesforce-native functional specs (object model, field logic, integration contracts) and technical specs (REST API contracts, trigger behavior, test cases); later joined the dev squad and built features to the same specs I had written.
**R (Result):** Full business sign-off on specifications before any code was written; the program delivered on schedule with zero major scope disputes during development — because the dev team was building from specs they trusted.
**Reflection:** Writing the spec and then building to it is the best way to understand both sides. The discipline of writing a precise REST contract before the integration is built saves weeks of debugging later. I now insist on a spec-first step even on small integrations.
**Best for questions about:** business-tech bridge, functional specs, technical specs, stakeholder management, discovery, requirements gathering, Salesforce consulting, financial services
