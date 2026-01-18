# AI-Powered Sale Detection

This document explains how the system uses AI analysis to detect sale outcomes, understanding context, nuance, and conversational intent rather than simple keyword matching.

---

## Current Approach: AI Analysis

The system uses GPT to analyze conversations and determine outcomes:

```typescript
export async function analyzeSaleOutcome(
  messages: Array<{ role: string; content: string }>
): Promise<AnalysisResult> {
  // AI analyzes full conversation context
  // Returns: SALE_CONFIRMED, SALE_DENIED, or UNDECIDED
}
```

**Advantages over keyword matching:**
- Understands context: "I would never buy that" vs "I'll buy that"
- Detects sarcasm: "Oh yeah, I'll DEFINITELY buy that truck" (sarcastic)
- Handles nuance: "I mean, I guess?" is not a commitment
- Knows what question was asked before the answer

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Message                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              OpenAI Realtime API (GPT-4o)                   │
│                   (Handles conversation)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Sale Detection Analysis                        │
│         (Separate GPT call to analyze outcome)              │
│                                                             │
│   Input: Last 5-10 messages of conversation                 │
│   Output: SALE_CONFIRMED | SALE_DENIED | UNDECIDED          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Trigger Appropriate Action                     │
│         (Show popup, update database, etc.)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation

### Analysis Function

```typescript
// src/services/saleAnalyzer.ts

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type SaleOutcome = 'SALE_CONFIRMED' | 'SALE_DENIED' | 'UNDECIDED';

interface AnalysisResult {
  outcome: SaleOutcome;
  confidence: number;  // 0-100
  reasoning: string;
}

export async function analyzeSaleOutcome(
  messages: Array<{ role: string; content: string }>
): Promise<AnalysisResult> {

  const systemPrompt = `You are a sales conversation analyzer for an automotive dealership. Your job is to determine if a customer has committed to purchasing, financing, or leasing a vehicle.

IMPORTANT DISTINCTIONS:
- Interest ("I like that truck", "sounds good") is NOT a commitment
- A sale is ONLY confirmed when the customer explicitly agrees to purchase, finance, lease, or reserve
- The salesperson must have ASKED a closing question
- The customer must have given an affirmative response to that specific question

ANALYZE the conversation and return ONLY a JSON object:
{
  "outcome": "SALE_CONFIRMED" | "SALE_DENIED" | "UNDECIDED",
  "confidence": <0-100>,
  "reasoning": "<brief explanation>"
}

SALE_CONFIRMED: Customer explicitly agreed to buy/finance/lease/reserve after being asked
SALE_DENIED: Customer explicitly declined to purchase
UNDECIDED: Conversation is ongoing, no clear commitment either way

Be conservative - when in doubt, return UNDECIDED.`;

  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this sales conversation:\n\n${conversationText}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 200
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');

  return {
    outcome: result.outcome || 'UNDECIDED',
    confidence: result.confidence || 0,
    reasoning: result.reasoning || 'Unable to analyze'
  };
}
```

---

## Example Scenarios

### Scenario 1: Clear Sale
```
ASSISTANT: So we're looking at $495 a month for the F-150 XLT with everything you wanted. Ready to get the paperwork started?
USER: Yes, let's do it.

Analysis: {
  "outcome": "SALE_CONFIRMED",
  "confidence": 95,
  "reasoning": "Customer explicitly agreed ('Yes, let's do it') to the closing question about starting paperwork."
}
```

### Scenario 2: Interest but No Commitment
```
ASSISTANT: The Bronco Outer Banks comes with the Sasquatch package. What do you think?
USER: That's pretty cool, I like that.

Analysis: {
  "outcome": "UNDECIDED",
  "confidence": 85,
  "reasoning": "Customer expressed interest but no closing question was asked. 'I like that' is preference, not purchase commitment."
}
```

### Scenario 3: Polite Decline
```
ASSISTANT: Would you like to put a deposit down to hold this Mustang?
USER: I appreciate the help, but I think I'm going to keep looking.

Analysis: {
  "outcome": "SALE_DENIED",
  "confidence": 90,
  "reasoning": "Customer politely declined the closing question with 'I'm going to keep looking'."
}
```

