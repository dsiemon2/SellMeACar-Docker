# SellMeACar - Automotive Sales Training AI

**Type:** Sales Training Application (Automotive)
**Port:** 8082
**URL Prefix:** `/SellMeACar/`

---

## Quick Start

```bash
# Start the application
docker compose up -d

# Access URLs
# Chat: http://localhost:8082/SellMeACar/
# Admin: http://localhost:8082/SellMeACar/admin?token=admin
```

---

## Features Overview

### Sales Training
- **Sessions** - Practice automotive sales conversations
- **Vehicles** - Vehicle inventory and specifications
- **Techniques** - Automotive sales methodology
- **Discovery Questions** - Customer needs assessment
- **Closing Strategies** - Deal closing techniques
- **Objection Handling** - Response to customer concerns

### AI Configuration
- AI Config settings
- Knowledge Base
- Greeting customization

---

## Database Schema

### Key Models
- `Session` - Sales practice sessions
- `Vehicle` - Vehicle inventory (make, model, year, price, features)
- `SalesTechnique` - Sales methodologies
- `DiscoveryQuestion` - Assessment questions
- `ClosingStrategy` - Closing techniques
- `Objection` - Common objections and responses

---

## Color Theme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Teal | `#0d9488` |
| Secondary | Dark Teal | `#0f766e` |
| Accent | Light Teal | `#14b8a6` |

---

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) - Master reference
- [THEMING.md](../../../THEMING.md) - Theming guide
- [DATABASE-SCHEMAS.md](../../../DATABASE-SCHEMAS.md) - Full schemas
- [SAMPLE-DATA.md](../../../SAMPLE-DATA.md) - Sample data
