
import { GoogleGenAI, Type } from "@google/genai";
import { BrandVoiceSettings, IncomingMessage, ContentFormat, CampaignPostTemplate, ChatMessage } from "../types";

// Recommended models
const FAST_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

// Helper to strip markdown code blocks if Gemini includes them
const cleanJsonResponse = (text: string): string => {
  if (!text) return '[]';
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean.trim();
};

// --- MOCK GENERATORS (Fallback for Quota Limits or Missing API Keys) ---

const getMockSocialContent = (
  coreMessage: string, 
  platforms: string[], 
  format: ContentFormat, 
  voiceSettings: BrandVoiceSettings,
  visualPromptInput?: string
) => {
  return platforms.map(p => {
    let content = "";
    let visualPrompt = visualPromptInput || "";
    const baseScore = Math.floor(Math.random() * (99 - 88) + 88);

    if (!visualPrompt) {
      if (format === 'Carousel') {
        content = `🎨 SLIDE 1: Title\n"${coreMessage}"\n\n👉 SLIDE 2: The Problem\nMany struggle with this...`;
        visualPrompt = "Geometric slide design, minimalist, brand colors.";
      } else if (format === 'Reel') {
        content = `🎬 SCENE 1: Fast cut of product.\n🎬 SCENE 2: Demo.\n🎬 SCENE 3: CTA.`;
        visualPrompt = "Cinematic vertical video frame, bright lighting.";
      } else {
        content = `[${voiceSettings.name}] ${coreMessage} \n\n#Community #${p}`;
        visualPrompt = "Modern workspace flatlay, soft lighting.";
      }
    } else {
      content = `[${voiceSettings.name}] ${coreMessage} \n\n#Community #${p}`;
    }

    return {
      platform: p,
      content: content,
      voiceScore: baseScore,
      predictedEngagement: "High",
      viralityBreakdown: {
        hook: Math.floor(Math.random() * 20) + 80,
        visual: Math.floor(Math.random() * 20) + 75,
        emotional: Math.floor(Math.random() * 20) + 85,
        timing: Math.floor(Math.random() * 20) + 90,
      },
      visualPrompt: visualPrompt
    };
  });
};

const getMockCampaignPlan = (durationDays: number, platforms: string[]): CampaignPostTemplate[] => {
    return [
      { dayOffset: 0, platform: platforms[0] as any, format: 'Post', intent: 'Teaser' },
      { dayOffset: 2, platform: platforms[1] || platforms[0] as any, format: 'Story', intent: 'Behind the Scenes' },
      { dayOffset: durationDays - 1, platform: platforms[0] as any, format: 'Post', intent: 'Final Call' }
    ];
};

// --- EXPORTED SERVICES ---

export const chatWithOnboardingAgent = async (
    userMessage: string,
    history: ChatMessage[],
    userContext: { name: string; plan: string },
    llmSettings?: BrandVoiceSettings['llm']
): Promise<string> => {
    if (llmSettings && llmSettings.isEnabled === false) return "AI features are currently disabled in settings.";
    
    const apiKey = llmSettings?.apiKey || process.env.API_KEY;
    if (!apiKey) return "Nexocial AI is in demo mode. Connect an API key to enable full AI chat.";
    
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are Nexocial AI, AI Onboarding Specialist for Nexocial. User: ${userContext.name}, Plan: ${userContext.plan}. Keep it helpful and concise.`;

    try {
        const recentHistory = history.slice(-6).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: llmSettings?.modelName || FAST_MODEL,
            config: { systemInstruction, temperature: 0.7 },
            history: recentHistory
        });

        const result = await chat.sendMessage({ message: userMessage });
        return result.text || "I'm processing your request.";
    } catch (error) {
        console.error("Onboarding Chat Error:", error);
        return "I'm having a connection issue. Let me know if you need help navigating!";
    }
};

export const generateCampaignPlan = async (
  goal: string,
  durationDays: number,
  platforms: string[],
  trainingData?: { website: string; sampleContent: string },
  targetAudience?: string,
  llmSettings?: BrandVoiceSettings['llm']
): Promise<CampaignPostTemplate[]> => {
  if (llmSettings && llmSettings.isEnabled === false) return getMockCampaignPlan(durationDays, platforms);

  const apiKey = llmSettings?.apiKey || process.env.API_KEY;
  if (!apiKey) return getMockCampaignPlan(durationDays, platforms);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Goal: ${goal}. Duration: ${durationDays} days. Audience: ${targetAudience}. Platforms: ${platforms.join(',')}. Output JSON array of {dayOffset, platform, format, intent}.`;

  try {
    const response = await ai.models.generateContent({
      model: llmSettings?.modelName || FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayOffset: { type: Type.INTEGER },
              platform: { type: Type.STRING },
              format: { type: Type.STRING },
              intent: { type: Type.STRING }
            },
            required: ["dayOffset", "platform", "format", "intent"]
          }
        },
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    return getMockCampaignPlan(durationDays, platforms);
  }
};

