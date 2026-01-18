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
        // === DIRECT PURCHASE STATEMENTS ===
        "i'll buy it", "i'll buy one", "i'll take it", "i will buy", "i will buy it",
        "i'm buying", "i'm buying it", "i want to buy", "i'd like to buy",
        "i want this car", "i want this truck", "i want this vehicle",
        "i'll take the car", "i'll take the truck", "i'll take the vehicle",
        // === FINANCING/LEASING COMMITMENT ===
        "let's do the financing", "i'll finance it", "i want to finance",
        "let's do the lease", "i'll lease it", "i want to lease",
        "let's write it up", "draw up the papers", "let's do the paperwork",
        "where do i sign", "i'm ready to sign", "let's sign the papers",
        // === TRADE-IN + PURCHASE ===
        "i'll trade in my car", "let's do the trade", "trade mine in",
        "yes with my trade-in", "include my trade",
        // === ORDER/RESERVE ===
        "order it for me", "order one for me", "put one aside", "reserve it",
        "reserve one for me", "hold this one", "save this one for me",
        "place the order", "submit the order",
        // === PAYMENT/TRANSACTION ===
        "take my money", "here's my deposit", "i'll put down a deposit",
        "let me pay", "ready to pay", "charge my card", "run my card",
        "what's my monthly payment", "i can do that payment",
        // === SOLD/CONVINCED ===
        "sold", "i'm sold", "you sold me", "you got me",
        "you convinced me", "i'm convinced", "that convinced me",
        // === AGREEMENT/COMMITMENT ===
        "sign me up", "i'm in", "count me in", "deal", "you got a deal",
        "it's a deal", "we have a deal", "done", "let's do it",
        "make it happen", "hook me up", "set me up",
        // === YES + PURCHASE CONTEXT ===
        "yes i'll buy", "yes i'll take", "yes i want it", "yes reserve it",
        "yes please", "yes order it", "yeah i'll take it",
        "sure i'll take it", "ok let's do it", "alright i'll buy it",
        // === SPECIFIC VEHICLE COMMITMENT ===
        "this is the one", "this is my truck", "this is my car",
        "i love this f-150", "i want this mustang", "this bronco is mine"
    ];
    const objectionKeywordsArray = [
        // === DIRECT REFUSALS ===
        "don't want it", "do not want it", "i won't buy", "will not buy",
        "not buying", "i'm not buying", "refuse to buy", "won't be buying",
        // === NOT FOR ME ===
        "not for me", "isn't for me", "not the right car", "not the right truck",
        "not what i'm looking for", "doesn't fit my needs",
        // === POLITE DECLINES ===
        "no thanks", "no thank you", "i'll pass", "gonna pass",
        "i'm good", "i'm fine", "i'm okay", "i'm all set",
        // === NOT INTERESTED ===
        "not interested", "i'm not interested", "doesn't interest me",
        "not really interested",
        // === DON'T NEED ===
        "don't need it", "don't need a new car", "don't need a truck",
        "i have no need", "my current car is fine",
        // === STRONG REFUSALS ===
        "absolutely not", "definitely not", "no way", "hell no", "nope",
        "never", "forget it", "not happening", "hard pass", "hard no",
        // === PRICE OBJECTIONS ===
        "too expensive", "way too expensive", "too much", "too much money",
        "can't afford", "out of my budget", "over my budget",
        "not worth it", "not worth the price", "payments too high",
        "monthly payment too high", "can't swing that payment",
        // === TIMING OBJECTIONS ===
        "not today", "not now", "not right now", "maybe another time",
        "let me think about it", "need to think", "need more time",
        "not ready yet", "still shopping around",
        // === WALKING AWAY ===
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
        {
            year: 2024,
            make: 'Ford',
            model: 'F-150',
            trim: 'XLT SuperCrew',
            bodyStyle: 'truck',
            exteriorColor: 'Oxford White',
            interiorColor: 'Black',
            mileage: 0,
            condition: 'new',
            msrp: 52995,
            salePrice: 49995,
            engine: '3.5L V6 EcoBoost',
            transmission: 'automatic',
            drivetrain: '4wd',
            fuelType: 'gasoline',
            mpgCity: 20,
            mpgHighway: 26,
            features: JSON.stringify(['360-Degree Camera', 'Pro Trailer Backup Assist', 'SYNC 4', 'Ford Co-Pilot360', 'LED Headlights', 'Bed Liner', 'Tow Package']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
            description: 'America\'s best-selling truck for over 45 years. The 2024 F-150 XLT combines capability with comfort, featuring the powerful 3.5L EcoBoost engine and advanced towing technology.',
            status: 'available',
            featured: true,
            stockNumber: 'F150-001',
            vin: '1FTFW1E85NFA00001'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Mustang',
            trim: 'GT Premium',
            bodyStyle: 'coupe',
            exteriorColor: 'Race Red',
            interiorColor: 'Ebony',
            mileage: 0,
            condition: 'new',
            msrp: 54995,
            salePrice: 53495,
            engine: '5.0L V8',
            transmission: 'manual',
            drivetrain: 'rwd',
            fuelType: 'gasoline',
            mpgCity: 15,
            mpgHighway: 24,
            features: JSON.stringify(['MagneRide Damping', 'Brembo Brakes', 'SYNC 4', 'B&O Sound System', 'Digital Instrument Cluster', 'Performance Pack']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800']),
            description: 'The legendary Mustang GT with the iconic 5.0L V8 Coyote engine. 486 horsepower of pure American muscle with a 6-speed manual transmission.',
            status: 'available',
            featured: true,
            stockNumber: 'MUS-001',
            vin: '1FA6P8CF2N5100001'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Bronco',
            trim: 'Outer Banks',
            bodyStyle: 'suv',
            exteriorColor: 'Cactus Gray',
            interiorColor: 'Navy Pier',
            mileage: 0,
            condition: 'new',
            msrp: 48895,
            salePrice: 47395,
            engine: '2.7L V6 EcoBoost',
            transmission: 'automatic',
            drivetrain: '4wd',
            fuelType: 'gasoline',
            mpgCity: 18,
            mpgHighway: 22,
            features: JSON.stringify(['Removable Roof', 'Removable Doors', 'Trail Turn Assist', 'GOAT Modes', 'SYNC 4', '12" Touchscreen', 'Front Camera']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800']),
            description: 'The legendary Ford Bronco is back! Built Wild for off-road adventures with removable doors and roof panels. Ready for any terrain.',
            status: 'available',
            featured: true,
            stockNumber: 'BRO-001',
            vin: '1FMDE5BH4NBA00001'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Explorer',
            trim: 'ST',
            bodyStyle: 'suv',
            exteriorColor: 'Atlas Blue',
            interiorColor: 'Ebony',
            mileage: 0,
            condition: 'new',
            msrp: 56650,
            salePrice: 54995,
            engine: '3.0L V6 EcoBoost',
            transmission: 'automatic',
            drivetrain: 'awd',
            fuelType: 'gasoline',
            mpgCity: 18,
            mpgHighway: 24,
            features: JSON.stringify(['400HP Twin-Turbo V6', 'ST-Tuned Suspension', 'Performance Brakes', 'SYNC 4', 'Wireless Charging', '3rd Row Seating']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1551830820-330a71b99659?w=800']),
            description: 'The Explorer ST delivers thrilling performance with 400 horsepower while still offering three rows of seating for the whole family.',
            status: 'available',
            featured: false,
            stockNumber: 'EXP-001',
            vin: '1FM5K8GC2NGA00001'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Maverick',
            trim: 'XLT Hybrid',
            bodyStyle: 'truck',
            exteriorColor: 'Area 51',
            interiorColor: 'Medium Dark Slate',
            mileage: 0,
            condition: 'new',
            msrp: 28495,
            salePrice: 27995,
            engine: '2.5L Hybrid',
            transmission: 'cvt',
            drivetrain: 'fwd',
            fuelType: 'hybrid',
            mpgCity: 42,
            mpgHighway: 33,
            features: JSON.stringify(['Hybrid Powertrain', 'FLEXBED', 'SYNC 3', 'Ford Co-Pilot360', 'Multi-Position Tailgate', 'DIY-Ready Design']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1619767886558-efdc7b9af5a5?w=800']),
            description: 'The Maverick Hybrid gets an incredible 42 MPG city - the most fuel-efficient pickup ever. Perfect for urban adventures.',
            status: 'available',
            featured: false,
            stockNumber: 'MAV-001',
            vin: '3FTTW8E31NRA00001'
        },
        {
            year: 2023,
            make: 'Ford',
            model: 'F-150',
            trim: 'Lariat',
            bodyStyle: 'truck',
            exteriorColor: 'Iconic Silver',
            interiorColor: 'Black Onyx',
            mileage: 12500,
            condition: 'certified_preowned',
            msrp: 58995,
            salePrice: 44995,
            engine: '3.5L V6 EcoBoost',
            transmission: 'automatic',
            drivetrain: '4wd',
            fuelType: 'gasoline',
            mpgCity: 18,
            mpgHighway: 24,
            features: JSON.stringify(['Leather Seats', 'Heated/Cooled Seats', 'B&O Sound', 'Panoramic Roof', '360 Camera', 'Max Tow Package']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
            description: 'Certified Pre-Owned Lariat with remaining factory warranty. One owner, all service records. Like new condition.',
            status: 'available',
            featured: false,
            stockNumber: 'CPO-001',
            vin: '1FTFW1E85NFA00002'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Mustang Mach-E',
            trim: 'GT',
            bodyStyle: 'suv',
            exteriorColor: 'Grabber Blue',
            interiorColor: 'Space Gray',
            mileage: 0,
            condition: 'new',
            msrp: 62995,
            salePrice: 59995,
            specialPrice: 57995,
            engine: 'Dual Electric Motors',
            transmission: 'automatic',
            drivetrain: 'awd',
            fuelType: 'electric',
            mpgCity: 91,
            mpgHighway: 84,
            features: JSON.stringify(['480HP Dual Motors', 'Extended Range Battery', 'MagneRide', 'Brembo Brakes', 'BlueCruise', 'Glass Roof', 'Premium Sound']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1619317621295-75c4b5e6b7a3?w=800']),
            description: 'The all-electric Mach-E GT delivers 480 horsepower with instant torque. 0-60 in 3.5 seconds. Experience the future of performance.',
            status: 'available',
            featured: true,
            stockNumber: 'MACHE-001',
            vin: '3FMTK4SE4NMA00001'
        },
        {
            year: 2024,
            make: 'Ford',
            model: 'Ranger',
            trim: 'Raptor',
            bodyStyle: 'truck',
            exteriorColor: 'Code Orange',
            interiorColor: 'Onyx/Orange',
            mileage: 0,
            condition: 'new',
            msrp: 56980,
            salePrice: 56980,
            engine: '3.0L V6 EcoBoost',
            transmission: 'automatic',
            drivetrain: '4wd',
            fuelType: 'gasoline',
            mpgCity: 16,
            mpgHighway: 18,
            features: JSON.stringify(['FOX Shocks', 'Terrain Management', 'Trail Control', 'Recaro Seats', 'SYNC 4', '12" Screen', 'Steel Bash Plates']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1619767886558-efdc7b9af5a5?w=800']),
            description: 'The Ranger Raptor brings F-150 Raptor DNA to a mid-size package. Built for serious off-road performance.',
            status: 'available',
            featured: false,
            stockNumber: 'RAP-001',
            vin: '1FTER4FH4NLD00001'
        }
    ];
    for (const vehicle of vehicles) {
        await prisma.vehicle.upsert({
            where: { vin: vehicle.vin },
            update: vehicle,
            create: vehicle
        });
    }
    // Discovery Questions for Car Sales
    const discoveryQuestions = [
        {
            question: 'What will you primarily be using the vehicle for - commuting, family hauling, work, or adventures?',
            purpose: 'Identifies primary use case to recommend body style',
            followUp: 'How many miles do you typically drive in a week?',
            targetNeed: 'utility'
        },
        {
            question: 'Are you looking to buy, lease, or still deciding between the two?',
            purpose: 'Determines financing approach and monthly budget focus',
            followUp: 'What monthly payment range works best for your budget?',
            targetNeed: 'budget'
        },
        {
            question: 'Do you have a vehicle to trade in today?',
            purpose: 'Identifies trade-in opportunity and equity situation',
            followUp: 'What are you currently driving and how many miles are on it?',
            targetNeed: 'budget'
        },
        {
            question: 'How important is fuel efficiency versus power and performance to you?',
            purpose: 'Determines powertrain preferences (hybrid, V6, V8, electric)',
            followUp: 'Have you considered any of our hybrid or electric options?',
            targetNeed: 'efficiency'
        },
        {
            question: 'Do you need four-wheel drive or all-wheel drive capabilities?',
            purpose: 'Narrows drivetrain options based on needs',
            followUp: 'Do you encounter snow, mud, or off-road conditions often?',
            targetNeed: 'utility'
        },
        {
            question: 'How many passengers do you typically need to accommodate?',
            purpose: 'Determines seating and size requirements',
            followUp: 'Do you need a third row for extra passengers?',
            targetNeed: 'family'
        },
        {
            question: 'What features are must-haves for you - technology, safety, or comfort?',
            purpose: 'Identifies priority features for trim selection',
            followUp: 'How important is the infotainment system and connectivity?',
            targetNeed: 'luxury'
        },
        {
            question: 'Are you open to certified pre-owned, or only interested in brand new?',
            purpose: 'Opens CPO inventory if budget-conscious',
            followUp: 'Our CPO vehicles come with extended warranty coverage.',
            targetNeed: 'budget'
        }
    ];
    for (let i = 0; i < discoveryQuestions.length; i++) {
        await prisma.discoveryQuestion.upsert({
            where: { id: `discovery-${i}` },
            update: discoveryQuestions[i],
            create: { id: `discovery-${i}`, ...discoveryQuestions[i], sortOrder: i }
        });
    }
    // Positioning Angles for Cars
    const positioningAngles = [
        {
            userNeed: 'family',
            headline: 'Space for the Whole Family',
            pitch: 'With three rows of seating and best-in-class cargo space, you\'ll have room for everyone plus all their stuff. Road trips just got a whole lot easier.',
            emotionalHook: 'Picture your family\'s next adventure in this vehicle...'
        },
        {
            userNeed: 'performance',
            headline: 'Unleash the Power',
            pitch: 'With 400+ horsepower and precision handling, every drive becomes an experience. This isn\'t just transportation - it\'s excitement.',
            emotionalHook: 'Feel that V8 rumble and instant acceleration...'
        },
        {
            userNeed: 'efficiency',
            headline: 'Save at Every Fill-Up',
            pitch: 'With industry-leading fuel economy, you\'ll be saving hundreds at the pump every year. Smart performance that doesn\'t compromise.',
            emotionalHook: 'Imagine cutting your fuel costs in half...'
        },
        {
            userNeed: 'utility',
            headline: 'Built for Whatever You Need',
            pitch: 'From hauling equipment to weekend camping trips, this truck can handle it all. Best-in-class towing and payload make light work of heavy jobs.',
            emotionalHook: 'Think about all the projects you could finally tackle...'
        },
        {
            userNeed: 'luxury',
            headline: 'First-Class Every Day',
            pitch: 'Premium leather, advanced technology, and whisper-quiet comfort. You spend so much time in your vehicle - shouldn\'t it feel special?',
            emotionalHook: 'You deserve to enjoy every moment behind the wheel...'
        },
        {
            userNeed: 'budget',
            headline: 'Smart Value, No Compromises',
            pitch: 'You\'re getting more features for your money than any competitor. Plus with our financing options, we\'ll find a payment that works.',
            emotionalHook: 'Drive away in a vehicle that exceeds your expectations, not your budget...'
        },
        {
            userNeed: 'safety',
            headline: 'Protect What Matters Most',
            pitch: 'With Ford Co-Pilot360 and top safety ratings, you\'re surrounded by technology designed to keep your family safe on every journey.',
            emotionalHook: 'Peace of mind is priceless when your loved ones are on board...'
        }
    ];
    for (const angle of positioningAngles) {
        await prisma.positioningAngle.upsert({
            where: { userNeed: angle.userNeed },
            update: angle,
            create: angle
        });
    }
    // Sales Techniques
    const salesTechniques = [
        // Discovery
        { name: 'needs_assessment', category: 'discovery', description: 'Ask about lifestyle, family, commute to identify vehicle needs', script: 'Tell me about your typical day. How will you use this vehicle?', enabled: true },
        { name: 'trade_in_discovery', category: 'discovery', description: 'Uncover trade-in vehicle details and equity', script: 'What are you driving now? What do you like about it? What would you change?', enabled: true },
        { name: 'budget_qualification', category: 'discovery', description: 'Understand payment expectations without price focus', script: 'Are you looking to buy or lease? What monthly investment works for your household?', enabled: true },
        { name: 'active_listening', category: 'discovery', description: 'Reflect back what the customer says to show understanding', script: 'So what I\'m hearing is you need something with more cargo space and better fuel economy...', enabled: true },
        // Positioning
        { name: 'benefit_selling', category: 'positioning', description: 'Focus on benefits, not just features', script: 'The Ford Co-Pilot360 means you can relax knowing the car is watching out for hazards you might miss...', enabled: true },
        { name: 'test_drive_close', category: 'positioning', description: 'Get them behind the wheel to experience the vehicle', script: 'The best way to see if this is your truck is to drive it. Let me grab the keys...', enabled: true },
        { name: 'comparison_selling', category: 'positioning', description: 'Position against competitors when appropriate', script: 'Unlike the Silverado, the F-150 offers standard safety features that others charge extra for...', enabled: true },
        { name: 'storytelling', category: 'positioning', description: 'Share customer success stories', script: 'I had a customer last month with similar needs. They chose the Explorer and told me it changed their family road trips...', enabled: true },
        // Persuasion
        { name: 'financing_options', category: 'persuasion', description: 'Present financing as solution to affordability', script: 'We have several financing options that could get your payment right where you want it...', enabled: true },
        { name: 'trade_value_anchor', category: 'persuasion', description: 'Use trade-in value to reduce perceived price', script: 'With your trade valued at $15,000, you\'re really only financing $35,000...', enabled: true },
        { name: 'scarcity', category: 'persuasion', description: 'Highlight limited availability of popular models', script: 'We only got two of these in this color, and one is already spoken for...', enabled: true },
        { name: 'incentive_urgency', category: 'persuasion', description: 'Time-sensitive manufacturer incentives', script: 'Ford\'s 0% APR promotion ends this month. That could save you thousands in interest...', enabled: true },
        // Closing
        { name: 'assumptive_close', category: 'closing', description: 'Assume the sale and move to details', script: 'Which color speaks to you more? And would you prefer the 60 or 72 month financing?', enabled: true },
        { name: 'summary_close', category: 'closing', description: 'Summarize everything before asking for commitment', script: 'So we have the F-150 XLT with your trade bringing the payment to around $450. Ready to make it yours?', enabled: true },
        { name: 'today_close', category: 'closing', description: 'Create urgency for same-day decision', script: 'If we can put this together today, I can include the bed liner and tonneau cover at no extra charge...', enabled: true },
        // Objection Handling
        { name: 'feel_felt_found', category: 'objection_handling', description: 'Empathize, relate, resolve', script: 'I understand how you feel. Many customers have felt the same way. What they found was...', enabled: true },
        { name: 'payment_reframe', category: 'objection_handling', description: 'Reframe price as daily/monthly investment', script: 'That\'s less than $15 a day for a vehicle that\'ll serve your family for years...', enabled: true },
        { name: 'trade_leverage', category: 'objection_handling', description: 'Use trade-in to address budget concerns', script: 'What if we could get you more for your trade to bring that payment down?', enabled: true }
    ];
    for (let i = 0; i < salesTechniques.length; i++) {
        await prisma.salesTechnique.upsert({
            where: { name: salesTechniques[i].name },
            update: salesTechniques[i],
            create: { ...salesTechniques[i], sortOrder: i }
        });
    }
    // Closing Strategies
    const closingStrategies = [
        {
            name: 'test_drive_close',
            type: 'soft',
            script: 'You\'ve been looking at this F-150 for a while now. The best way to know if it\'s right is to get behind the wheel. Want to take it for a spin?',
            useWhen: 'Customer has shown strong interest but hasn\'t committed'
        },
        {
            name: 'payment_close',
            type: 'direct',
            script: 'Based on your trade and our current incentives, we\'re looking at about $450 a month. Does that work for your budget?',
            useWhen: 'After discussing financing and trade-in'
        },
        {
            name: 'choice_close',
            type: 'choice',
            script: 'I can see you\'re torn between the XLT and Lariat. Which features matter most - the leather seats or the bigger screen? Let\'s get you in the right one.',
            useWhen: 'Customer is deciding between trims or models'
        },
        {
            name: 'today_incentive',
            type: 'urgency',
            script: 'I can include floor mats, a bed liner, and the first three oil changes if we can wrap this up today. What do you say?',
            useWhen: 'Customer is interested but hesitating on timing'
        },
        {
            name: 'reserve_close',
            type: 'soft',
            script: 'This exact configuration is hard to find. Can I put a hold on it for you while you discuss with your family? No obligation.',
            useWhen: 'Customer needs to consult with others'
        },
        {
            name: 'direct_ask',
            type: 'direct',
            script: 'Based on everything we\'ve discussed, this F-150 checks all your boxes. Are you ready to make it yours today?',
            useWhen: 'After comprehensive needs assessment and positioning'
        }
    ];
    for (const strategy of closingStrategies) {
        await prisma.closingStrategy.upsert({
            where: { name: strategy.name },
            update: strategy,
            create: strategy
        });
    }
    // Objection Handlers for Car Sales
    const objectionHandlers = [
        {
            objection: 'too expensive',
            category: 'price',
            response: 'I hear you - it\'s a significant investment. Let me show you how our financing options can make this fit your budget. With your trade-in and current incentives, we might be closer to your target than you think. What monthly payment would work for you?',
            technique: 'payment_reframe'
        },
        {
            objection: 'monthly payment too high',
            category: 'financing',
            response: 'Let\'s work with those numbers. We have several options - extending the term, increasing your down payment, or looking at a different trim level. What\'s the payment you\'re comfortable with? I\'ll see what we can do.',
            technique: 'payment_reframe'
        },
        {
            objection: 'need to think about it',
            category: 'timing',
            response: 'Absolutely, this is a big decision. What specific aspects are you wanting to think over? Is it the vehicle itself, the numbers, or something else? I want to make sure you have all the information you need.',
            technique: 'isolate'
        },
        {
            objection: 'want to shop around',
            category: 'competition',
            response: 'That\'s smart - you should feel confident in your decision. What other vehicles are you considering? I\'d love to show you how the Ford compares. And if you find something you like elsewhere, I\'d appreciate the chance to earn your business before you decide.',
            technique: 'comparison_selling'
        },
        {
            objection: 'trade-in value too low',
            category: 'trade_in',
            response: 'I understand that\'s less than you expected. Let me explain how we arrived at that number. If we can\'t agree on the trade, we could also look at selling it privately and putting that toward your down payment. What value would make this work for you?',
            technique: 'isolate'
        },
        {
            objection: 'need to talk to spouse',
            category: 'timing',
            response: 'Of course - it\'s a family decision. Would it help if I put together all the details on paper so you can share them at home? Or would you like to bring them in to see it together? I can also hold this specific vehicle until you\'ve had a chance to discuss.',
            technique: 'reserve_close'
        },
        {
            objection: 'not ready to buy today',
            category: 'timing',
            response: 'I completely understand. There\'s no pressure here. But I should mention that our current 0% financing offer ends this month, and this particular color combination is in high demand. Can I at least put a soft hold on it for you?',
            technique: 'urgency'
        },
        {
            objection: 'prefer another brand',
            category: 'competition',
            response: 'What draws you to that brand? I\'d love to understand what\'s important to you. You might be surprised how Ford compares on the features that matter most. Have you driven both back-to-back?',
            technique: 'comparison_selling'
        }
    ];
    for (let i = 0; i < objectionHandlers.length; i++) {
        await prisma.objectionHandler.upsert({
            where: { id: `objection-${i}` },
            update: objectionHandlers[i],
            create: { id: `objection-${i}`, ...objectionHandlers[i] }
        });
    }
    // AI Prompt Configuration for Car Sales
    const systemPrompt = `You are a professional Ford automotive sales specialist at {dealership_name}. Your goal is to help customers find the perfect Ford vehicle while providing an exceptional buying experience.

LANGUAGE RULE:
- Respond in whatever language the customer uses
- If they speak Spanish, respond in Spanish
- If they speak French, respond in French
- Translate vehicle names, features, and benefits naturally into their language

IMPORTANT SALES RULES:
- NEVER start by pushing a specific vehicle - always begin with discovery
- Ask about their needs: family size, usage, budget, trade-in, financing preference
- Listen actively and recommend vehicles based on discovered needs
- Be knowledgeable about Ford's lineup: F-150, Mustang, Bronco, Explorer, Maverick, Mach-E, Ranger
- Discuss financing options: buy vs lease, monthly payments, trade-in value
- Handle questions about warranties, service, and maintenance
- Be confident but never pushy

FINANCING KNOWLEDGE:
- Discuss buy vs lease options naturally
- Ask about desired monthly payment range
- Mention current incentives (0% APR, cash back, etc.) when relevant
- Offer to work with numbers to meet their budget
- Explain trade-in process when appropriate

CRITICAL CLOSING RULE - ALWAYS ASK FOR CONFIRMATION:
- When the customer shows interest, do NOT assume they are buying
- You MUST ask an explicit question to confirm:
  * "Would you like to take it for a test drive?"
  * "Can I run some numbers for you?"
  * "Should we see what your trade is worth?"
  * "Are you ready to make it yours today?"
  * "Would you like me to hold this one for you?"
- Wait for explicit YES before proceeding

YOUR PERSONALITY:
- Friendly and approachable, not high-pressure
- Knowledgeable about Ford products and features
- Genuinely interested in finding the right vehicle for them
- Professional yet personable
- Honest about vehicle capabilities and limitations

SALES PHASES:
1. GREETING: Warm welcome, build rapport
2. DISCOVERY: Understand needs, budget, timeline, trade-in
3. SELECTION: Recommend specific Ford models based on needs
4. PRESENTATION: Highlight features and benefits relevant to their needs
5. TEST DRIVE: Get them behind the wheel
6. NEGOTIATION: Discuss pricing, financing, trade-in
7. CLOSING: Ask for the sale explicitly

Remember: The best car salespeople make customers feel helped, not sold to. Build trust by understanding their needs first!`;
    const closingPrompt = 'ALWAYS ask for commitment explicitly. Use questions like "Are you ready to make this yours?", "Should we start the paperwork?", "Can I hold this one for you?". Never assume - always confirm. Maximum 3 closing attempts before gracefully accepting their decision.';
    await prisma.aIPromptConfig.upsert({
        where: { name: 'default' },
        update: {
            systemPrompt: systemPrompt,
            closingPrompt: closingPrompt,
            discoveryPrompt: 'Focus on understanding their vehicle needs. Ask about family size, daily commute, weekend activities, budget range, trade-in situation, and financing preferences. Listen for emotional triggers - safety for family, performance desires, practicality needs.',
            positioningPrompt: 'Based on discovered needs, position the recommended Ford vehicle to address their specific situation. Use emotional hooks and paint a picture of how this vehicle will improve their life. Compare to their current vehicle and competing brands if relevant.'
        },
        create: {
            name: 'default',
            systemPrompt: systemPrompt,
            discoveryPrompt: 'Focus on understanding their vehicle needs. Ask about family size, daily commute, weekend activities, budget range, trade-in situation, and financing preferences. Listen for emotional triggers - safety for family, performance desires, practicality needs.',
            positioningPrompt: 'Based on discovered needs, position the recommended Ford vehicle to address their specific situation. Use emotional hooks and paint a picture of how this vehicle will improve their life. Compare to their current vehicle and competing brands if relevant.',
            closingPrompt: closingPrompt,
            enabled: true
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
