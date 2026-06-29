# Study Plan — Salesforce Superbadges + MuleSoft (Travel Agency Project)

**Owner:** Guilherme D. Fernandes
**Created:** 2026-06-29
**Goal:** Refresh hands-on Salesforce dev skills (already-certified Platform Developer I) and build net-new MuleSoft development experience through a single, coherent travel-agency project.

---

## Ground rules (read this on a hard day)

- **Done is a win.** A 30-minute session that ends with one passing challenge counts. So does a low-energy day spent watching a Coursera video.
- **Order matters, intensity doesn't.** Follow the sequence, but the pace is yours. Skipping a day never breaks the plan — it just moves.
- **The hard part is starting.** Each phase opens with a trivial "just open the tool" step on purpose.
- **One org to rule them all.** Use a single Salesforce Developer Edition org across all three superbadges *and* the MuleSoft integration. The travel project plugs into it at the end.

---

## TRACK A — Salesforce Superbadges (in your chosen order)

> Superbadges are scenario-based, auto-graded challenges in a live org. Each requires prerequisite badges before the "Challenge" unlocks. Search the exact name on **trailhead.salesforce.com**; if any has been retired/renamed, take the nearest current equivalent (noted below).

### A1 — Apex Specialist  *(first)*
- **Theme:** "HowWeRoll" — auto-create maintenance requests, schedule recurring work with async Apex, sync inventory from an external warehouse REST service.
- **Skills refreshed:** triggers, SOQL/DML in bulk, governor limits, Queueable/Batch/Scheduled Apex, REST callouts + JSON parsing, Apex test classes & mock callouts.
- **Typical prereq badges:** Object-Oriented Programming in Apex · Apex Triggers · Asynchronous Apex · Apex Integration Services · Apex Testing.
- **Est. effort:** ~8–12h. **Gentle split:** prereqs over 3–4 short sessions, then the 5 challenge steps one per session.
- **Interview payoff:** directly answers the Apex/integration/test-class probes in the Titan & Built In JDs.

### A2 — Process Automation Specialist  *(second — Flow / process automation)*
- **Theme:** "Robot Setup" / lead & opportunity routing — automate with record-triggered Flows, screen Flows, approval processes, validation, and scheduled automation.
- **Skills refreshed:** Flow Builder (record-triggered + screen), approval processes, formula/validation rules, when-to-use-Flow-vs-Apex judgment.
- **Typical prereq badges:** Formulas & Validations · Build Flows with Flow Builder · Approve Records with Approval Processes · (Lightning) Flow modules.
- **Est. effort:** ~6–8h (lightest of the three — good momentum win after Apex).
- **Nearest equivalent if retired:** "Flow Specialist" / "Business Administration Specialist".
- **Interview payoff:** the "declarative-first, code-when-needed" story senior reviewers love.

### A3 — Lightning Web Components Specialist  *(third — Lightning UI)*
- **Theme:** build an LWC-based UI ("HowWeRoll" bike-tracking / inventory app) wired to Apex and Salesforce data.
- **Skills refreshed:** LWC components & lifecycle, Lightning Data Service, `@wire` to Apex, component events/pub-sub, navigation, Jest unit tests.
- **Typical prereq badges:** Lightning Web Components Basics · Lightning Data Service · Lightning Web Components & Salesforce Data · LWC Testing (Jest).
- **Est. effort:** ~10–15h (heaviest — save for when momentum is built).
- **Nearest equivalent if retired:** "Aura Components Specialist" (legacy — only if LWC one is gone).
- **Interview payoff:** covers the JS/LWC depth that the **JavaScript Developer I** badge would otherwise signal — closes your one remaining soft cert gap *with a portfolio artifact instead of an exam*.

**Track A done =** 3 superbadges on your Trailhead profile (publicly linkable) + a populated Dev org you reuse below.

---

## TRACK B — MuleSoft: "Wanderlust Travel" API-Led Project

A project-based path through the full **MuleSoft development lifecycle** — design → build → transform → test → deploy → integrate — using only free / free-tier tooling. The end state pushes travel bookings into the *same* Salesforce org from Track A.

### Free toolchain (no paid subscription needed for dev)
| Tool | Cost | Use |
|------|------|-----|
| **Anypoint Studio** | Free, perpetual (desktop IDE) | Build & run Mule apps locally |
| **Anypoint Platform trial** | 30-day free trial | Design Center (RAML), API Manager, CloudHub deploy |
| **DataWeave Playground** (`dataweave.mulesoft.com`) | Free, online | Practice transformations with zero setup |
| **MUnit** | Bundled with Studio | Unit/integration tests |
| **Local MySQL/PostgreSQL** (or H2) | Free | "System of record" travel DB |
| **Amadeus for Developers — Self-Service** | Free test tier | Real flight-search / hotel API for live data |
| **Salesforce Connector** | Free | Push bookings into your Track-A Dev org |
| **MuleSoft Trailhead / "Getting Started with Anypoint Platform"** | Free | Guided fundamentals (search on Trailhead) |

