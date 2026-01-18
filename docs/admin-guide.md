# Admin Guide - Ford Auto Sales

## Accessing the Admin Panel

1. Start the admin server: `npm run dev:admin`
2. Open: `http://localhost:8046/admin?token=YOUR_TOKEN`
3. The token is set in your `.env` file as `ADMIN_TOKEN`

## Dashboard

The dashboard shows:
- **Total Sessions**: All training sessions conducted
- **Sales Made**: Sessions where a sale was completed
- **Conversion Rate**: Percentage of successful sales
- **Avg Messages/Sale**: How many exchanges before closing

Quick actions link to common configuration tasks.

## Sessions

### Viewing Sessions
- See all training sessions with outcomes
- Filter by date, outcome, phase
- Click "View" to see full conversation transcript

### Session Details
Each session shows:
- Complete message history (voice transcripts)
- Which sales phase each message was in
- Session duration
- Closing attempts made
- Final outcome (sale_made, no_sale, abandoned)
- Vehicle of interest

## Analytics

### Outcome Distribution
Pie chart showing:
- Sales Made (success)
- No Sale (customer declined or user gave up)
- Abandoned (disconnected)

### Top Performing Techniques
Shows which sales techniques have the highest success rate based on historical data.

### Learning Insights
AI-generated insights about patterns:
- Which discovery questions work best
- Common objection patterns
- Most effective closing strategies

## Dealership Configuration

### Basic Info
- **Name**: Dealership name (e.g., "City Ford")
- **Location**: Address
- **Phone**: Contact number
- **Email**: Sales email
- **Website**: Dealership URL

### Branding
- **Dealership Type**: Ford, Chevrolet, Toyota, multi-brand, etc.
- **Primary Color**: Theme color for branding
- **Tagline**: Marketing tagline
- **Logo URL**: Logo image

## Vehicles

### Vehicle Inventory
Full CRUD management for vehicle inventory:
- Add, edit, delete vehicles
- Bulk import from CSV/Excel
- Filter by make, body style, condition, status

### Vehicle Fields
- **Basic**: Year, Make, Model, Trim, Body Style
- **Identification**: VIN, Stock Number
- **Appearance**: Exterior/Interior Colors
- **Specs**: Engine, Transmission, Drivetrain, Fuel Type, MPG
- **Pricing**: MSRP, Sale Price, Special Price
- **Status**: Available, Pending, Reserved, Sold
- **Condition**: New, Certified Pre-Owned, Used
- **Images**: Multiple image URLs (first is primary)
- **Features**: JSON array of features
- **Description**: Marketing description

### Bulk Actions
- Select multiple vehicles with checkboxes
- Bulk delete
- Bulk status update (mark as available/sold)

## Voices & Languages

### Sales Mode
Choose who plays the salesperson:
- **AI Sells**: AI is the salesperson, user is the customer (default)
- **User Sells**: User is the salesperson, AI is the customer

### Difficulty Level (User Sells Mode Only)
How tough the AI customer is:
- **Easy**: Friendly, few objections, buys quickly
- **Medium**: Needs convincing, raises 2-3 objections
- **Hard**: Skeptical, challenges claims, requires excellent pitch
- **Expert**: Dismissive, impatient, extremely tough to close

### Voice Selection
8 OpenAI voices available:
- **Male**: Ash, Echo, Verse
- **Female**: Alloy, Ballad, Coral, Sage, Shimmer

Each voice has different characteristics (confident, warm, energetic, etc.)

### Languages
- 15+ languages supported
- AI automatically responds in whatever language the user speaks
- Enable/disable languages as needed

## Greeting Configuration

### Welcome Message
The first message users hear. Variables available:
- `{dealership_name}` - Inserts dealership name

**Example:**
> "Welcome to {dealership_name}! I'm your Ford sales specialist. Whether you're looking for a rugged F-150, an iconic Mustang, or a versatile Bronco, I'm here to help."

### Trigger Phrase
The phrase that starts the sales exercise in AI Sells mode (default: "sell me a car").