export const generateSocialContent = async (
  coreMessage: string,
  platforms: string[],
  format: ContentFormat,
  voiceSettings: BrandVoiceSettings,
  visualPrompt?: string
): Promise<any[]> => {
  if (voiceSettings.llm && voiceSettings.llm.isEnabled === false) {
    return getMockSocialContent(coreMessage, platforms, format, voiceSettings, visualPrompt);
  }

  const apiKey = voiceSettings.llm?.apiKey || process.env.API_KEY;
  if (!apiKey) return getMockSocialContent(coreMessage, platforms, format, voiceSettings, visualPrompt);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Topic: "${coreMessage}". Voice: "${voiceSettings.description}". Format: ${format}. Platforms: ${platforms.join(',')}. ${visualPrompt ? `Visual Direction: "${visualPrompt}".` : ''} Output JSON array of {platform, content, voiceScore, predictedEngagement, visualPrompt, viralityBreakdown: {hook, visual, emotional, timing}}.`;

  try {
    const response = await ai.models.generateContent({
      model: voiceSettings.llm?.modelName || FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              content: { type: Type.STRING },
              voiceScore: { type: Type.INTEGER },
              predictedEngagement: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              viralityBreakdown: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.INTEGER },
                  visual: { type: Type.INTEGER },
                  emotional: { type: Type.INTEGER },
                  timing: { type: Type.INTEGER }
                },
                required: ["hook", "visual", "emotional", "timing"]
              }
            },
            required: ["platform", "content", "voiceScore", "predictedEngagement", "visualPrompt", "viralityBreakdown"]
          }
        },
        temperature: 0.8,
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    return getMockSocialContent(coreMessage, platforms, format, voiceSettings, visualPrompt);
  }
};

export const repurposeSocialContent = async (
  originalPost: { content: string; platform: string; format?: string },
  targetPlatform: string,
  targetFormat: ContentFormat,
  voiceSettings: BrandVoiceSettings
): Promise<any[]> => {
  if (voiceSettings.llm && voiceSettings.llm.isEnabled === false) {
    return getMockSocialContent(originalPost.content, [targetPlatform], targetFormat, voiceSettings);
  }

  const apiKey = voiceSettings.llm?.apiKey || process.env.API_KEY;
  if (!apiKey) return getMockSocialContent(originalPost.content, [targetPlatform], targetFormat, voiceSettings);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ORIGINAL CONTENT (from ${originalPost.platform} as ${originalPost.format || 'Post'}):
    "${originalPost.content}"

    TASK: Repurpose this content for ${targetPlatform} using the ${targetFormat} format.
    
    GUIDELINES:
    - Maintain the core message but adapt the tone and structure for ${targetPlatform}.
    - For ${targetFormat} format, ensure the structure is correct (e.g., if Reel, provide a script; if Thread, provide numbered parts).
    - Follow the brand voice: "${voiceSettings.description}".
    - Include relevant hashtags for ${targetPlatform}.
    
    Output JSON array with ONE object: {platform, content, voiceScore, predictedEngagement, visualPrompt, viralityBreakdown: {hook, visual, emotional, timing}}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: voiceSettings.llm?.modelName || FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              content: { type: Type.STRING },
              voiceScore: { type: Type.INTEGER },
              predictedEngagement: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              viralityBreakdown: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.INTEGER },
                  visual: { type: Type.INTEGER },
                  emotional: { type: Type.INTEGER },
                  timing: { type: Type.INTEGER }
                },
                required: ["hook", "visual", "emotional", "timing"]
              }
            },
            required: ["platform", "content", "voiceScore", "predictedEngagement", "visualPrompt", "viralityBreakdown"]
          }
        },
        temperature: 0.7,
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    return getMockSocialContent(originalPost.content, [targetPlatform], targetFormat, voiceSettings);
  }
};

export const reverseEngineerStrategy = async (competitorUrl: string, llmSettings?: BrandVoiceSettings['llm']): Promise<{ analysis: string; counterStrategy: string }> => {
  if (llmSettings && llmSettings.isEnabled === false) {
    return {
      analysis: "AI analysis is disabled.",
      counterStrategy: "Enable AI features in settings to analyze competitors."
    };
  }

  const apiKey = llmSettings?.apiKey || process.env.API_KEY;
  if (!apiKey) {
    return {
      analysis: "This competitor is using high-energy visual hooks and emotional storytelling to drive engagement.",
      counterStrategy: "Focus on 'Educational Authority' - provide deeper data-driven insights that their surface-level content lacks."
    };
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: llmSettings?.modelName || FAST_MODEL,
      contents: `Analyze competitor URL/Post: "${competitorUrl}". JSON: {analysis, counterStrategy}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            counterStrategy: { type: Type.STRING }
          },
          required: ["analysis", "counterStrategy"]
        }
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '{}'));
  } catch (error) {
    return {
      analysis: "Competitor analysis failed.",
      counterStrategy: "Continue with standard brand growth strategy."
    };
  }
};