### Architecture — API-led connectivity (3 layers)
```
   Experience API  ──  /web-booking   (tailored for a travel website/app)
        │
   Process API     ──  /trip-orchestration  (combine flight + hotel into a quoted trip, create booking)
        │
   ┌────┴───────────────┬─────────────────────┐
 System API           System API           System API
 /flights (Amadeus)   /hotels (local DB)    /crm (Salesforce booking → Opportunity/Case)
```

### Phases (mapped to the dev lifecycle)

**M0 — Setup (trivial, just install).**
Install Anypoint Studio, start a 30-day Anypoint Platform trial, open DataWeave Playground, get a free Amadeus self-service API key, spin up a local MySQL with a `customers` + `hotels` + `bookings` schema. *Goal: tools open. That's it.*

**M1 — Design (API spec first).**
In Design Center / API Designer, write a **RAML** spec for the System APIs (`/flights`, `/hotels`, `/bookings`). Publish to Exchange. *Lifecycle skill: API-first design, mocking service.*

**M2 — Build System APIs (Anypoint Studio).**
- `/hotels` → **Database connector** to local MySQL.
- `/flights` → **HTTP connector** calling Amadeus flight-search (handle OAuth token).
- `/crm` → **Salesforce connector** creating a record in your Track-A org.
*Lifecycle skill: connectors, flows, scaffolding from RAML (APIkit).*

**M3 — Transform (DataWeave).**
Map Amadeus' flight JSON and the DB hotel rows into a clean canonical `Trip` model. Build it in the Playground first, then drop into Studio. *Lifecycle skill: DataWeave 2.0, canonical data model.*

**M4 — Orchestrate (Process API).**
`/trip-orchestration`: take a destination + dates, fan out to `/flights` and `/hotels` in parallel (**Scatter-Gather**), assemble a quoted trip, and on "confirm" call `/crm` to log the booking in Salesforce. *Lifecycle skill: orchestration, parallel calls, choice routing.*

**M5 — Resilience & error handling.**
Add `try`/error-handlers, a retry (Until-Successful) on the Amadeus call, and a custom error type for "no availability." *Lifecycle skill: reliability patterns.*

**M6 — Test (MUnit).**
MUnit tests for each System API + the Process API, mocking the Amadeus and Salesforce connectors. *Lifecycle skill: automated testing, mocking external systems.*

**M7 — Deploy & secure.**
Deploy the Experience API to **CloudHub** (trial), apply an **API Manager** policy (client-ID enforcement + rate limiting). *Lifecycle skill: deployment, API governance.*

**M8 — Close the loop (the payoff).**
A booking made through the Experience API lands as an **Opportunity or Case in your Salesforce Dev org** — where your A2 Flow automations route it and your A3 LWC displays it. *Now both tracks are one demo.*

**Track B done =** a deployable, documented "Wanderlust Travel" API-led app + a screen-recordable end-to-end demo (web booking → MuleSoft → Salesforce). Strong portfolio piece; revives the MuleSoft/Experience Cloud integration story from your Provider IT role.

---

## Suggested rhythm (loose — adjust freely)

| Week | Salesforce (Track A) | MuleSoft (Track B) |
|------|----------------------|--------------------|
| 1 | A1 prereqs + open org | M0 setup |
| 2 | **A1 Apex Specialist** challenge | M1 design |
| 3 | A2 prereqs | M2 system APIs (hotels + flights) |
| 4 | **A2 Process Automation Specialist** | M2 (crm) + M3 DataWeave |
| 5 | A3 prereqs (LWC + Jest) | M4 orchestration |
| 6 | **A3 LWC Specialist** (part 1) | M5 error handling |
| 7 | A3 LWC Specialist (finish) | M6 MUnit |
| 8 | polish / portfolio | M7 deploy + M8 loop-close demo |

Alternate the two tracks day to day so neither gets stale — Salesforce when you want structured/guided, MuleSoft when you want to build something that's *yours*.

---

## Artifacts to keep (for interviews & CV)
- 3 superbadge links on your public Trailhead profile.
- "Wanderlust Travel" repo (RAML specs, Mule flows, DataWeave, MUnit tests, README with the architecture diagram above).
- A 2–3 min screen recording of the end-to-end demo.
- One STAR story for the story-bank: *"Rebuilt an API-led integration platform (3-layer) connecting external travel APIs to Salesforce."*
