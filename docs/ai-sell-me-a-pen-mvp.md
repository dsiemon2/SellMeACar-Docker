# Ford Auto Sales - AI Sales Training MVP

## Overview

This application demonstrates an AI-powered voice assistant for automotive sales training. Built on the same principles as the famous "Sell Me This Pen" challenge, it trains sales staff with realistic AI-driven customer interactions.

The app supports **two training modes**:
- **AI Sells Mode**: AI is the salesperson, user practices sales resistance
- **User Sells Mode**: User is the salesperson, AI is a customer with configurable difficulty

> **Status**: IMPLEMENTED - Full voice support via OpenAI Realtime API

### Quick Start
```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npx prisma db push && npx prisma db seed
npm run dev           # Voice chat on :8045
npm run dev:admin     # Admin on :8046
```

---

## Technology Stack

### Voice Processing
- **OpenAI GPT-4o Realtime API**: Real-time voice conversation
- **OpenAI Whisper**: Speech-to-text transcription
- **OpenAI TTS**: Text-to-speech with 8 voice options
- **WebSocket**: Bidirectional audio streaming

### Key Differentiator
This is **NOT** keyword/intent matching like Alexa or Google Assistant. It's pure AI understanding - the model comprehends context, nuance, and can handle any conversation flow naturally.

---

## Training Modes

### AI Sells Mode (Default)
The AI acts as a professional automotive salesperson using:
- Discovery questions before pitching
- Need-based vehicle recommendations
- Objection handling
- Multiple closing strategies

User practices **resisting** sales pressure and recognizing techniques.

### User Sells Mode
The AI acts as a potential car buyer with difficulty levels:

| Difficulty | Behavior |
|------------|----------|
| Easy | Friendly, few objections, buys quickly |
| Medium | Needs convincing, raises 2-3 objections |
| Hard | Skeptical, challenges claims, requires excellent pitch |
| Expert | Dismissive, impatient, extremely tough to close |

User practices **making** sales and handling objections.

---

## How the AI Works

### 1. Discovery Phase
The AI *never* starts by pushing a vehicle.

Instead, it asks questions like:
- "What will you primarily be using this vehicle for?"
- "How many passengers do you typically need to accommodate?"
- "Are you looking for something fuel-efficient or more powerful?"
- "Do you have a budget range in mind?"

This establishes **context + emotional value**, the core of persuasive selling.

---

### 2. Vehicle Selection
After discovery, the AI recommends vehicles based on needs:

| Customer Need | AI Recommendation |
|--------------|-------------------|
| Family of 5, road trips | Ford Explorer with 3rd row |
| Towing boat, work truck | F-150 with tow package |
| Fuel efficiency, commuter | Maverick Hybrid |
| Performance enthusiast | Mustang GT |
| Off-road adventure | Bronco Outer Banks |

---

### 3. Positioning
The AI frames the vehicle based on discovered needs:

| User Need | AI Selling Angle |
|----------|------------------|
| Safety | Frame SYNC 4 and Co-Pilot360 features |
| Value | Emphasize fuel savings and resale value |
| Status | Highlight trim level, appearance package |
| Practicality | Focus on cargo space, towing, versatility |

---

### 4. Persuasion Techniques Used
- **Scarcity**: "This is the only one in this color we have left."
- **Urgency**: "The 0% APR offer ends this month."
- **Authority**: "The F-150 has been #1 for 46 years."
- **Social Proof**: "Most families choose the Explorer."
- **Future Pacing**: "Picture your family on that road trip..."

---

### 5. Closing Strategies
The AI cycles through:
- **Assumptive closes**: "Do you prefer the Oxford White or Carbonized Gray?"
- **Payment closes**: "Based on your trade-in, we're at $450/month."
- **Today closes**: "I can include the bed liner if we finalize today."
- **Test drive closes**: "Let's take it for a spin so you can feel the difference."

---

## Outcome Detection

The app uses **AI-powered analysis** to detect outcomes:

### Sale Made
- Customer agrees to purchase ("yes", "let's do it", "I'll take it")
- Customer agrees to financing terms
- In User Sells mode: AI customer agrees to buy

