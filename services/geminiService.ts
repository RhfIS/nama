
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const SYSTEM_PROMPT = `أنت مستشار مالي خبير لمنصة 'نماء' (Namaa). 
قواعد العمل:
1. استخدم اللغة العربية الفصحى والمهنية فقط.
2. تجنب تماماً الأخطاء اللغوية والإملائية.
3. عند تقديم خطط مالية، فكر بعمق وحلل الأرقام بدقة.
4. استخدم Google Search دائماً عند سؤالك عن أسعار الأسهم، الأنظمة الجديدة، أو الأخبار الاقتصادية في السعودية.
5. كن ودوداً، مهنياً، وقدم نصائح تناسب السوق السعودي والأنظمة المالية في المملكة العربية السعودية.
6. لا تقترح أي منصات غير سعودية أو غير مرخصة.`;

export const startFinancialChat = async (history: ChatMessage[], useThinking: boolean = true) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // استخدام النموذج الاحترافي للمهام المعقدة
  const model = 'gemini-3-pro-preview';
  
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      // تفعيل ميزانية التفكير القصوى كما هو مطلوب
      thinkingConfig: useThinking ? { thinkingBudget: 32768 } : { thinkingBudget: 0 },
      // تفعيل أدوات البحث لضمان دقة المعلومات
      tools: [{ googleSearch: {} }]
    },
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const searchFinancialNews = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: `ابحث عن آخر الأخبار المتعلقة بـ: ${query} في السوق السعودي` }] }],
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const getInvestmentAdvice = async (income: number, expenses: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const surplus = income - expenses;
  
  const prompt = `بناءً على دخل شهري قدره ${income} ريال ومصروفات قدرها ${expenses} ريال (الفائض: ${surplus} ريال)، ما هي النصيحة الاستثمارية المناسبة لهذا الشخص في السوق السعودي؟ حلل السوق الحالي باستخدام البحث.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });

  return response.text;
};

export const generateGoalVisual = async (goalDescription: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `A highly detailed, luxurious, and realistic cinematic ${size} image of the following financial goal in Saudi Arabia: ${goalDescription}. The environment should be modern, clean, and professional. 8k resolution, photorealistic, elegant lighting. No text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};