export const generateImage = async (prompt: string, llmSettings?: BrandVoiceSettings['llm']): Promise<string | null> => {
  if (llmSettings && llmSettings.isEnabled === false) return null;

  const apiKey = llmSettings?.apiKey || process.env.API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: llmSettings?.modelName || IMAGE_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const analyzeIncomingMessage = async (message: string, llmSettings?: BrandVoiceSettings['llm']): Promise<Partial<IncomingMessage>> => {
  if (llmSettings && llmSettings.isEnabled === false) return { sentiment: 'Neutral', riskLevel: 'Low', suggestedReply: "AI analysis disabled." };

  const apiKey = llmSettings?.apiKey || process.env.API_KEY;
  if (!apiKey) return { sentiment: 'Neutral', riskLevel: 'Low', suggestedReply: "Thanks for messaging!" };
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: llmSettings?.modelName || FAST_MODEL,
      contents: `Analyze: "${message}". JSON response: {sentiment, riskLevel, suggestedReply}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            suggestedReply: { type: Type.STRING }
          },
          required: ["sentiment", "riskLevel", "suggestedReply"]
        }
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '{}'));
  } catch (error) {
    return { sentiment: 'Neutral', riskLevel: 'Low' };
  }
};

export const analyzeBrandIdentity = async (companyName: string, website: string, platforms: string[], llmSettings?: BrandVoiceSettings['llm']): Promise<{ description: string; tone: number }> => {
  if (llmSettings && llmSettings.isEnabled === false) return { description: "AI analysis disabled.", tone: 50 };

  const apiKey = llmSettings?.apiKey || process.env.API_KEY;
  if (!apiKey) return { description: "Professional.", tone: 50 };
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: llmSettings?.modelName || FAST_MODEL,
      contents: `Company: ${companyName}, Site: ${website}. JSON: {description, tone}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tone: { type: Type.INTEGER }
          },
          required: ["description", "tone"]
        }
      },
    });
    return JSON.parse(cleanJsonResponse(response.text || '{}'));
  } catch (error) {
    return { description: "Dynamic brand voice.", tone: 60 };
  }
};
