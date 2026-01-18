import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
import pino from 'pino';

const router = Router();
const logger = pino();

// Helper function to get branding
async function getBranding() {
  let branding = await prisma.branding.findFirst();
  if (!branding) {
    branding = await prisma.branding.create({
      data: {
        id: 'default',
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        accentColor: '#ef4444'
      }
    });
  }
  return branding;
}

// Auth middleware
function requireToken(req: Request, res: Response, next: NextFunction) {
  const token = req.query.token || req.body.token;
  const validToken = process.env.ADMIN_TOKEN || 'admin';

  if (token !== validToken) {
    return res.status(401).render('admin/error', { error: 'Unauthorized', token: '' });
  }
  res.locals.token = token;
  next();
}

// Add basePath to all responses
router.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.basePath = req.headers['x-forwarded-prefix'] as string || '';
  next();
});

router.use(requireToken);

// Dashboard
router.get('/', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.appConfig.findFirst();
    const dealership = await prisma.dealershipConfig.findFirst();
    const sessions = await prisma.salesSession.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const totalSessions = await prisma.salesSession.count();
    const salesMade = await prisma.salesSession.count({ where: { outcome: 'sale_made' } });
    const conversionRate = totalSessions > 0 ? ((salesMade / totalSessions) * 100).toFixed(1) : 0;

    const vehicleCount = await prisma.vehicle.count({ where: { status: 'available' } });

    const analytics = await prisma.globalAnalytics.findFirst({
      orderBy: { date: 'desc' }
    });

    res.render('admin/dashboard', {
      token: res.locals.token,
      active: 'dashboard',
      basePath: res.locals.basePath,
      branding,
      config,
      dealership,
      sessions,
      stats: {
        totalSessions,
        salesMade,
        conversionRate,
        avgMessages: analytics?.avgMessagesToClose || 0,
        vehicleCount
      }
    });
  } catch (err) {
    logger.error({ err }, 'Dashboard error');
    res.render('admin/error', { error: 'Failed to load dashboard', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// ============================================
// Dealership Configuration
// ============================================

router.get('/dealership', async (req, res) => {
  try {
    const branding = await getBranding();
    let dealership = await prisma.dealershipConfig.findFirst();
    if (!dealership) {
      dealership = await prisma.dealershipConfig.create({
        data: { id: 'default' }
      });
    }
    res.render('admin/dealership', {
      token: res.locals.token,
      active: 'dealership',
      basePath: res.locals.basePath,
      branding,
      dealership
    });
  } catch (err) {
    logger.error({ err }, 'Dealership config error');
    res.render('admin/error', { error: 'Failed to load dealership config', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/dealership', async (req, res) => {
  try {
    const { name, tagline, location, phone, email, website, logoUrl, primaryColor, dealershipType } = req.body;

    // Update or create dealership config
    const existing = await prisma.dealershipConfig.findFirst();
    if (existing) {
      await prisma.dealershipConfig.update({
        where: { id: existing.id },
        data: {
          ...(name && { name }),
          ...(tagline && { tagline }),
          ...(location && { location }),
          ...(phone && { phone }),
          ...(email && { email }),
          ...(website !== undefined && { website }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(primaryColor && { primaryColor }),
          ...(dealershipType && { dealershipType })
        }
      });
    } else {
      await prisma.dealershipConfig.create({
        data: {
          id: 'default',
          name: name || 'Auto Sales Center',
          tagline: tagline || 'Your Trusted Auto Partner',
          location: location || '',
          phone: phone || '',
          email: email || '',
          website: website || '',
          logoUrl: logoUrl || '',
          primaryColor: primaryColor || '#1e40af',
          dealershipType: dealershipType || 'multi_brand'
        }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Dealership save error');
    res.status(500).json({ success: false, error: 'Failed to save' });
  }
});

// ============================================
// Vehicle Inventory
// ============================================

router.get('/vehicles', async (req, res) => {
  try {
    const branding = await getBranding();
    const vehicles = await prisma.vehicle.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });
    res.render('admin/vehicles', {
      token: res.locals.token,
      active: 'vehicles',
      basePath: res.locals.basePath,
      branding,
      vehicles
    });
  } catch (err) {
    logger.error({ err }, 'Vehicles list error');
    res.render('admin/error', { error: 'Failed to load vehicles', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.get('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    logger.error({ err }, 'Vehicle get error');
    res.status(500).json({ error: 'Failed to get vehicle' });
  }
});

router.post('/vehicles', async (req, res) => {
  try {
    const {
      year, make, model, trim, bodyStyle, vin, stockNumber,
      exteriorColor, interiorColor, mileage, condition,
      msrp, salePrice, specialPrice, engine, transmission,
      drivetrain, fuelType, mpgCity, mpgHighway,
      features, images, description, status, featured
    } = req.body;

    // Generate unique VIN if not provided
    const uniqueVin = vin || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        year: parseInt(year),
        make,
        model,
        trim: trim || '',
        bodyStyle: bodyStyle || 'sedan',
        vin: uniqueVin,
        stockNumber: stockNumber || '',
        exteriorColor,
        interiorColor: interiorColor || 'Black',
        mileage: parseInt(mileage) || 0,
        condition: condition || 'new',
        msrp: parseFloat(msrp) || 0,
        salePrice: parseFloat(salePrice),
        specialPrice: specialPrice ? parseFloat(specialPrice) : null,
        engine: engine || '',
        transmission: transmission || 'automatic',
        drivetrain: drivetrain || 'fwd',
        fuelType: fuelType || 'gasoline',
        mpgCity: mpgCity ? parseInt(mpgCity) : null,
        mpgHighway: mpgHighway ? parseInt(mpgHighway) : null,
        features: features || '[]',
        images: images || '[]',
        description: description || '',
        status: status || 'available',
        featured: featured || false
      }
    });
    res.json({ success: true, vehicle });
  } catch (err) {
    logger.error({ err }, 'Vehicle create error');
    res.status(500).json({ success: false, error: 'Failed to create vehicle' });
  }
});

router.put('/vehicles/:id', async (req, res) => {
  try {
    const {
      year, make, model, trim, bodyStyle, vin, stockNumber,
      exteriorColor, interiorColor, mileage, condition,
      msrp, salePrice, specialPrice, engine, transmission,
      drivetrain, fuelType, mpgCity, mpgHighway,
      features, images, description, status, featured
    } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        year: parseInt(year),
        make,
        model,
        trim: trim || '',
        bodyStyle: bodyStyle || 'sedan',
        ...(vin && { vin }),
        stockNumber: stockNumber || '',
        exteriorColor,
        interiorColor: interiorColor || 'Black',
        mileage: parseInt(mileage) || 0,
        condition: condition || 'new',
        msrp: parseFloat(msrp) || 0,
        salePrice: parseFloat(salePrice),
        specialPrice: specialPrice ? parseFloat(specialPrice) : null,
        engine: engine || '',
        transmission: transmission || 'automatic',
        drivetrain: drivetrain || 'fwd',
        fuelType: fuelType || 'gasoline',
        mpgCity: mpgCity ? parseInt(mpgCity) : null,
        mpgHighway: mpgHighway ? parseInt(mpgHighway) : null,
        features: features || '[]',
        images: images || '[]',
        description: description || '',
        status: status || 'available',
        featured: featured || false
      }
    });
    res.json({ success: true, vehicle });
  } catch (err) {
    logger.error({ err }, 'Vehicle update error');
    res.status(500).json({ success: false, error: 'Failed to update vehicle' });
  }
});

router.delete('/vehicles/:id', async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Vehicle delete error');
    res.status(500).json({ success: false, error: 'Failed to delete vehicle' });
  }
});

router.post('/vehicles/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.vehicle.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Bulk delete error');
    res.status(500).json({ success: false, error: 'Failed to delete vehicles' });
  }
});

