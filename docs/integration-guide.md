# Auto Sales Integration Guide

This guide explains how to adapt the **Ford Auto Sales** AI training platform for use with other dealerships, brands, and industries.

---

## Overview

The sales training system uses a phased conversation approach powered by OpenAI's GPT-4o and Realtime API:

1. **Greeting** - Welcome the customer
2. **Discovery** - Ask questions to understand needs
3. **Vehicle Selection** - Match customer to inventory
4. **Positioning** - Present vehicle benefits based on needs
5. **Closing** - Guide toward purchase decision

This methodology applies to any automotive dealership.

---

## Dealership Customization

### Basic Configuration

Update the dealership settings in the admin panel:

```json
{
  "name": "City Ford",
  "type": "ford",
  "location": "123 Main St, Anytown, USA",
  "phone": "(555) 123-4567",
  "email": "sales@cityford.com",
  "website": "https://cityford.com",
  "primaryColor": "#003478",
  "tagline": "Where customers become family"
}
```

### Multi-Brand Setup

For dealerships carrying multiple brands:

```json
{
  "name": "AutoMax",
  "type": "multi-brand",
  "brands": ["Ford", "Lincoln", "Mazda"],
  "tagline": "All your favorite brands, one great experience"
}
```

---

## Vehicle Inventory Integration

### Database Import

Import vehicles from your DMS (Dealer Management System):

```typescript
// Example: Import from CSV
const vehicles = [
  {
    year: 2024,
    make: 'Ford',
    model: 'F-150',
    trim: 'XLT SuperCrew',
    vin: '1FTFW1E85NFA00001',
    stockNumber: 'F150-001',
    msrp: 52995,
    salePrice: 49995,
    exteriorColor: 'Oxford White',
    engine: '3.5L V6 EcoBoost',
    images: ['https://...'],
    // ... more fields
  }
];
```

### API Integration

Connect to your existing inventory system:

```typescript
// Fetch inventory from DMS API
const response = await fetch('https://your-dms.com/api/inventory');
const inventory = await response.json();

// Sync to training database
for (const vehicle of inventory) {
  await prisma.vehicle.upsert({
    where: { vin: vehicle.vin },
    update: vehicle,
    create: vehicle
  });
}
```

---

## Industry Adaptations

While designed for automotive, the platform adapts to other sales contexts:

### RV/Powersports Dealerships

```json
{
  "name": "Adventure RV",
  "type": "rv",
  "products": [
    {
      "year": 2024,
      "make": "Airstream",
      "model": "Interstate 24GT",
      "bodyStyle": "Class B Motorhome",
      "features": ["Full Kitchen", "Bathroom", "Solar Ready"],
      "msrp": 215000
    }
  ]
}
```

**Discovery Questions:**
- "Will this be your full-time home or for weekend trips?"
- "How many people typically travel with you?"
- "What's your towing capacity?"

### Marine/Boat Dealers

**Discovery Questions:**
- "What water will you primarily use this on - lake, ocean, rivers?"
- "Are you looking for fishing, watersports, or cruising?"
- "Do you have trailer storage or need a slip?"

### Heavy Equipment

**Discovery Questions:**
- "What's the primary application - construction, agriculture, landscaping?"
- "What's your typical job site terrain?"
- "Do you need financing or outright purchase?"

---

## White-Label Deployment

### Branding Customization

```typescript
// config/branding.ts
export const dealershipConfig = {
  name: process.env.DEALERSHIP_NAME,
  logo: process.env.LOGO_URL,
  primaryColor: process.env.PRIMARY_COLOR || '#003478',
  secondaryColor: process.env.SECONDARY_COLOR || '#1a73e8',
  aiPersona: process.env.AI_PERSONA || 'friendly and knowledgeable sales consultant'
};
```

### Multi-Tenant Setup

For SaaS deployments serving multiple dealerships:

```typescript
interface TenantConfig {
  tenantId: string;
  dealership: DealershipConfig;
  inventory: Vehicle[];
  aiConfig: AIConfig;
  branding: BrandingConfig;
}

// Route requests by subdomain or path
app.use('/api/:tenantId/*', (req, res, next) => {
  req.tenant = await getTenantConfig(req.params.tenantId);
  next();
});
```

---

## CRM Integration

### Lead Capture

Send leads to your CRM when sessions complete:

```typescript
// Webhook on session end
if (session.outcome === 'sale_made' || session.outcome === 'no_sale') {
  await fetch(config.crmWebhook, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.crmToken}` },
    body: JSON.stringify({
      leadSource: 'AI Sales Training',
      customerName: session.customerName,
      phone: session.customerPhone,
      email: session.customerEmail,
      vehicleOfInterest: session.vehicleId,
      outcome: session.outcome,
      transcript: session.messages,
      salesNotes: session.aiInsights
    })
  });
}
```

### Popular CRM Integrations

- **Salesforce**: Use REST API or Salesforce Connect
- **HubSpot**: Native webhook support
- **DealerSocket**: Custom API integration
- **VinSolutions**: Lead API
- **elead CRM**: Web services API

---

## Analytics & Reporting

### KPI Tracking

The platform tracks key metrics:

- **Conversion Rate**: Sessions resulting in sales
- **Average Session Length**: Time to close
- **Discovery Effectiveness**: Which questions lead to sales
- **Objection Patterns**: What customers push back on
- **Technique Performance**: Which strategies work best

### Custom Dashboards

Export data for external BI tools:

```typescript
// Export session data
app.get('/api/export/sessions', async (req, res) => {
  const sessions = await prisma.salesSession.findMany({
    include: { messages: true, vehicle: true },
    where: {
      createdAt: { gte: req.query.startDate }
    }
  });

  res.json(sessions);
});
```

---

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...
DATABASE_URL=file:./prod.db
ADMIN_TOKEN=secure-random-token

# Server
PORT=8045
ADMIN_PORT=8046

# Dealership
DEALERSHIP_NAME=City Ford
DEALERSHIP_TYPE=ford

# AI Configuration
AI_MODEL=gpt-4o
DEFAULT_VOICE=alloy

# Integrations
CRM_WEBHOOK=https://your-crm.com/api/leads
CRM_API_KEY=...
```

---

## Deployment Options

### Single Instance

```bash
npm run build
npm start        # Chat server
npm run start:admin  # Admin server
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 8045 8046
CMD ["npm", "start"]
```

### Kubernetes

For high-availability deployments:
- Use PostgreSQL instead of SQLite
- Redis for WebSocket session management
- Horizontal pod autoscaling based on connection count

---

## Security Considerations

- **API Keys**: Never commit to version control
- **Admin Access**: Use strong tokens, consider adding IP whitelist
- **Customer Data**: Encrypt PII, implement retention policies
- **HTTPS**: Required for production WebSocket connections
- **Rate Limiting**: Protect against abuse

---

## Support & Resources

- **API Documentation**: `/docs/api`
- **WebSocket Protocol**: `/docs/websocket`
- **Admin Guide**: `/docs/admin`

For technical support or custom integrations, contact your implementation team.
