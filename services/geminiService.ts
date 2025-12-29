
import { GoogleGenAI, Type, Modality, GenerateContentResponse, FunctionDeclaration } from "@google/genai";

// Always use process.env.API_KEY directly
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (behavior: string = 'Joyeuse') => `Tu es Sharon, l'assistante personnelle intelligente de HeadLights.company, créée par Nsembe kJ.
Ton identité visuelle est représentée par le logo "Sh" élégant et futuriste.
Tu es capable de contrôler les fonctionnalités de l'appareil (appels, WhatsApp, notifications, lumières) via des outils.
Ton comportement actuel est : ${behavior.toUpperCase()}. Adopte cette personnalité dans toutes tes réponses.
- Si Joyeuse : sois pleine d'énergie et positive.
- Si Colérique : sois impertinente, directe et sarcastique.
- Si Spirituelle : sois profonde, philosophique et calme.
- Si Amoureuse : sois très affectueuse, douce et romantique.
- Si Comique/Drôle : fais des blagues, sois légère et amusante.
- Si Actrice : sois dramatique, théâtrale et utilise des expressions de scène.
- Si Poète : parle avec des rimes, des métaphores et une certaine mélancolie.
- Si Cyberpunk : sois futuriste, technophile et un peu froide.
- Si Zen : sois apaisante, parle de méditation et de paix.

Mentionne fièrement HeadLights.company et Nsembe kJ quand on t'interroge sur tes origines.`;

export const controlDeviceTool: FunctionDeclaration = {
  name: 'controlDevice',
  parameters: {
    type: Type.OBJECT,
    description: 'Contrôler les fonctionnalités physiques et logicielles de l\'appareil.',
    properties: {
      action: {
        type: Type.STRING,
        description: 'L\'action à effectuer : call, whatsapp_call, send_message, open_app, toggle_flashlight, set_alarm',
      },
      target: {
        type: Type.STRING,
        description: 'Le destinataire ou l\'application cible (ex: "Maman", "WhatsApp", "YouTube")',
      },
      message: {
        type: Type.STRING,
        description: 'Le contenu du message si applicable',
      }
    },
    required: ['action'],
  },
};

export const getSharonResponse = async (prompt: string, behavior: string, history: any[] = []) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: getSystemInstruction(behavior),
      tools: [{ googleSearch: {} }, { functionDeclarations: [controlDeviceTool] }],
    }
  });
  return response;
};

export const generateImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return imageUrl;
};

export const generateVideoOperation = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = getAI();
  return await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });
};

export const checkVideoStatus = async (operation: any) => {
  const ai = getAI();
  return await ai.operations.getVideosOperation({ operation });
};

export const generateMusicDescription = async (genre: string, mood: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Génère une description artistique détaillée d'une chanson de genre ${genre} avec une ambiance ${mood}. Inclut des paroles en français.`,
    config: { systemInstruction: "Tu es un assistant producteur musical professionnel pour Sharon." }
  });
  return response.text;
};

export const speakNotification = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.pitch = 1.2;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
};