### Scenario 4: Sarcasm Detection
```
ASSISTANT: This Explorer has everything you need!
USER: Oh sure, a $60,000 SUV is exactly what my budget needs right now.

Analysis: {
  "outcome": "UNDECIDED",
  "confidence": 75,
  "reasoning": "Response appears sarcastic based on context about budget concerns. No genuine purchase interest detected."
}
```

### Scenario 5: Ambiguous Response
```
ASSISTANT: Ready to take the F-150 home today?
USER: I mean, I guess we could...

Analysis: {
  "outcome": "UNDECIDED",
  "confidence": 60,
  "reasoning": "Response is hesitant and ambiguous. Not a clear commitment - salesperson should clarify before proceeding."
}
```

### Scenario 6: Test Drive Agreement (Not a Sale)
```
ASSISTANT: Would you like to take the Bronco for a test drive?
USER: Yes, absolutely!

Analysis: {
  "outcome": "UNDECIDED",
  "confidence": 95,
  "reasoning": "Customer agreed to a test drive, not a purchase. Conversation is progressing but no sale commitment yet."
}
```

### Scenario 7: Financing Commitment
```
ASSISTANT: Based on your credit, we can do 4.9% for 72 months, putting you at $520 a month. Does that work?
USER: Yes, that works for me. Let's do the paperwork.

Analysis: {
  "outcome": "SALE_CONFIRMED",
  "confidence": 98,
  "reasoning": "Customer explicitly agreed to the financing terms and requested to proceed with paperwork."
}
```

---

## Performance Optimization

### Async Analysis (Non-Blocking)

```typescript
// Fire and forget - don't block the conversation
analyzeSaleOutcome(messages).then(analysis => {
  if (analysis.confidence >= 80 && analysis.outcome !== 'UNDECIDED') {
    handleSaleOutcome(analysis.outcome);
  }
}).catch(err => logger.error(err, 'Sale analysis failed'));
```

### Debounced Analysis

```typescript
// Only analyze after 2 seconds of silence
let analysisTimeout: NodeJS.Timeout | null = null;

function scheduleAnalysis() {
  if (analysisTimeout) clearTimeout(analysisTimeout);

  analysisTimeout = setTimeout(async () => {
    const analysis = await analyzeSaleOutcome(messages);
    // Handle result...
  }, 2000);
}
```

---

## Cost & Performance

| Approach | Latency | Cost per Analysis | Accuracy |
|----------|---------|-------------------|----------|
| Keyword Matching | <1ms | $0 | Low |
| GPT-4o-mini | 300-800ms | ~$0.0001 | High |
| GPT-4o | 500-1500ms | ~$0.001 | Very High |

### Recommendations

1. **Development/Testing**: Use GPT-4o for best accuracy
2. **Production**: Use GPT-4o-mini with confidence threshold
3. **High-Volume**: Consider caching common patterns + AI fallback

---

## Hybrid Approach (Best of Both)

```typescript
async function detectSaleOutcome(
  text: string,
  messages: Message[]
): Promise<SaleOutcome> {

  // Fast path: Check for obvious keywords first
  const obviousYes = ['yes i\'ll buy', 'let\'s do it', 'i\'ll take it', 'where do i sign'];
  const obviousNo = ['no thanks', 'not interested', 'i\'ll pass', 'not today'];

  const lowerText = text.toLowerCase();

  if (obviousYes.some(kw => lowerText.includes(kw))) {
    return 'SALE_CONFIRMED';
  }

  if (obviousNo.some(kw => lowerText.includes(kw))) {
    return 'SALE_DENIED';
  }

  // Slow path: AI analysis for ambiguous cases
  const analysis = await analyzeSaleOutcome(messages);

  if (analysis.confidence >= 80) {
    return analysis.outcome;
  }

  return 'UNDECIDED';
}
```

---

## Summary

| Feature | Keyword Matching | AI Analysis |
|---------|-----------------|-------------|
| Speed | Instant | 300-1500ms |
| Cost | Free | ~$0.0001-0.001/analysis |
| Context Awareness | None | Full conversation |
| Sarcasm Detection | No | Yes |
| Nuance Handling | No | Yes |
| Ambiguity Handling | No | Yes (with confidence) |
| Maintenance | Manual keyword updates | Self-improving |

The AI approach transforms sale detection from pattern matching to true understanding, enabling the system to handle the infinite ways customers express agreement or disagreement in automotive sales conversations.
