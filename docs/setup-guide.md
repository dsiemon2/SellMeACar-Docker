# Setup Guide - Ford Auto Sales

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key with access to GPT-4o Realtime API

## Installation

### 1. Install Dependencies

```bash
cd SellMeACar
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
notepad .env  # Windows
nano .env     # Mac/Linux
```

Required settings:
```env
OPENAI_API_KEY=sk-your-key-here
ADMIN_TOKEN=choose-a-secure-token
```

### 3. Initialize Database

```bash
# Create database and tables
npx prisma db push

# Seed with initial data (vehicles, techniques, etc.)
npx prisma db seed
```

### 4. Start the Application

**Option A: Development Mode (with auto-reload)**
```bash
# Terminal 1 - Chat server
npm run dev

# Terminal 2 - Admin server
npm run dev:admin
```

**Option B: Production Mode**
```bash
# Build TypeScript
npm run build

# Start servers
npm start
npm run start:admin
```

## Accessing the App

- **Voice Chat Interface**: http://localhost:8045
- **Admin Panel**: http://localhost:8046/admin?token=YOUR_TOKEN

## First Run Checklist

1. Open the admin panel
2. Go to **Dealership**:
   - Set dealership name and location
   - Configure contact information
   - Set branding colors
3. Go to **Vehicles**:
   - Review the seeded Ford inventory
   - Add/edit vehicles as needed
   - Upload vehicle images
4. Go to **Voices & Languages**:
   - Choose Sales Mode (AI Sells or User Sells)
   - Set difficulty level (if User Sells mode)
   - Select preferred voice
5. Review and customize the **Greeting** message
6. Enable/disable **Sales Techniques** as desired
7. Test the voice chat interface

## Testing the App

### AI Sells Mode
1. Open http://localhost:8045
2. Allow microphone access when prompted
3. Wait for "Connected" status
4. Say "Sell me a car"
5. Interact with the AI salesperson via voice
6. Try saying "yes, I'll take it" or "no thanks" to see outcome popups

### User Sells Mode
1. Set mode to "User Sells" in admin panel
2. Open http://localhost:8045
3. Allow microphone access
4. AI will introduce itself as a customer looking for a vehicle
5. Pitch vehicles using your sales skills
6. Try to convince the AI to buy
7. Say "I give up" or keep trying until AI decides

## Common Issues

### "WebSocket connection failed"
- Ensure the chat server is running on port 8045
- Check for firewall blocking WebSocket connections
- Try a different browser (Chrome recommended)

### "Microphone not working"
- Allow microphone permissions in browser
- Check system microphone settings
- Ensure no other app is using the microphone

### "OpenAI API error"
- Verify your API key in `.env`
- Ensure API key has access to GPT-4o Realtime API
- Check you have API credits

### "AI responds in wrong language"
- This is fixed - AI now matches your spoken language
- If still occurring, start a new session

### "No popup when saying bye"
- Popup should appear when session ends without sale
- Check browser console for errors
- Ensure WebSocket connection is active

### "Database error"
- Run `npx prisma db push` to sync schema
- Run `npx prisma db seed` for initial data

### Admin panel shows "Unauthorized"
- Check the `token` query parameter matches `ADMIN_TOKEN` in `.env`

### "Vehicle images not loading"
- Ensure image URLs are valid and accessible
- Check for CORS issues with external image hosts
- Use Unsplash or other CORS-friendly image sources

## Database Management

```bash
# View database in browser
npx prisma studio

# Reset database (deletes all data!)
rm prisma/dev.db
npx prisma db push
npx prisma db seed

# Run migrations (if schema changed)
npx prisma migrate dev
```

## Customization Tips

### Change the Dealership
1. Go to Admin > Dealership
2. Update name, location, contact info
3. Set your brand type (Ford, multi-brand, etc.)
4. The AI will use the new dealership info immediately

### Manage Vehicle Inventory
1. Go to Admin > Vehicles
2. Add new vehicles with images and specs
3. Import from CSV for bulk additions
4. Set featured vehicles for AI to highlight

### Add New Discovery Questions
1. Go to Admin > Discovery Questions
2. Add questions that reveal customer needs
3. Map to target needs (budget, family, utility, etc.)

### Modify AI Behavior
1. Go to Admin > AI Config
2. Edit the system prompt
3. Adjust phase-specific prompts

### Change Voice
1. Go to Admin > Voices & Languages
2. Click on desired voice card
3. Voice changes immediately for new sessions

### Adjust Difficulty
1. Go to Admin > Voices & Languages
2. Set mode to "User Sells"
3. Select difficulty level (Easy/Medium/Hard/Expert)

## Security Notes

- Change `ADMIN_TOKEN` to something secure
- Don't expose admin port publicly without authentication
- API keys should never be committed to git
- Use HTTPS in production

## Logs

Server logs are output to console using Pino logger. For production:
```bash
npm run dev 2>&1 | tee app.log
```

## Updating

```bash
git pull
npm install
npx prisma db push
npm run build
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key |
| `DATABASE_URL` | No | `file:./dev.db` | SQLite database path |
| `PORT` | No | `8045` | Chat server port |
| `ADMIN_PORT` | No | `8046` | Admin server port |
| `ADMIN_TOKEN` | Yes | - | Admin panel auth token |
