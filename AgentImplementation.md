# Agent Implementation - SellMeACar (Ford Dealership Training)

## Project Overview

**Type**: Training & Education Platform
**Purpose**: Ford dealership AI sales training application

## Tech Stack

```
Backend:     Node.js + Express + TypeScript
Database:    SQLite + Prisma ORM
Voice:       OpenAI Realtime API (WebSockets)
Frontend:    EJS templates + Bootstrap 5 + Bootstrap Icons
Container:   Docker + Docker Compose
```

## Key Components

- `src/routes/` - Admin and training routes
- `prisma/schema.prisma` - Vehicle/training schema
- Admin panel with data tables, pagination, bulk actions

## Key Features

- Car sales training scenarios
- Ford vehicle product knowledge
- Role-playing with AI car buyer
- Performance evaluation
- Admin panel for scenario management

---

## Recommended Agents

### MUST IMPLEMENT (Priority 1)

| Agent | File | Use Case |
|-------|------|----------|
| **Backend Architect** | engineering/backend-architect.md | Training sessions, vehicle data models |
| **DevOps Automator** | engineering/devops-automator.md | Docker management |
| **AI Engineer** | engineering/ai-engineer.md | AI car buyer persona, sales evaluation |
| **Database Admin** | data/database-admin.md | SQLite, Ford vehicles, training data |
| **Security Auditor** | security/security-auditor.md | User sessions, admin access |
| **Bug Debugger** | quality/bug-debugger.md | Training session issues |

### SHOULD IMPLEMENT (Priority 2)

| Agent | File | Use Case |
|-------|------|----------|
| **Frontend Developer** | engineering/frontend-developer.md | Training UI |
| **API Tester** | testing/api-tester.md | API validation |
| **Code Reviewer** | quality/code-reviewer.md | TypeScript patterns |
| **UI Designer** | design/ui-designer.md | Training interface |
| **Content Creator** | marketing/content-creator.md | Ford vehicle info, buyer scenarios |

### COULD IMPLEMENT (Priority 3)

| Agent | File | Use Case |
|-------|------|----------|
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Training metrics |

---

## Agent Prompts Tailored for This Project

### AI Engineer Prompt Addition
```
Project Context:
- AI plays car buyers with different profiles:
  - First-time buyer (nervous, needs guidance)
  - Trade-in customer (wants best value)
  - Family buyer (safety focused)
  - Truck buyer (capability focused)
  - Budget conscious (price negotiator)
- Evaluates: product knowledge, needs assessment, feature presentation, closing
- Must know Ford vehicle lineup (F-150, Mustang, Explorer, etc.)
- Voice interaction via OpenAI Realtime API
```

### Content Creator Prompt Addition
```
Project Context:
- Ford vehicle specifications and features
- Car buyer personas and scenarios
- Common objections in car sales:
  - "I need to think about it"
  - "The price is too high"
  - "I'm just looking"
  - "I can get a better deal elsewhere"
- Evaluation rubrics for car sales techniques
- Financing and trade-in scenarios
```

### Database Admin Prompt Addition
```
Project Context:
- Ford vehicle catalog data
- Training session tracking
- User performance history
- Scenario configurations
```

---

## Marketing & Growth Agents (When Production Ready)

Add these when the project is ready for public release/marketing:

### Social Media & Marketing

| Agent | File | Use Case |
|-------|------|----------|
| **TikTok Strategist** | marketing/tiktok-strategist.md | Car sales tips, dealership humor, test drive content |
| **Instagram Curator** | marketing/instagram-curator.md | Vehicle showcases, training wins |
| **Twitter/X Engager** | marketing/twitter-engager.md | Automotive sales community, industry discussions |
| **Reddit Community Builder** | marketing/reddit-community-builder.md | r/askcarsales, r/Ford, r/autosales |
| **Content Creator** | marketing/content-creator.md | Vehicle specs, objection scripts, buyer personas |
| **SEO Optimizer** | marketing/seo-optimizer.md | Dealership training keywords, automotive SEO |
| **Visual Storyteller** | design/visual-storyteller.md | Training screenshots, Ford vehicle imagery |

### Growth & Analytics

| Agent | File | Use Case |
|-------|------|----------|
| **Growth Hacker** | marketing/growth-hacker.md | Dealership partnerships, pilot programs |
| **Trend Researcher** | product/trend-researcher.md | Automotive sales trends, EV market changes |
| **Finance Tracker** | studio-operations/finance-tracker.md | Training license revenue, dealership ROI |
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Sales improvement metrics, completion rates |

---

## Not Recommended for This Project

| Agent | Reason |
|-------|--------|
| Mobile App Builder | Web-based |
| Whimsy Injector | Professional dealership context |

---

## Implementation Commands

```bash
claude --agent engineering/backend-architect
claude --agent engineering/ai-engineer
claude --agent data/database-admin
claude --agent marketing/content-creator
claude --agent quality/bug-debugger
```
