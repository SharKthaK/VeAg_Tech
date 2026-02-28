import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

const DEFAULT_PROMPTS = {
  treatment: process.env.GEMINI_TREATMENT_PROMPT || `You are an expert agricultural scientist and plant pathologist. For the crop disease "{disease}", provide a comprehensive and practical treatment guide.

Structure your response EXACTLY in this format:

## Immediate Actions
- List 2-3 urgent steps farmers should take right away

## Chemical Treatment
- Recommended fungicides/pesticides with specific names
- Dosage and application method for each
- Application frequency and timing

## Organic & Natural Alternatives
- Natural/biological treatment options
- Home remedies if applicable
- Bio-control agents

## Step-by-Step Treatment Protocol
1. First step with details
2. Second step with details
3. Continue as needed

## Recovery Timeline
- Expected time for visible improvement
- Full recovery duration
- Signs of successful treatment

Keep responses concise, practical, and actionable for farmers. Use simple language.`,

  causes: process.env.GEMINI_CAUSES_PROMPT || `You are an expert agricultural scientist and plant pathologist. For the crop disease "{disease}", explain the causes comprehensively.

Structure your response EXACTLY in this format:

## Pathogen Information
- Scientific name and type of pathogen (fungus, bacteria, virus, etc.)
- Classification and characteristics

## Environmental Conditions
- Temperature range that favors the disease
- Humidity and moisture requirements
- Seasonal patterns

## How It Spreads
- Primary transmission methods
- Secondary spread mechanisms
- Role of vectors (insects, wind, water, etc.)

## Risk Factors
- Vulnerable growth stages of the crop
- Soil conditions that increase risk
- Agricultural practices that contribute

## Early Warning Signs
- First visible symptoms to watch for
- Progression of symptoms over time
- How to distinguish from similar diseases

Keep responses scientifically accurate yet easy to understand for farmers.`,

  prevention: process.env.GEMINI_PREVENTION_PROMPT || `You are an expert agricultural scientist and plant pathologist. For the crop disease "{disease}", provide comprehensive prevention strategies.

Structure your response EXACTLY in this format:

## Pre-Planting Measures
- Seed selection and treatment
- Soil preparation and treatment
- Field sanitation steps

## Cultural Practices
- Crop rotation recommendations
- Spacing and planting density
- Irrigation management
- Nutrient management

## Resistant Varieties
- Disease-resistant varieties available
- Where to source resistant seeds
- Performance characteristics

## Monitoring & Early Detection
- Regular inspection schedule
- What to look for during inspections
- Tools and techniques for early detection

## Seasonal Prevention Calendar
- Pre-season preparation
- During growing season
- Post-harvest measures

Keep responses practical and actionable for farmers. Use simple language.`
};

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  initialize() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
      console.log('Gemini AI service initialized successfully');
    }
    return this.model;
  }

  async generateContent(diseaseName, type) {
    try {
      const model = this.initialize();
      
      const promptTemplate = DEFAULT_PROMPTS[type];
      if (!promptTemplate) {
        throw new Error(`Invalid content type: ${type}. Must be one of: treatment, causes, prevention`);
      }

      const prompt = promptTemplate.replace(/\{disease\}/g, diseaseName);
      
      console.log(`Generating ${type} content for disease: ${diseaseName}`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Gemini returned an empty response');
      }

      console.log(`Successfully generated ${type} content for: ${diseaseName}`);

      return {
        success: true,
        content: text.trim()
      };
    } catch (error) {
      console.error(`Gemini API error (${type} for ${diseaseName}):`, error);
      return {
        success: false,
        error: error.message || 'Failed to generate content from Gemini AI'
      };
    }
  }
}

export default new GeminiService();