## Sales Techniques

Enable/disable individual techniques. Categories:
- **Discovery**: Question-asking techniques (needs assessment, trade-in discovery)
- **Positioning**: How to frame vehicle value (benefit selling, test drive close)
- **Persuasion**: Psychological influence (scarcity, financing options)
- **Closing**: Getting to yes (assumptive, summary, today close)
- **Objection Handling**: Responding to concerns (feel-felt-found, payment reframe)

Each technique shows:
- Usage count
- Success rate (when used in successful sales)

## Discovery Questions

### Adding Questions
1. Enter the question text
2. Specify what it reveals (purpose)
3. Add optional follow-up question
4. Select target need (budget, family, utility, efficiency, etc.)

### Example Questions
- "What will you primarily be using the vehicle for?"
- "Are you looking to buy, lease, or still deciding?"
- "Do you have a vehicle to trade in today?"
- "How important is fuel efficiency versus power?"

### Best Practices
- Questions should be open-ended
- Focus on needs, not just features
- Listen for emotional triggers

## Closing Strategies

Types of closes:
- **Soft**: Low pressure, tests interest ("Would you like a test drive?")
- **Direct**: Asks for the sale directly ("Are you ready to make it yours?")
- **Assumptive**: Assumes the sale, asks about details ("Which color?")
- **Choice**: Offers two positive options ("XLT or Lariat?")
- **Urgency**: Creates time pressure ("0% APR ends this month")

## Objection Handlers

Configure responses to common objections by category:

| Category | Example Objection |
|----------|-------------------|
| **Price** | "Too expensive", "Payment too high" |
| **Financing** | "I want to pay cash", "Need better terms" |
| **Timing** | "Let me think about it", "Need to talk to spouse" |
| **Competition** | "I saw a better deal elsewhere" |
| **Trade-in** | "Trade-in value too low" |
| **Need** | "I don't really need a new car" |

## AI Configuration

### System Prompt
The main instruction set for the AI. Controls:
- Personality and tone
- Sales rules and approach
- Vehicle knowledge
- Financing awareness
- Phase-specific behavior

### Phase Prompts
Additional guidance for each sales phase:
- **Discovery**: How to ask questions, what to listen for
- **Positioning**: How to present vehicle benefits
- **Closing**: How to ask for the sale

## Integrations

### Webhooks
Send notifications to external systems:
- Session started
- Session ended
- Sale completed
- Lead captured

### SMS Configuration
Configure text messaging:
- Provider (Twilio, Vonage, etc.)
- Welcome messages
- Follow-up templates
- Staff notifications

### Call Transfer
Configure live transfer to sales staff:
- Transfer triggers
- Destination numbers by department
- Transfer messages

### DTMF (IVR)
Configure phone menu options:
- Key mappings (Press 1 for Sales, etc.)
- Actions (transfer, AI agent, voicemail)

### Payments
Configure deposit collection:
- Payment provider (Stripe, Square, etc.)
- Deposit amounts
- Terms and conditions

## AI Tools & Functions

### AI Tools
Extend AI capabilities with custom tools:
- Function definitions
- API integrations
- Custom handlers

### AI Agents
Configure specialized AI personas:
- Sales agent
- Finance specialist
- Service advisor
- Receptionist

### Custom Functions
User-defined logic triggered by events:
- Session start/end
- Message received
- Sale made

### Logic Rules
Conditional AI behaviors:
- Keyword triggers
- Sentiment-based responses
- Intent detection

## Best Practices

### Improving Conversion
1. Review successful sessions for patterns
2. Enable techniques with high success rates
3. Refine discovery questions based on results
4. Update objection handlers for common blockers

### Monitoring Performance
1. Check analytics weekly
2. Look for declining conversion rates
3. Identify new objection patterns
4. Review abandoned sessions for issues

### Training Staff (User Sells Mode)
1. Start with Easy difficulty
2. Progress to Medium once comfortable
3. Use Hard to challenge experienced salespeople
4. Expert mode for advanced training