### No Sale
- Customer declines ("no thanks", "not interested")
- Customer exits session ("goodbye", "I need to think about it")
- In User Sells mode: User gives up ("I quit")

**Popup notifications** appear immediately when outcomes are detected.

---

## Vehicle Inventory

The system includes a seeded inventory of Ford vehicles:

| Vehicle | Body Style | Starting Price |
|---------|------------|----------------|
| F-150 XLT | Truck | $49,995 |
| Mustang GT | Coupe | $53,495 |
| Bronco Outer Banks | SUV | $47,395 |
| Explorer ST | SUV | $54,995 |
| Maverick Hybrid | Truck | $27,995 |
| Mustang Mach-E GT | Electric SUV | $57,995 |
| Ranger Raptor | Truck | $56,980 |

Each vehicle includes specs, features, images, and descriptions the AI uses during conversations.

---

## Language Support

- **15+ languages** supported
- AI **automatically responds in whatever language the user speaks**
- No configuration needed - speak Spanish, get Spanish responses

---

## Technical Architecture

### Core Components
- Real-time voice conversation via WebSocket
- State tracking for sales phases
- Vehicle inventory integration
- AI-powered outcome detection (not keyword matching)
- Configurable voices, difficulty, and techniques

### Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: Prisma + SQLite
- **AI**: OpenAI GPT-4o Realtime API
- **Frontend**: EJS + Bootstrap 5

---

## Example User Flows

### AI Sells Mode
**User:** Sell me a car.
**AI:** "I'd be happy to help! Before I make any recommendations, what will you primarily be using the vehicle for - commuting, family trips, work?"

(User answers: family road trips)

**AI:** "Great! How many passengers do you typically need to accommodate?"

(User answers: 5)

**AI:** "Perfect. The Explorer has been our most popular family vehicle - three rows of seating, plenty of cargo space, and the ST model gives you 400 horsepower for those highway merges. Plus it gets better fuel economy than you'd expect."

**AI closes:** "Would you like to see it in Atlas Blue or Oxford White?"

### User Sells Mode (Hard Difficulty)
**AI:** "I'm looking for a truck, but I'm not sure I want to spend that much."
**User:** "What will you be using the truck for?"
**AI:** "Mostly weekend projects, maybe towing a small boat."
**User:** "The Maverick might be perfect - it's our most affordable truck, starts under $28K, and the hybrid gets 42 MPG city."
**AI:** "Hmm, that's interesting. But is it really a real truck?"

---

## Admin Features

- **Dashboard**: Stats, conversion rates, recent sessions
- **Sessions**: Full conversation transcripts
- **Analytics**: Technique performance, objection patterns
- **Vehicles**: Full inventory management
- **Voices**: 8 voice options, difficulty levels
- **Techniques**: Enable/disable sales approaches
- **Discovery**: Customize questions
- **Objections**: Handle common pushback
- **AI Config**: System prompts, phase prompts

---

## Test Scenarios

Use these to evaluate sales skills:

- "Help me find a family SUV under $50K."
- "I need a truck that can tow 10,000 lbs."
- "I want something fuel efficient but not boring."
- "Convince me to buy the Mustang instead of a Camaro."
- "My budget is only $400/month - what can I get?"
- "I need to talk to my spouse first."

---

## Expansion Ideas (Future Roadmap)
- Finance calculator integration
- Trade-in value estimation
- Real-time inventory sync from DMS
- CRM lead capture
- Sales team leaderboards
- Gamified assessment with scoring
- Service department training mode
- F&I product training

---

## License
MIT - Free to use, modify, and expand.

---

## Final Notes
This MVP showcases:
- Automotive sales psychology
- Voice AI conversation design
- Adaptive vehicle recommendations
- Real-time outcome detection
- Inventory-aware AI responses

It can be used for:
- Sales team training programs
- New hire onboarding
- Interview assessments
- Customer engagement prototypes
- AI agent demos

---

**Train your team with AI-powered automotive sales practice!**