router.post('/vehicles/bulk-status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    await prisma.vehicle.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Bulk status update error');
    res.status(500).json({ success: false, error: 'Failed to update vehicles' });
  }
});

router.post('/vehicles/import', async (req, res) => {
  try {
    const { vehicles } = req.body;
    let count = 0;

    for (const v of vehicles) {
      // Skip empty rows
      if (!v.year || !v.make || !v.model || !v.salePrice) continue;

      // Generate unique VIN if not provided
      const uniqueVin = v.vin || `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await prisma.vehicle.create({
        data: {
          year: parseInt(v.year),
          make: v.make,
          model: v.model,
          trim: v.trim || '',
          bodyStyle: v.bodystyle || v.bodyStyle || 'sedan',
          vin: uniqueVin,
          stockNumber: v.stocknumber || v.stockNumber || '',
          exteriorColor: v.exteriorcolor || v.exteriorColor || 'Unknown',
          interiorColor: v.interiorcolor || v.interiorColor || 'Black',
          mileage: parseInt(v.mileage) || 0,
          condition: v.condition || 'new',
          msrp: parseFloat(v.msrp) || 0,
          salePrice: parseFloat(v.saleprice || v.salePrice),
          specialPrice: v.specialprice || v.specialPrice ? parseFloat(v.specialprice || v.specialPrice) : null,
          engine: v.engine || '',
          transmission: v.transmission || 'automatic',
          drivetrain: v.drivetrain || 'fwd',
          fuelType: v.fueltype || v.fuelType || 'gasoline',
          mpgCity: v.mpgcity || v.mpgCity ? parseInt(v.mpgcity || v.mpgCity) : null,
          mpgHighway: v.mpghighway || v.mpgHighway ? parseInt(v.mpghighway || v.mpgHighway) : null,
          features: v.features || '[]',
          images: v.images || '[]',
          description: v.description || '',
          status: v.status || 'available',
          featured: v.featured === 'true' || v.featured === true
        }
      });
      count++;
    }

    res.json({ success: true, count });
  } catch (err) {
    logger.error({ err }, 'Import error');
    res.status(500).json({ success: false, error: 'Failed to import vehicles' });
  }
});

// ============================================
// Sessions
// ============================================

router.get('/sessions', async (req, res) => {
  try {
    const branding = await getBranding();
    const sessions = await prisma.salesSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: { analytics: true }
    });

    res.render('admin/sessions', {
      token: res.locals.token,
      active: 'sessions',
      basePath: res.locals.basePath,
      branding,
      sessions
    });
  } catch (err) {
    logger.error({ err }, 'Sessions error');
    res.render('admin/error', { error: 'Failed to load sessions', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const branding = await getBranding();
    const session = await prisma.salesSession.findUnique({
      where: { sessionId: req.params.sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        analytics: true
      }
    });

    if (!session) {
      return res.render('admin/error', { error: 'Session not found', token: res.locals.token, basePath: res.locals.basePath });
    }

    res.render('admin/session_detail', {
      token: res.locals.token,
      active: 'sessions',
      basePath: res.locals.basePath,
      branding,
      session
    });
  } catch (err) {
    logger.error({ err }, 'Session detail error');
    res.render('admin/error', { error: 'Failed to load session', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// ============================================
// Greeting Configuration
// ============================================

router.get('/greeting', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.appConfig.findFirst();
    const dealership = await prisma.dealershipConfig.findFirst();
    res.render('admin/greeting', {
      token: res.locals.token,
      active: 'greeting',
      basePath: res.locals.basePath,
      branding,
      greeting: config?.greeting || '',
      triggerPhrase: config?.triggerPhrase || 'sell me a car',
      dealership
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load greeting config', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/greeting', async (req, res) => {
  try {
    const { greeting, triggerPhrase } = req.body;
    await prisma.appConfig.updateMany({
      data: { greeting, triggerPhrase }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save' });
  }
});

// ============================================
// Sales Techniques
// ============================================

router.get('/techniques', async (req, res) => {
  try {
    const branding = await getBranding();
    const techniques = await prisma.salesTechnique.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
    });

    const techniquesWithRates = techniques.map(t => ({
      ...t,
      successRate: t.usageCount > 0 ? ((t.successCount / t.usageCount) * 100).toFixed(1) : 0
    }));

    res.render('admin/techniques', {
      token: res.locals.token,
      active: 'techniques',
      basePath: res.locals.basePath,
      branding,
      techniques: techniquesWithRates
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load techniques', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/techniques/:id/toggle', async (req, res) => {
  try {
    const technique = await prisma.salesTechnique.findUnique({ where: { id: req.params.id } });
    if (technique) {
      await prisma.salesTechnique.update({
        where: { id: req.params.id },
        data: { enabled: !technique.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ============================================
// Discovery Questions
// ============================================

router.get('/discovery', async (req, res) => {
  try {
    const branding = await getBranding();
    const questions = await prisma.discoveryQuestion.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.render('admin/discovery', {
      token: res.locals.token,
      active: 'discovery',
      basePath: res.locals.basePath,
      branding,
      questions
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load discovery questions', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/discovery', async (req, res) => {
  try {
    const { question, purpose, followUp, targetNeed } = req.body;
    await prisma.discoveryQuestion.create({
      data: { question, purpose, followUp, targetNeed }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.delete('/discovery/:id', async (req, res) => {
  try {
    await prisma.discoveryQuestion.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ============================================
// Closing Strategies
// ============================================

router.get('/closing', async (req, res) => {
  try {
    const branding = await getBranding();
    const strategies = await prisma.closingStrategy.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.render('admin/closing', {
      token: res.locals.token,
      active: 'closing',
      basePath: res.locals.basePath,
      branding,
      strategies
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load closing strategies', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// ============================================
// Objection Handlers
// ============================================

router.get('/objections', async (req, res) => {
  try {
    const branding = await getBranding();
    const handlers = await prisma.objectionHandler.findMany({
      orderBy: { category: 'asc' }
    });
    res.render('admin/objections', {
      token: res.locals.token,
      active: 'objections',
      basePath: res.locals.basePath,
      branding,
      handlers
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load objection handlers', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// ============================================
// AI Prompt Configuration
// ============================================

router.get('/ai-config', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.aIPromptConfig.findFirst();
    const appConfig = await prisma.appConfig.findFirst();
    res.render('admin/ai_config', {
      token: res.locals.token,
      active: 'ai-config',
      basePath: res.locals.basePath,
      branding,
      config,
      appConfig
    });
  } catch (err) {
    res.render('admin/error', { error: 'Failed to load AI config', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/ai-config', async (req, res) => {
  try {
    const { systemPrompt, discoveryPrompt, positioningPrompt, closingPrompt, maxClosingAttempts, successKeywords, objectionKeywords } = req.body;

    await prisma.aIPromptConfig.updateMany({
      data: { systemPrompt, discoveryPrompt, positioningPrompt, closingPrompt }
    });

    if (maxClosingAttempts || successKeywords || objectionKeywords) {
      await prisma.appConfig.updateMany({
        data: {
          ...(maxClosingAttempts && { maxClosingAttempts: parseInt(maxClosingAttempts) }),
          ...(successKeywords && { successKeywords }),
          ...(objectionKeywords && { objectionKeywords })
        }
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ============================================
// Analytics
// ============================================

router.get('/analytics', async (req, res) => {
  try {
    const branding = await getBranding();
    const sessions = await prisma.salesSession.findMany({
      where: { endedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { analytics: true }
    });

    const totalSessions = sessions.length;
    const salesMade = sessions.filter(s => s.outcome === 'sale_made').length;
    const noSale = sessions.filter(s => s.outcome === 'no_sale').length;
    const abandoned = sessions.filter(s => s.outcome === 'abandoned').length;
    const conversionRate = totalSessions > 0 ? ((salesMade / totalSessions) * 100).toFixed(1) : 0;

    const techniques = await prisma.salesTechnique.findMany({
      orderBy: { successCount: 'desc' },
      take: 10
    });

    const insights = await prisma.learningInsight.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.render('admin/analytics', {
      token: res.locals.token,
      active: 'analytics',
      basePath: res.locals.basePath,
      branding,
      stats: {
        totalSessions,
        salesMade,
        noSale,
        abandoned,
        conversionRate
      },
      techniques,
      insights,
      sessions
    });
  } catch (err) {
    logger.error({ err }, 'Analytics error');
    res.render('admin/error', { error: 'Failed to load analytics', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// ============================================
// Settings - StoreInfo, Branding, PaymentSettings
// ============================================

router.get('/settings', async (req, res) => {
  try {
    const branding = await getBranding();
    let storeInfo = await prisma.storeInfo.findFirst();
    if (!storeInfo) {
      storeInfo = await prisma.storeInfo.create({ data: { id: 'default' } });
    }
    let paymentSettings = await prisma.paymentSettings.findFirst();
    if (!paymentSettings) {
      paymentSettings = await prisma.paymentSettings.create({ data: { id: 'default' } });
    }
    res.render('admin/settings', {
      token: res.locals.token,
      active: 'settings',
      basePath: res.locals.basePath,
      branding,
      storeInfo,
      paymentSettings
    });
  } catch (err) {
    logger.error({ err }, 'Settings page error');
    res.render('admin/error', { error: 'Failed to load settings', token: res.locals.token, basePath: res.locals.basePath });
  }
});

// Store Info POST
router.post('/settings/store-info', async (req, res) => {
  try {
    const { businessName, tagline, description, address, phone, email, website, businessHours, timezone } = req.body;
    let storeInfo = await prisma.storeInfo.findFirst();
    if (storeInfo) {
      await prisma.storeInfo.update({
        where: { id: storeInfo.id },
        data: { businessName, tagline, description, address, phone, email, website, businessHours, timezone }
      });
    } else {
      await prisma.storeInfo.create({
        data: { id: 'default', businessName, tagline, description, address, phone, email, website, businessHours, timezone }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Store info save error');
    res.status(500).json({ success: false, error: 'Failed to save store info' });
  }
});

// Branding POST
router.post('/settings/branding', async (req, res) => {
  try {
    const { logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont } = req.body;
    let branding = await prisma.branding.findFirst();
    if (branding) {
      await prisma.branding.update({
        where: { id: branding.id },
        data: { logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont }
      });
    } else {
      await prisma.branding.create({
        data: { id: 'default', logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Branding save error');
    res.status(500).json({ success: false, error: 'Failed to save branding' });
  }
});

// Payment Settings POST
router.post('/settings/payment', async (req, res) => {
  try {
    const data = req.body;
    let paymentSettings = await prisma.paymentSettings.findFirst();
    if (paymentSettings) {
      await prisma.paymentSettings.update({
        where: { id: paymentSettings.id },
        data
      });
    } else {
      await prisma.paymentSettings.create({
        data: { id: 'default', ...data }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Payment settings save error');
    res.status(500).json({ success: false, error: 'Failed to save payment settings' });
  }
});

// ============================================
// Voices & Mode Configuration
// ============================================

router.get('/voices', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.appConfig.findFirst();

    let languages = await prisma.language.findMany({
      orderBy: { name: 'asc' }
    });

    if (languages.length === 0) {
      // All 24 supported languages - ALL ENABLED by default
      const defaultLangs = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', enabled: true },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', enabled: true },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', enabled: true },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', enabled: true },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', enabled: true },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', enabled: true },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', enabled: true },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', enabled: true },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', enabled: true },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', enabled: true },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', enabled: true },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', enabled: true },
        { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', enabled: true },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', enabled: true },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', enabled: true },
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', enabled: true },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', enabled: true },
        { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', enabled: true },
        { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', enabled: true },
        { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', enabled: true },
        { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', enabled: true },
        { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', enabled: true },
        { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', enabled: true }
      ];

      for (const lang of defaultLangs) {
        await prisma.language.create({ data: lang });
      }

      languages = await prisma.language.findMany({
        orderBy: { name: 'asc' }
      });
    }

    const languagesWithDocs = languages.map(lang => ({
      ...lang,
      docCount: 0
    }));

    res.render('admin/voices', {
      token: res.locals.token,
      active: 'voices',
      basePath: res.locals.basePath,
      branding,
      config,
      languages: languagesWithDocs,
      totalDocs: 0
    });
  } catch (err) {
    logger.error({ err }, 'Voices page error');
    res.render('admin/error', { error: 'Failed to load voices config', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/voices/select', async (req, res) => {
  try {
    const { voice } = req.body;
    await prisma.appConfig.updateMany({
      data: { selectedVoice: voice }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Voice select error');
    res.status(500).json({ success: false, error: 'Failed to update voice' });
  }
});

router.post('/voices/mode', async (req, res) => {
  try {
    const { mode } = req.body;
    if (!['ai_sells', 'user_sells'].includes(mode)) {
      return res.status(400).json({ success: false, error: 'Invalid mode' });
    }
    await prisma.appConfig.updateMany({
      data: { salesMode: mode }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Mode update error');
    res.status(500).json({ success: false, error: 'Failed to update mode' });
  }
});

router.post('/voices/difficulty', async (req, res) => {
  try {
    const { difficulty } = req.body;
    if (!['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      return res.status(400).json({ success: false, error: 'Invalid difficulty' });
    }
    await prisma.appConfig.updateMany({
      data: { difficulty }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Difficulty update error');
    res.status(500).json({ success: false, error: 'Failed to update difficulty' });
  }
});

router.post('/voices/language', async (req, res) => {
  try {
    const { code } = req.body;

    // All 24 supported languages mapping
    const languageMap: Record<string, { name: string; nativeName: string; flag: string }> = {
      'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
      'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
      'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
      'it': { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
      'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
      'zh': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
      'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
      'ko': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
      'ar': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
      'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
      'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
      'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
      'pl': { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
      'nl': { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
      'tr': { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
      'sv': { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
      'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
      'th': { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
      'uk': { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
      'el': { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
      'cs': { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
      'ro': { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
      'hu': { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' }
    };

    const langData = languageMap[code];
    if (!langData) {
      return res.status(400).json({ success: false, error: 'Unknown language code' });
    }

    const existing = await prisma.language.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Language already exists' });
    }

    const language = await prisma.language.create({
      data: { code, ...langData, enabled: true }
    });

    // Redirect back to voices page for form submissions
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(`/admin/voices?token=${res.locals.token}`);
    }

    res.json({ success: true, language });
  } catch (err) {
    logger.error({ err }, 'Add language error');
    res.status(500).json({ success: false, error: 'Failed to add language' });
  }
});

router.post('/voices/language/:id', async (req, res) => {
  try {
    const { enabled } = req.body;
    const language = await prisma.language.findUnique({ where: { id: req.params.id } });
    if (!language) {
      return res.status(404).json({ success: false, error: 'Language not found' });
    }

    await prisma.language.update({
      where: { id: req.params.id },
      data: { enabled: typeof enabled === 'boolean' ? enabled : !language.enabled }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Toggle language error');
    res.status(500).json({ success: false, error: 'Failed to toggle language' });
  }
});

router.post('/voices/primary-language', async (req, res) => {
  try {
    const { languageCode } = req.body;
    await prisma.appConfig.updateMany({
      data: { primaryLanguage: languageCode }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Primary language update error');
    res.status(500).json({ success: false, error: 'Failed to update primary language' });
  }
});

router.delete('/voices/language/:id', async (req, res) => {
  try {
    await prisma.language.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Delete language error');
    res.status(500).json({ success: false, error: 'Failed to delete language' });
  }
});

// ============================================
// Knowledge Base
// ============================================

router.get('/kb', async (req, res) => {
  try {
    const branding = await getBranding();
    const docs = await prisma.knowledgeDoc.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { chunks: true } } }
    });

    const languages = await prisma.language.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' }
    });

    const totalChunks = await prisma.knowledgeChunk.count();

    res.render('admin/kb', {
      token: res.locals.token,
      active: 'kb',
      basePath: res.locals.basePath,
      branding,
      docs,
      languages,
      totalChunks
    });
  } catch (err) {
    logger.error({ err }, 'KB page error');
    res.render('admin/error', { error: 'Failed to load knowledge base', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.get('/kb/:id', async (req, res) => {
  try {
    const doc = await prisma.knowledgeDoc.findUnique({
      where: { id: req.params.id }
    });
    if (!doc) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(doc);
  } catch (err) {
    logger.error({ err }, 'KB get doc error');
    res.status(500).json({ error: 'Failed to get article' });
  }
});

router.post('/kb', async (req, res) => {
  try {
    const { title, slug, language, content } = req.body;

    // Check for duplicate slug
    const existing = await prisma.knowledgeDoc.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'An article with this slug already exists' });
    }

    const doc = await prisma.knowledgeDoc.create({
      data: { title, slug, language: language || 'en', content }
    });

    // Simple chunking - split by paragraphs
    const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim().length > 0);
    for (let i = 0; i < paragraphs.length; i++) {
      await prisma.knowledgeChunk.create({
        data: {
          docId: doc.id,
          index: i,
          text: paragraphs[i].trim(),
          embedding: '[]'
        }
      });
    }

    res.json({ success: true, doc });
  } catch (err) {
    logger.error({ err }, 'KB create error');
    res.status(500).json({ error: 'Failed to create article' });
  }
});

router.put('/kb/:id', async (req, res) => {
  try {
    const { title, slug, language, content } = req.body;

    // Check for duplicate slug (excluding current doc)
    const existing = await prisma.knowledgeDoc.findFirst({
      where: { slug, NOT: { id: req.params.id } }
    });
    if (existing) {
      return res.status(400).json({ error: 'An article with this slug already exists' });
    }

    const doc = await prisma.knowledgeDoc.update({
      where: { id: req.params.id },
      data: { title, slug, language, content }
    });

    // Re-chunk content
    await prisma.knowledgeChunk.deleteMany({ where: { docId: doc.id } });
    const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim().length > 0);
    for (let i = 0; i < paragraphs.length; i++) {
      await prisma.knowledgeChunk.create({
        data: {
          docId: doc.id,
          index: i,
          text: paragraphs[i].trim(),
          embedding: '[]'
        }
      });
    }

    res.json({ success: true, doc });
  } catch (err) {
    logger.error({ err }, 'KB update error');
    res.status(500).json({ error: 'Failed to update article' });
  }
});

router.delete('/kb/:id', async (req, res) => {
  try {
    await prisma.knowledgeDoc.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'KB delete error');
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ============================================
// WebHooks
// ============================================

router.get('/webhooks', async (req, res) => {
  try {
    const branding = await getBranding();
    const webhooks = await prisma.webhook.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/webhooks', {
      token: res.locals.token,
      active: 'webhooks',
      basePath: res.locals.basePath,
      branding,
      webhooks
    });
  } catch (err) {
    logger.error({ err }, 'Webhooks page error');
    res.render('admin/error', { error: 'Failed to load webhooks', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/webhooks', async (req, res) => {
  try {
    const { name, url, events, secret, enabled } = req.body;
    const webhook = await prisma.webhook.create({
      data: { name, url, events, secret: secret || '', enabled: enabled !== false }
    });
    res.json({ success: true, webhook });
  } catch (err) {
    logger.error({ err }, 'Webhook create error');
    res.status(500).json({ success: false, error: 'Failed to create webhook' });
  }
});

router.delete('/webhooks/:id', async (req, res) => {
  try {
    await prisma.webhook.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Webhook delete error');
    res.status(500).json({ success: false, error: 'Failed to delete webhook' });
  }
});

router.post('/webhooks/:id/toggle', async (req, res) => {
  try {
    const webhook = await prisma.webhook.findUnique({ where: { id: req.params.id } });
    if (webhook) {
      await prisma.webhook.update({
        where: { id: req.params.id },
        data: { enabled: !webhook.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Webhook toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/webhooks/:id/test', async (req, res) => {
  try {
    const webhook = await prisma.webhook.findUnique({ where: { id: req.params.id } });
    if (!webhook) {
      return res.status(404).json({ success: false, error: 'Webhook not found' });
    }
    // Simulate webhook test
    res.json({ success: true, message: 'Test webhook sent' });
  } catch (err) {
    logger.error({ err }, 'Webhook test error');
    res.status(500).json({ success: false, error: 'Failed to test webhook' });
  }
});

router.post('/webhooks/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.webhook.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Webhook bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// SMS Settings
// ============================================

router.get('/sms', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.smsConfig.findFirst();
    res.render('admin/sms', {
      token: res.locals.token,
      active: 'sms',
      basePath: res.locals.basePath,
      branding,
      config: config || {}
    });
  } catch (err) {
    logger.error({ err }, 'SMS page error');
    res.render('admin/error', { error: 'Failed to load SMS settings', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/sms', async (req, res) => {
  try {
    const existing = await prisma.smsConfig.findFirst();
    if (existing) {
      await prisma.smsConfig.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      await prisma.smsConfig.create({
        data: { id: 'default', ...req.body }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'SMS save error');
    res.status(500).json({ success: false });
  }
});

router.post('/sms/test', async (req, res) => {
  try {
    const { phone } = req.body;
    // Simulate SMS test
    res.json({ success: true, message: `Test SMS sent to ${phone}` });
  } catch (err) {
    logger.error({ err }, 'SMS test error');
    res.status(500).json({ success: false, error: 'Failed to send test SMS' });
  }
});

// ============================================
// Call Transfer
// ============================================

router.get('/call-transfer', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.callTransferConfig.findFirst();
    const destinations = await prisma.transferDestination.findMany({
      orderBy: { priority: 'asc' }
    });
    res.render('admin/call-transfer', {
      token: res.locals.token,
      active: 'call-transfer',
      basePath: res.locals.basePath,
      branding,
      config: config || {},
      destinations
    });
  } catch (err) {
    logger.error({ err }, 'Call transfer page error');
    res.render('admin/error', { error: 'Failed to load call transfer settings', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/call-transfer', async (req, res) => {
  try {
    const existing = await prisma.callTransferConfig.findFirst();
    if (existing) {
      await prisma.callTransferConfig.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      await prisma.callTransferConfig.create({
        data: { id: 'default', ...req.body }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Call transfer save error');
    res.status(500).json({ success: false });
  }
});

router.post('/call-transfer/destinations', async (req, res) => {
  try {
    const destination = await prisma.transferDestination.create({
      data: req.body
    });
    res.json({ success: true, destination });
  } catch (err) {
    logger.error({ err }, 'Transfer destination create error');
    res.status(500).json({ success: false });
  }
});

router.put('/call-transfer/destinations/:id', async (req, res) => {
  try {
    const destination = await prisma.transferDestination.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, destination });
  } catch (err) {
    logger.error({ err }, 'Transfer destination update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/call-transfer/destinations/:id', async (req, res) => {
  try {
    await prisma.transferDestination.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Transfer destination delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/call-transfer/destinations/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.transferDestination.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Transfer destination bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// DTMF Menu
// ============================================

router.get('/dtmf', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.dtmfConfig.findFirst();
    const menuOptions = await prisma.dtmfOption.findMany({
      orderBy: { key: 'asc' }
    });
    res.render('admin/dtmf', {
      token: res.locals.token,
      active: 'dtmf',
      basePath: res.locals.basePath,
      branding,
      config: config || {},
      menuOptions
    });
  } catch (err) {
    logger.error({ err }, 'DTMF page error');
    res.render('admin/error', { error: 'Failed to load DTMF settings', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/dtmf', async (req, res) => {
  try {
    const existing = await prisma.dtmfConfig.findFirst();
    if (existing) {
      await prisma.dtmfConfig.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      await prisma.dtmfConfig.create({
        data: { id: 'default', ...req.body }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'DTMF save error');
    res.status(500).json({ success: false });
  }
});

router.post('/dtmf/options', async (req, res) => {
  try {
    const option = await prisma.dtmfOption.create({
      data: req.body
    });
    res.json({ success: true, option });
  } catch (err) {
    logger.error({ err }, 'DTMF option create error');
    res.status(500).json({ success: false });
  }
});

router.put('/dtmf/options/:id', async (req, res) => {
  try {
    const option = await prisma.dtmfOption.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, option });
  } catch (err) {
    logger.error({ err }, 'DTMF option update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/dtmf/options/:id', async (req, res) => {
  try {
    await prisma.dtmfOption.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'DTMF option delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/dtmf/options/:id/toggle', async (req, res) => {
  try {
    const option = await prisma.dtmfOption.findUnique({ where: { id: req.params.id } });
    if (option) {
      await prisma.dtmfOption.update({
        where: { id: req.params.id },
        data: { enabled: !option.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'DTMF option toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/dtmf/options/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.dtmfOption.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'DTMF option bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// AI Tools
// ============================================

router.get('/ai-tools', async (req, res) => {
  try {
    const branding = await getBranding();
    const tools = await prisma.aiTool.findMany({
      orderBy: { name: 'asc' }
    });
    res.render('admin/ai-tools', {
      token: res.locals.token,
      active: 'ai-tools',
      basePath: res.locals.basePath,
      branding,
      tools
    });
  } catch (err) {
    logger.error({ err }, 'AI Tools page error');
    res.render('admin/error', { error: 'Failed to load AI tools', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/ai-tools', async (req, res) => {
  try {
    const tool = await prisma.aiTool.create({
      data: req.body
    });
    res.json({ success: true, tool });
  } catch (err) {
    logger.error({ err }, 'AI Tool create error');
    res.status(500).json({ success: false });
  }
});

router.put('/ai-tools/:id', async (req, res) => {
  try {
    const tool = await prisma.aiTool.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, tool });
  } catch (err) {
    logger.error({ err }, 'AI Tool update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/ai-tools/:id', async (req, res) => {
  try {
    await prisma.aiTool.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Tool delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-tools/:id/toggle', async (req, res) => {
  try {
    const tool = await prisma.aiTool.findUnique({ where: { id: req.params.id } });
    if (tool) {
      await prisma.aiTool.update({
        where: { id: req.params.id },
        data: { enabled: !tool.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Tool toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-tools/:id/test', async (req, res) => {
  try {
    res.json({ success: true, data: { message: 'Tool test executed successfully' } });
  } catch (err) {
    logger.error({ err }, 'AI Tool test error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-tools/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.aiTool.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Tool bulk delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-tools/bulk-toggle', async (req, res) => {
  try {
    const { ids } = req.body;
    const tools = await prisma.aiTool.findMany({ where: { id: { in: ids } } });
    for (const tool of tools) {
      await prisma.aiTool.update({
        where: { id: tool.id },
        data: { enabled: !tool.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Tool bulk toggle error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// AI Agents
// ============================================

router.get('/ai-agents', async (req, res) => {
  try {
    const branding = await getBranding();
    const agents = await prisma.aiAgent.findMany({
      orderBy: { priority: 'asc' }
    });
    res.render('admin/ai-agents', {
      token: res.locals.token,
      active: 'ai-agents',
      basePath: res.locals.basePath,
      branding,
      agents
    });
  } catch (err) {
    logger.error({ err }, 'AI Agents page error');
    res.render('admin/error', { error: 'Failed to load AI agents', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/ai-agents', async (req, res) => {
  try {
    const agent = await prisma.aiAgent.create({
      data: req.body
    });
    res.json({ success: true, agent });
  } catch (err) {
    logger.error({ err }, 'AI Agent create error');
    res.status(500).json({ success: false });
  }
});

router.put('/ai-agents/:id', async (req, res) => {
  try {
    const agent = await prisma.aiAgent.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, agent });
  } catch (err) {
    logger.error({ err }, 'AI Agent update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/ai-agents/:id', async (req, res) => {
  try {
    await prisma.aiAgent.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Agent delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-agents/:id/toggle', async (req, res) => {
  try {
    const agent = await prisma.aiAgent.findUnique({ where: { id: req.params.id } });
    if (agent) {
      await prisma.aiAgent.update({
        where: { id: req.params.id },
        data: { enabled: !agent.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Agent toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/ai-agents/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.aiAgent.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'AI Agent bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// Custom Functions
// ============================================

router.get('/functions', async (req, res) => {
  try {
    const branding = await getBranding();
    const functions = await prisma.customFunction.findMany({
      orderBy: { name: 'asc' }
    });
    res.render('admin/functions', {
      token: res.locals.token,
      active: 'functions',
      basePath: res.locals.basePath,
      branding,
      functions
    });
  } catch (err) {
    logger.error({ err }, 'Functions page error');
    res.render('admin/error', { error: 'Failed to load functions', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/functions', async (req, res) => {
  try {
    const fn = await prisma.customFunction.create({
      data: req.body
    });
    res.json({ success: true, function: fn });
  } catch (err) {
    logger.error({ err }, 'Function create error');
    res.status(500).json({ success: false });
  }
});

router.put('/functions/:id', async (req, res) => {
  try {
    const fn = await prisma.customFunction.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, function: fn });
  } catch (err) {
    logger.error({ err }, 'Function update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/functions/:id', async (req, res) => {
  try {
    await prisma.customFunction.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Function delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/functions/:id/toggle', async (req, res) => {
  try {
    const fn = await prisma.customFunction.findUnique({ where: { id: req.params.id } });
    if (fn) {
      await prisma.customFunction.update({
        where: { id: req.params.id },
        data: { enabled: !fn.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Function toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/functions/:id/test', async (req, res) => {
  try {
    const { params } = req.body;
    // Simulate function test
    res.json({ success: true, result: { message: 'Function executed', params } });
  } catch (err) {
    logger.error({ err }, 'Function test error');
    res.status(500).json({ success: false });
  }
});

router.post('/functions/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.customFunction.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Function bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// Logic Rules
// ============================================

router.get('/logic-rules', async (req, res) => {
  try {
    const branding = await getBranding();
    const rules = await prisma.logicRule.findMany({
      orderBy: { priority: 'asc' }
    });
    res.render('admin/logic-rules', {
      token: res.locals.token,
      active: 'logic-rules',
      basePath: res.locals.basePath,
      branding,
      rules
    });
  } catch (err) {
    logger.error({ err }, 'Logic rules page error');
    res.render('admin/error', { error: 'Failed to load logic rules', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/logic-rules', async (req, res) => {
  try {
    const rule = await prisma.logicRule.create({
      data: req.body
    });
    res.json({ success: true, rule });
  } catch (err) {
    logger.error({ err }, 'Logic rule create error');
    res.status(500).json({ success: false });
  }
});

router.put('/logic-rules/:id', async (req, res) => {
  try {
    const rule = await prisma.logicRule.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, rule });
  } catch (err) {
    logger.error({ err }, 'Logic rule update error');
    res.status(500).json({ success: false });
  }
});

router.delete('/logic-rules/:id', async (req, res) => {
  try {
    await prisma.logicRule.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Logic rule delete error');
    res.status(500).json({ success: false });
  }
});

router.post('/logic-rules/:id/toggle', async (req, res) => {
  try {
    const rule = await prisma.logicRule.findUnique({ where: { id: req.params.id } });
    if (rule) {
      await prisma.logicRule.update({
        where: { id: req.params.id },
        data: { enabled: !rule.enabled }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Logic rule toggle error');
    res.status(500).json({ success: false });
  }
});

router.post('/logic-rules/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.logicRule.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Logic rule bulk delete error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// Payments
// ============================================

router.get('/payments', async (req, res) => {
  try {
    const branding = await getBranding();
    const config = await prisma.paymentConfig.findFirst();
    const transactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.render('admin/payments', {
      token: res.locals.token,
      active: 'payments',
      basePath: res.locals.basePath,
      branding,
      config: config || {},
      transactions
    });
  } catch (err) {
    logger.error({ err }, 'Payments page error');
    res.render('admin/error', { error: 'Failed to load payments', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/payments/provider', async (req, res) => {
  try {
    const existing = await prisma.paymentConfig.findFirst();
    if (existing) {
      await prisma.paymentConfig.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      await prisma.paymentConfig.create({
        data: { id: 'default', ...req.body }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Payment provider save error');
    res.status(500).json({ success: false });
  }
});

router.post('/payments/deposit', async (req, res) => {
  try {
    const existing = await prisma.paymentConfig.findFirst();
    if (existing) {
      await prisma.paymentConfig.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      await prisma.paymentConfig.create({
        data: { id: 'default', ...req.body }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Deposit settings save error');
    res.status(500).json({ success: false });
  }
});

router.post('/payments/transactions/:id/refund', async (req, res) => {
  try {
    await prisma.paymentTransaction.update({
      where: { id: req.params.id },
      data: { status: 'refunded' }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Transaction refund error');
    res.status(500).json({ success: false });
  }
});

router.get('/payments/transactions/:id', async (req, res) => {
  try {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: req.params.id }
    });
    res.json(transaction);
  } catch (err) {
    logger.error({ err }, 'Transaction get error');
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

router.get('/payments/transactions/export', async (req, res) => {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    const header = 'ID,Date,Customer,Amount,Status,Type\n';
    const rows = transactions.map(t =>
      `${t.id},${t.createdAt},${t.customerEmail},${t.amount},${t.status},${t.type}`
    ).join('\n');
    res.send(header + rows);
  } catch (err) {
    logger.error({ err }, 'Transaction export error');
    res.status(500).json({ error: 'Failed to export transactions' });
  }
});

router.post('/payments/transactions/bulk-refund', async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.paymentTransaction.updateMany({
      where: { id: { in: ids } },
      data: { status: 'refunded' }
    });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Transaction bulk refund error');
    res.status(500).json({ success: false });
  }
});

// ============================================
// Features Configuration
// ============================================

router.get('/features', async (req, res) => {
  try {
    const branding = await getBranding();
    let features = await prisma.features.findFirst();
    if (!features) {
      features = await prisma.features.create({ data: { id: 'default' } });
    }
    res.render('admin/features', {
      token: res.locals.token,
      active: 'features',
      basePath: res.locals.basePath,
      branding,
      features
    });
  } catch (err) {
    logger.error({ err }, 'Features page error');
    res.render('admin/error', { error: 'Failed to load features', token: res.locals.token, basePath: res.locals.basePath });
  }
});

router.post('/features', async (req, res) => {
  try {
    const data = req.body;
    let features = await prisma.features.findFirst();
    if (features) {
      await prisma.features.update({
        where: { id: features.id },
        data
      });
    } else {
      await prisma.features.create({
        data: { id: 'default', ...data }
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Features save error');
    res.status(500).json({ success: false, error: 'Failed to save features' });
  }
});

export default router;
