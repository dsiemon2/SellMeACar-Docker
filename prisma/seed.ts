import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Ford Auto Sales...');

  // Dealership Configuration
  await prisma.dealershipConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'City Ford',
      location: '1234 Auto Drive, Springfield, IL 62701',
      phone: '(555) 123-4567',
      email: 'sales@cityford.com',
      website: 'https://cityford.com',
      dealershipType: 'ford',
      tagline: 'Built Ford Tough - Serving Springfield Since 1985',
      primaryColor: '#003478'
    }
  });

  // App Configuration
  const successKeywordsArray = [
    "i'll buy it", "i'll buy one", "i'll take it", "i will buy", "i will buy it",
    "i'm buying", "i'm buying it", "i want to buy", "i'd like to buy",
    "i want this car", "i want this truck", "i want this vehicle",
    "i'll take the car", "i'll take the truck", "i'll take the vehicle",
    "let's do the financing", "i'll finance it", "i want to finance",
    "let's do the lease", "i'll lease it", "i want to lease",
    "let's write it up", "draw up the papers", "let's do the paperwork",
    "where do i sign", "i'm ready to sign", "let's sign the papers",
    "i'll trade in my car", "let's do the trade", "trade mine in",
    "yes with my trade-in", "include my trade",
    "order it for me", "order one for me", "put one aside", "reserve it",
    "reserve one for me", "hold this one", "save this one for me",
    "place the order", "submit the order",
    "take my money", "here's my deposit", "i'll put down a deposit",
    "let me pay", "ready to pay", "charge my card", "run my card",
    "what's my monthly payment", "i can do that payment",
    "sold", "i'm sold", "you sold me", "you got me",
    "you convinced me", "i'm convinced", "that convinced me",
    "sign me up", "i'm in", "count me in", "deal", "you got a deal",
    "it's a deal", "we have a deal", "done", "let's do it",
    "make it happen", "hook me up", "set me up",
    "yes i'll buy", "yes i'll take", "yes i want it", "yes reserve it",
    "yes please", "yes order it", "yeah i'll take it",
    "sure i'll take it", "ok let's do it", "alright i'll buy it",
    "this is the one", "this is my truck", "this is my car",
    "i love this f-150", "i want this mustang", "this bronco is mine"
  ];

  const objectionKeywordsArray = [
    "don't want it", "do not want it", "i won't buy", "will not buy",
    "not buying", "i'm not buying", "refuse to buy", "won't be buying",
    "not for me", "isn't for me", "not the right car", "not the right truck",
    "not what i'm looking for", "doesn't fit my needs",
    "no thanks", "no thank you", "i'll pass", "gonna pass",
    "i'm good", "i'm fine", "i'm okay", "i'm all set",
    "not interested", "i'm not interested", "doesn't interest me",
    "not really interested",
    "don't need it", "don't need a new car", "don't need a truck",
    "i have no need", "my current car is fine",
    "absolutely not", "definitely not", "no way", "hell no", "nope",
    "never", "forget it", "not happening", "hard pass", "hard no",
    "too expensive", "way too expensive", "too much", "too much money",
    "can't afford", "out of my budget", "over my budget",
    "not worth it", "not worth the price", "payments too high",
    "monthly payment too high", "can't swing that payment",
    "not today", "not now", "not right now", "maybe another time",
    "let me think about it", "need to think", "need more time",
    "not ready yet", "still shopping around",
    "i'm done", "we're done", "i'm out", "i'm leaving",
    "i'll go elsewhere", "try another dealer"
  ];

  await prisma.appConfig.upsert({
    where: { id: 'default' },
    update: {
      appName: 'Ford Auto Sales - AI Training',
      greeting: 'Welcome to {dealership_name}! I\'m your Ford sales specialist. Whether you\'re looking for a rugged F-150, an iconic Mustang, or a versatile Bronco, I\'m here to help. We also offer great financing, leasing options, and top dollar for trade-ins. What brings you in today?',
      triggerPhrase: 'sell me a car',
      aiPersona: 'friendly, knowledgeable Ford automotive sales specialist',
      successKeywords: JSON.stringify(successKeywordsArray),
      objectionKeywords: JSON.stringify(objectionKeywordsArray)
    },
    create: {
      id: 'default',
      appName: 'Ford Auto Sales - AI Training',
      greeting: 'Welcome to {dealership_name}! I\'m your Ford sales specialist. Whether you\'re looking for a rugged F-150, an iconic Mustang, or a versatile Bronco, I\'m here to help. We also offer great financing, leasing options, and top dollar for trade-ins. What brings you in today?',
      triggerPhrase: 'sell me a car',
      selectedVoice: 'alloy',
      aiPersona: 'friendly, knowledgeable Ford automotive sales specialist',
      successKeywords: JSON.stringify(successKeywordsArray),
      objectionKeywords: JSON.stringify(objectionKeywordsArray),
      maxClosingAttempts: 3
    }
  });

  // Sample Ford Vehicles
  const vehicles = [
    { year: 2024, make: 'Ford', model: 'F-150', trim: 'XLT SuperCrew', bodyStyle: 'truck', exteriorColor: 'Oxford White', interiorColor: 'Black', mileage: 0, condition: 'new', msrp: 52995, salePrice: 49995, engine: '3.5L V6 EcoBoost', transmission: 'automatic', drivetrain: '4wd', fuelType: 'gasoline', mpgCity: 20, mpgHighway: 26, features: JSON.stringify(['360-Degree Camera', 'Pro Trailer Backup Assist', 'SYNC 4']), images: JSON.stringify(['https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80']), description: 'America\'s best-selling truck for over 45 years.', status: 'available', featured: true, stockNumber: 'F150-001', vin: '1FTFW1E85NFA00001' },
    { year: 2024, make: 'Ford', model: 'Mustang', trim: 'GT Premium', bodyStyle: 'coupe', exteriorColor: 'Race Red', interiorColor: 'Ebony', mileage: 0, condition: 'new', msrp: 54995, salePrice: 53495, engine: '5.0L V8', transmission: 'manual', drivetrain: 'rwd', fuelType: 'gasoline', mpgCity: 15, mpgHighway: 24, features: JSON.stringify(['MagneRide Damping', 'Brembo Brakes', 'SYNC 4']), images: JSON.stringify(['https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80']), description: 'The legendary Mustang GT with the iconic 5.0L V8 Coyote engine.', status: 'available', featured: true, stockNumber: 'MUS-001', vin: '1FA6P8CF2N5100001' },
    { year: 2024, make: 'Ford', model: 'Bronco', trim: 'Outer Banks', bodyStyle: 'suv', exteriorColor: 'Cactus Gray', interiorColor: 'Navy Pier', mileage: 0, condition: 'new', msrp: 48895, salePrice: 47395, engine: '2.7L V6 EcoBoost', transmission: 'automatic', drivetrain: '4wd', fuelType: 'gasoline', mpgCity: 18, mpgHighway: 22, features: JSON.stringify(['Removable Roof', 'GOAT Modes', 'SYNC 4']), images: JSON.stringify(['https://images.unsplash.com/photo-1686715692509-8cb69d40d081?w=800&q=80']), description: 'The legendary Ford Bronco is back!', status: 'available', featured: true, stockNumber: 'BRO-001', vin: '1FMDE5BH4NBA00001' },
    { year: 2024, make: 'Ford', model: 'Explorer', trim: 'ST', bodyStyle: 'suv', exteriorColor: 'Atlas Blue', interiorColor: 'Ebony', mileage: 0, condition: 'new', msrp: 56650, salePrice: 54995, engine: '3.0L V6 EcoBoost', transmission: 'automatic', drivetrain: 'awd', fuelType: 'gasoline', mpgCity: 18, mpgHighway: 24, features: JSON.stringify(['400HP Twin-Turbo V6', 'ST-Tuned Suspension']), images: JSON.stringify(['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80']), description: 'The Explorer ST delivers thrilling performance with 400 horsepower.', status: 'available', featured: false, stockNumber: 'EXP-001', vin: '1FM5K8GC2NGA00001' },
    { year: 2024, make: 'Ford', model: 'Maverick', trim: 'XLT Hybrid', bodyStyle: 'truck', exteriorColor: 'Area 51', interiorColor: 'Medium Dark Slate', mileage: 0, condition: 'new', msrp: 28495, salePrice: 27995, engine: '2.5L Hybrid', transmission: 'cvt', drivetrain: 'fwd', fuelType: 'hybrid', mpgCity: 42, mpgHighway: 33, features: JSON.stringify(['Hybrid Powertrain', 'FLEXBED']), images: JSON.stringify(['https://images.unsplash.com/photo-1631433048456-42126b541bfb?w=800&q=80']), description: 'The Maverick Hybrid gets an incredible 42 MPG city.', status: 'available', featured: false, stockNumber: 'MAV-001', vin: '3FTTW8E31NRA00001' },
    { year: 2023, make: 'Ford', model: 'F-150', trim: 'Lariat', bodyStyle: 'truck', exteriorColor: 'Iconic Silver', interiorColor: 'Black Onyx', mileage: 12500, condition: 'certified_preowned', msrp: 58995, salePrice: 44995, engine: '3.5L V6 EcoBoost', transmission: 'automatic', drivetrain: '4wd', fuelType: 'gasoline', mpgCity: 18, mpgHighway: 24, features: JSON.stringify(['Leather Seats', 'Heated/Cooled Seats']), images: JSON.stringify(['https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=800&q=80']), description: 'Certified Pre-Owned Lariat with remaining factory warranty.', status: 'available', featured: false, stockNumber: 'CPO-001', vin: '1FTFW1E85NFA00002' },
    { year: 2024, make: 'Ford', model: 'Mustang Mach-E', trim: 'GT', bodyStyle: 'suv', exteriorColor: 'Grabber Blue', interiorColor: 'Space Gray', mileage: 0, condition: 'new', msrp: 62995, salePrice: 59995, specialPrice: 57995, engine: 'Dual Electric Motors', transmission: 'automatic', drivetrain: 'awd', fuelType: 'electric', mpgCity: 91, mpgHighway: 84, features: JSON.stringify(['480HP Dual Motors', 'Extended Range Battery']), images: JSON.stringify(['https://images.unsplash.com/photo-1610286304581-c185b49486ec?w=800&q=80']), description: 'The all-electric Mach-E GT delivers 480 horsepower with instant torque.', status: 'available', featured: true, stockNumber: 'MACHE-001', vin: '3FMTK4SE4NMA00001' },
    { year: 2024, make: 'Ford', model: 'Ranger', trim: 'Raptor', bodyStyle: 'truck', exteriorColor: 'Code Orange', interiorColor: 'Onyx/Orange', mileage: 0, condition: 'new', msrp: 56980, salePrice: 56980, engine: '3.0L V6 EcoBoost', transmission: 'automatic', drivetrain: '4wd', fuelType: 'gasoline', mpgCity: 16, mpgHighway: 18, features: JSON.stringify(['FOX Shocks', 'Terrain Management']), images: JSON.stringify(['https://images.unsplash.com/photo-1574667283463-546e27f71483?w=800&q=80']), description: 'The Ranger Raptor brings F-150 Raptor DNA to a mid-size package.', status: 'available', featured: false, stockNumber: 'RAP-001', vin: '1FTER4FH4NLD00001' }
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({ where: { vin: vehicle.vin }, update: vehicle, create: vehicle });
  }

  // Discovery Questions
  const discoveryQuestions = [
    { question: 'What will you primarily be using the vehicle for?', purpose: 'Identifies primary use case', followUp: 'How many miles do you typically drive?', targetNeed: 'utility' },
    { question: 'Are you looking to buy, lease, or still deciding?', purpose: 'Determines financing approach', followUp: 'What monthly payment range works best?', targetNeed: 'budget' },
    { question: 'Do you have a vehicle to trade in today?', purpose: 'Identifies trade-in opportunity', followUp: 'What are you currently driving?', targetNeed: 'budget' },
    { question: 'How important is fuel efficiency versus power?', purpose: 'Determines powertrain preferences', followUp: 'Have you considered our hybrid options?', targetNeed: 'efficiency' }
  ];

  for (let i = 0; i < discoveryQuestions.length; i++) {
    await prisma.discoveryQuestion.upsert({ where: { id: `discovery-${i}` }, update: discoveryQuestions[i], create: { id: `discovery-${i}`, ...discoveryQuestions[i], sortOrder: i } });
  }

  // Positioning Angles
  const positioningAngles = [
    { userNeed: 'family', headline: 'Space for the Whole Family', pitch: 'Three rows of seating and best-in-class cargo space.', emotionalHook: 'Picture your family\'s next adventure...' },
    { userNeed: 'performance', headline: 'Unleash the Power', pitch: '400+ horsepower and precision handling.', emotionalHook: 'Feel that V8 rumble...' },
    { userNeed: 'efficiency', headline: 'Save at Every Fill-Up', pitch: 'Industry-leading fuel economy.', emotionalHook: 'Imagine cutting your fuel costs in half...' },
    { userNeed: 'utility', headline: 'Built for Whatever You Need', pitch: 'Best-in-class towing and payload.', emotionalHook: 'Think about all the projects you could tackle...' },
    { userNeed: 'budget', headline: 'Smart Value, No Compromises', pitch: 'More features for your money.', emotionalHook: 'Drive away without exceeding your budget...' },
    { userNeed: 'safety', headline: 'Protect What Matters Most', pitch: 'Ford Co-Pilot360 and top safety ratings.', emotionalHook: 'Peace of mind is priceless...' }
  ];

  for (const angle of positioningAngles) {
    await prisma.positioningAngle.upsert({ where: { userNeed: angle.userNeed }, update: angle, create: angle });
  }

  // Sales Techniques
  const salesTechniques = [
    { name: 'needs_assessment', category: 'discovery', description: 'Ask about lifestyle to identify needs', script: 'Tell me about your typical day.', enabled: true },
    { name: 'benefit_selling', category: 'positioning', description: 'Focus on benefits, not features', script: 'The Ford Co-Pilot360 means you can relax...', enabled: true },
    { name: 'test_drive_close', category: 'positioning', description: 'Get them behind the wheel', script: 'The best way to see if this is your truck is to drive it.', enabled: true },
    { name: 'assumptive_close', category: 'closing', description: 'Assume the sale and move to details', script: 'Which color speaks to you more?', enabled: true },
    { name: 'feel_felt_found', category: 'objection_handling', description: 'Empathize, relate, resolve', script: 'I understand how you feel. Many customers have felt the same way.', enabled: true }
  ];

  for (let i = 0; i < salesTechniques.length; i++) {
    await prisma.salesTechnique.upsert({ where: { name: salesTechniques[i].name }, update: salesTechniques[i], create: { ...salesTechniques[i], sortOrder: i } });
  }

  // Closing Strategies
  const closingStrategies = [
    { name: 'test_drive_close', type: 'soft', script: 'Want to take it for a spin?', useWhen: 'Customer shows strong interest' },
    { name: 'payment_close', type: 'direct', script: 'We\'re looking at about $450 a month. Does that work?', useWhen: 'After discussing financing' },
    { name: 'direct_ask', type: 'direct', script: 'Are you ready to make it yours today?', useWhen: 'After comprehensive needs assessment' }
  ];

  for (const strategy of closingStrategies) {
    await prisma.closingStrategy.upsert({ where: { name: strategy.name }, update: strategy, create: strategy });
  }

  // Objection Handlers
  const objectionHandlers = [
    { objection: 'too expensive', category: 'price', response: 'Let me show you our financing options.', technique: 'payment_reframe' },
    { objection: 'need to think about it', category: 'timing', response: 'What specific aspects are you wanting to think over?', technique: 'isolate' },
    { objection: 'want to shop around', category: 'competition', response: 'What other vehicles are you considering?', technique: 'comparison_selling' }
  ];

  for (let i = 0; i < objectionHandlers.length; i++) {
    await prisma.objectionHandler.upsert({ where: { id: `objection-${i}` }, update: objectionHandlers[i], create: { id: `objection-${i}`, ...objectionHandlers[i] } });
  }

  // AI Prompt Configuration
  const systemPrompt = `You are a professional Ford automotive sales specialist. Help customers find the perfect Ford vehicle.`;

  await prisma.aIPromptConfig.upsert({
    where: { name: 'default' },
    update: { systemPrompt, closingPrompt: 'Always ask for commitment explicitly.', discoveryPrompt: 'Focus on understanding needs.', positioningPrompt: 'Position based on discovered needs.' },
    create: { name: 'default', systemPrompt, discoveryPrompt: 'Focus on understanding needs.', positioningPrompt: 'Position based on discovered needs.', closingPrompt: 'Always ask for commitment explicitly.', enabled: true }
  });

  // Languages
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', enabled: true },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', enabled: true }
  ];

  for (const lang of languages) {
    await prisma.language.upsert({ where: { code: lang.code }, update: lang, create: lang });
  }

  // ============================================
  // SAMPLE SESSIONS - Demo conversation data
  // ============================================
  const sampleSessions = [
    { id: 'session-1', sessionId: 'demo-session-001', userName: 'John Smith', startedAt: new Date(Date.now() - 86400000 * 2), endedAt: new Date(Date.now() - 86400000 * 2 + 1800000), outcome: 'sale_made', saleConfirmed: true, currentPhase: 'completed', userNeeds: JSON.stringify({ family: true, utility: true }), techniquesUsed: JSON.stringify(['needs_assessment', 'benefit_selling']), closingAttempts: 2, vehicleInterest: 'F150-001' },
    { id: 'session-2', sessionId: 'demo-session-002', userName: 'Sarah Johnson', startedAt: new Date(Date.now() - 86400000), endedAt: new Date(Date.now() - 86400000 + 2400000), outcome: 'sale_made', saleConfirmed: true, currentPhase: 'completed', userNeeds: JSON.stringify({ performance: true }), techniquesUsed: JSON.stringify(['storytelling']), closingAttempts: 1, vehicleInterest: 'MUS-001' },
    { id: 'session-3', sessionId: 'demo-session-003', userName: 'Mike Davis', startedAt: new Date(Date.now() - 43200000), endedAt: new Date(Date.now() - 43200000 + 1200000), outcome: 'no_sale', saleConfirmed: false, currentPhase: 'completed', userNeeds: JSON.stringify({ budget: 25000 }), techniquesUsed: JSON.stringify(['budget_qualification']), closingAttempts: 3, vehicleInterest: 'MAV-001' },
    { id: 'session-4', sessionId: 'demo-session-004', userName: 'Emily Chen', startedAt: new Date(Date.now() - 7200000), endedAt: new Date(Date.now() - 7200000 + 900000), outcome: 'sale_made', saleConfirmed: true, currentPhase: 'completed', userNeeds: JSON.stringify({ family: true, safety: true }), techniquesUsed: JSON.stringify(['benefit_selling']), closingAttempts: 1, vehicleInterest: 'EXP-001' },
    { id: 'session-5', sessionId: 'demo-session-005', userName: 'Robert Wilson', startedAt: new Date(Date.now() - 3600000), endedAt: null, outcome: 'in_progress', saleConfirmed: false, currentPhase: 'discovery', userNeeds: JSON.stringify({}), techniquesUsed: JSON.stringify([]), closingAttempts: 0, vehicleInterest: null }
  ];

  for (const session of sampleSessions) {
    await prisma.salesSession.upsert({ where: { sessionId: session.sessionId }, update: session, create: session });
  }

  // Sample Messages
  const sampleMessages = [
    { sessionId: 'session-1', role: 'assistant', content: 'Welcome to City Ford! What brings you in today?', phase: 'greeting', sentiment: 'positive' },
    { sessionId: 'session-1', role: 'user', content: 'I need a truck for my family and business.', phase: 'discovery', sentiment: 'neutral' },
    { sessionId: 'session-1', role: 'assistant', content: 'The F-150 XLT SuperCrew is perfect for that!', phase: 'positioning', sentiment: 'positive' },
    { sessionId: 'session-1', role: 'user', content: 'I\'ll take it!', phase: 'closing', sentiment: 'positive' },
    { sessionId: 'session-2', role: 'assistant', content: 'Welcome! What kind of vehicle are you looking for?', phase: 'greeting', sentiment: 'positive' },
    { sessionId: 'session-2', role: 'user', content: 'I want a Mustang GT.', phase: 'discovery', sentiment: 'interested' },
    { sessionId: 'session-2', role: 'user', content: 'You sold me. Where do I sign?', phase: 'closing', sentiment: 'positive' },
    { sessionId: 'session-3', role: 'assistant', content: 'Hi! How can I help you today?', phase: 'greeting', sentiment: 'positive' },
    { sessionId: 'session-3', role: 'user', content: 'I have a tight budget.', phase: 'discovery', sentiment: 'neutral' },
    { sessionId: 'session-3', role: 'user', content: 'I need to think about it.', phase: 'closing', sentiment: 'skeptical' },
    { sessionId: 'session-4', role: 'assistant', content: 'Welcome! What are you looking for?', phase: 'greeting', sentiment: 'positive' },
    { sessionId: 'session-4', role: 'user', content: 'I need a family SUV with safety features.', phase: 'discovery', sentiment: 'neutral' },
    { sessionId: 'session-4', role: 'user', content: 'Yes! Let\'s do it.', phase: 'closing', sentiment: 'positive' },
    { sessionId: 'session-5', role: 'assistant', content: 'Welcome to City Ford!', phase: 'greeting', sentiment: 'positive' },
    { sessionId: 'session-5', role: 'user', content: 'Just browsing.', phase: 'discovery', sentiment: 'neutral' }
  ];

  for (let i = 0; i < sampleMessages.length; i++) {
    await prisma.message.upsert({ where: { id: `msg-${i}` }, update: sampleMessages[i], create: { id: `msg-${i}`, ...sampleMessages[i], keywords: '[]' } });
  }

  // Session Analytics
  const sessionAnalytics = [
    { id: 'analytics-1', sessionId: 'session-1', totalMessages: 4, userMessageCount: 2, aiMessageCount: 2, avgResponseLength: 50, discoveryQuestionsAsked: 1, objectionCount: 0, positiveSignals: 2, negativeSignals: 0, timeToFirstInterest: 180, timeToClose: 1800, successfulTechniques: JSON.stringify(['benefit_selling']), failedTechniques: '[]' },
    { id: 'analytics-2', sessionId: 'session-2', totalMessages: 3, userMessageCount: 2, aiMessageCount: 1, avgResponseLength: 40, discoveryQuestionsAsked: 1, objectionCount: 0, positiveSignals: 2, negativeSignals: 0, timeToFirstInterest: 60, timeToClose: 2400, successfulTechniques: JSON.stringify(['storytelling']), failedTechniques: '[]' },
    { id: 'analytics-3', sessionId: 'session-3', totalMessages: 3, userMessageCount: 2, aiMessageCount: 1, avgResponseLength: 30, discoveryQuestionsAsked: 1, objectionCount: 1, positiveSignals: 0, negativeSignals: 1, timeToFirstInterest: null, timeToClose: null, successfulTechniques: '[]', failedTechniques: JSON.stringify(['payment_reframe']) },
    { id: 'analytics-4', sessionId: 'session-4', totalMessages: 3, userMessageCount: 2, aiMessageCount: 1, avgResponseLength: 35, discoveryQuestionsAsked: 1, objectionCount: 0, positiveSignals: 2, negativeSignals: 0, timeToFirstInterest: 90, timeToClose: 900, successfulTechniques: JSON.stringify(['benefit_selling']), failedTechniques: '[]' },
    { id: 'analytics-5', sessionId: 'session-5', totalMessages: 2, userMessageCount: 1, aiMessageCount: 1, avgResponseLength: 20, discoveryQuestionsAsked: 0, objectionCount: 0, positiveSignals: 0, negativeSignals: 0, timeToFirstInterest: null, timeToClose: null, successfulTechniques: '[]', failedTechniques: '[]' }
  ];

  for (const analytics of sessionAnalytics) {
    await prisma.sessionAnalytics.upsert({ where: { sessionId: analytics.sessionId }, update: analytics, create: analytics });
  }

  // Global Analytics - Dashboard data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const globalAnalyticsDays = [
    { daysAgo: 6, sessions: 8, sales: 3, failed: 4, abandoned: 1 },
    { daysAgo: 5, sessions: 12, sales: 5, failed: 5, abandoned: 2 },
    { daysAgo: 4, sessions: 10, sales: 4, failed: 4, abandoned: 2 },
    { daysAgo: 3, sessions: 15, sales: 7, failed: 6, abandoned: 2 },
    { daysAgo: 2, sessions: 11, sales: 5, failed: 4, abandoned: 2 },
    { daysAgo: 1, sessions: 14, sales: 6, failed: 5, abandoned: 3 },
    { daysAgo: 0, sessions: 5, sales: 3, failed: 1, abandoned: 1 }
  ];

  for (const day of globalAnalyticsDays) {
    const date = new Date(today);
    date.setDate(date.getDate() - day.daysAgo);
    await prisma.globalAnalytics.upsert({
      where: { date: date },
      update: { totalSessions: day.sessions, successfulSales: day.sales, failedSales: day.failed, abandonedSessions: day.abandoned, avgSessionDuration: 1200, avgMessagesToClose: 6, conversionRate: (day.sales / day.sessions) * 100, topPerformingTechnique: 'benefit_selling', mostCommonObjection: 'too expensive' },
      create: { date: date, totalSessions: day.sessions, successfulSales: day.sales, failedSales: day.failed, abandonedSessions: day.abandoned, avgSessionDuration: 1200, avgMessagesToClose: 6, conversionRate: (day.sales / day.sessions) * 100, topPerformingTechnique: 'benefit_selling', mostCommonObjection: 'too expensive' }
    });
  }

  // Knowledge Base
  const knowledgeDocs = [
    { id: 'kb-financing', title: 'Ford Financing Options', slug: 'ford-financing-options', language: 'en', content: '# Ford Financing Options\n\n## Buy vs Lease\n- Buying: Own outright\n- Leasing: Lower payments\n\n## Current Promotions\n- 0% APR for 60 months\n- $2,000 cash back on F-150' },
    { id: 'kb-f150', title: 'Ford F-150 Guide', slug: 'f150-guide', language: 'en', content: '# Ford F-150 Guide\n\n## Overview\nAmerica\'s best-selling truck for 45+ years.\n\n## Trim Levels\n1. XL - Work truck\n2. XLT - Most popular\n3. Lariat - Leather seats' },
    { id: 'kb-mustang', title: 'Ford Mustang Guide', slug: 'mustang-guide', language: 'en', content: '# Ford Mustang Guide\n\n## The Legend\nAn American icon since 1964.\n\n## Trim Levels\n1. EcoBoost - 315 HP\n2. GT - 486 HP V8\n3. Dark Horse - 500 HP' }
  ];

  for (const doc of knowledgeDocs) {
    const existingDoc = await prisma.knowledgeDoc.findUnique({ where: { slug: doc.slug } });
    if (!existingDoc) {
      const createdDoc = await prisma.knowledgeDoc.create({ data: doc });
      const paragraphs = doc.content.split('\n\n').filter(p => p.trim());
      for (let i = 0; i < paragraphs.length; i++) {
        await prisma.knowledgeChunk.create({ data: { docId: createdDoc.id, index: i, text: paragraphs[i], embedding: '[]' } });
      }
    }
  }

  // Learning Insights
  const learningInsights = [
    { id: 'insight-1', type: 'technique_effectiveness', insight: 'Benefit selling has 73% success rate for truck buyers', confidence: 0.85, basedOn: 45 },
    { id: 'insight-2', type: 'objection_pattern', insight: 'Price objections peak on Mondays', confidence: 0.72, basedOn: 120 },
    { id: 'insight-3', type: 'conversion_insight', insight: 'Sessions with 2+ discovery questions have 40% higher conversion', confidence: 0.91, basedOn: 200 }
  ];

  for (const insight of learningInsights) {
    await prisma.learningInsight.upsert({ where: { id: insight.id }, update: insight, create: insight });
  }

  // ============================================
  // BRANDING - Red color scheme for SellMeACar
  // ============================================
  await prisma.branding.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      accentColor: '#ef4444',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    }
  });

  // ============================================
  // STORE INFO - Dealership Information
  // ============================================
  await prisma.storeInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Sell Me a Car',
      tagline: 'Your Auto Sales Training Partner',
      description: 'AI-powered automotive sales training platform. Practice your sales techniques with realistic customer interactions.',
      address: '1234 Auto Drive, Springfield, IL 62701',
      phone: '(555) 123-4567',
      email: 'sales@sellmeacar.com',
      website: 'https://sellmeacar.com',
      businessHours: 'Mon-Sat 9AM-8PM, Sun 11AM-5PM',
      timezone: 'America/Chicago'
    }
  });

  // ============================================
  // FEATURES - Default feature configuration
  // ============================================
  await prisma.features.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      faqEnabled: false,
      stickyBarEnabled: false,
      stickyBarText: '0% APR Financing on Select Models!',
      stickyBarBgColor: '#dc2626',
      stickyBarLink: '',
      stickyBarLinkText: 'View Offers',
      liveChatEnabled: false,
      chatProvider: 'builtin',
      chatWelcomeMessage: 'Hi! Looking for your next vehicle?',
      chatAgentName: 'Sales Advisor',
      chatWidgetColor: '#dc2626',
      chatPosition: 'bottom-right',
      chatShowOnMobile: true,
      chatWidgetId: '',
      chatEmbedCode: '',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      orderConfirmations: true,
      marketingEmails: false,
      appointmentReminders: true,
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
      shareOnFacebook: true,
      shareOnTwitter: true,
      shareOnLinkedin: false,
      shareOnWhatsapp: true,
      shareOnEmail: true,
      copyLinkButton: true
    }
  });

  // ============================================
  // PAYMENT SETTINGS - Default payment configuration
  // ============================================
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      enabled: false,
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeTestMode: true,
      paypalEnabled: false,
      paypalClientId: '',
      paypalSandbox: true,
      squareEnabled: false,
      squareAppId: '',
      squareSandbox: true
    }
  });

  console.log('Database seeded successfully for Ford Auto Sales!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
