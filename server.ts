import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route for Cleromancy Divination Analysis
app.post('/api/divine', async (req, res) => {
  try {
    const {
      question,
      category,
      divinationType,
      diceResults,
      diceSum,
      runeResults,
    } = req.body;

    const queryText = question?.trim() || 'คำชี้แนะชะตาชีวิตโดยรวมในช่วงเวลานี้';
    const mediumText =
      divinationType === 'dice'
        ? 'การทอยลูกเต๋าพยากรณ์ 3 ดวง (Astragalomancy)'
        : divinationType === 'runes'
        ? 'การเหวี่ยงหินสลักอักษรรูนศักดิ์สิทธิ์ 3 ก้อน (Sacred Elder Futhark Runes Cast)'
        : 'พิธีกรรมสังเคราะห์ลูกเต๋าและศิลาพยากรณ์ (Grand Cleromancy Ritual)';

    let divinationSummary = '';
    if (diceResults && diceResults.length > 0) {
      divinationSummary += `\n- ผลลูกเต๋า 3 ดวง: [${diceResults.map((d: any) => `${d.name}: แต้ม ${d.score} (${d.glyph})`).join(', ')}], ผลรวม = ${diceSum}`;
    }
    if (runeResults && runeResults.length > 0) {
      divinationSummary += `\n- ผลหินรูนสลักศักดิ์สิทธิ์ 3 ตำแหน่ง:
  1. รากฐาน/อดีต: รูน ${runeResults[0]?.name} (${runeResults[0]?.thaiName}) ธาตุ ${runeResults[0]?.element}
  2. สภาวะปัจจุบัน/อุปสรรค: รูน ${runeResults[1]?.name} (${runeResults[1]?.thaiName}) ธาตุ ${runeResults[1]?.element}
  3. ผลลัพธ์/อนาคต: รูน ${runeResults[2]?.name} (${runeResults[2]?.thaiName}) ธาตุ ${runeResults[2]?.element}`;
    }

    const prompt = `
ผู้แสวงหาคำตอบได้ประกอบพิธีกรรมเสี่ยงทาย Cleromancy ณ แท่นบูชาศักดิ์สิทธิ์:
- รูปแบบพิธีกรรม: ${mediumText}
- หมวดหมู่คำถาม: ${category || 'ทั่วไป'}
- คำถาม/จิตอธิษฐานของผู้ใช้: "${queryText}"
- ผลลัพธ์จากการสุ่มเสี่ยงทายแท้จริง:
${divinationSummary}

หน้าที่ของคุณในฐานะ "ผู้อาวุโสแห่งวิหารศิลาพยากรณ์ (Cleromancy Oracle Master)":
จงวิเคราะห์ความหมายที่เชื่อมโยงกันอย่างแยบคาย ทรงพลัง ขลัง และให้แนวทางปฏิบัติจริงที่เป็นประโยชน์
หลีกเลี่ยงภาษาหุ่นยนต์ ใช้สำนวนการพยากรณ์โบราณที่สละสลวย เปี่ยมด้วยสติปัญญาและความเห็นอกเห็นใจ (Empathetic & Mystical Tone)
`;

    const systemInstruction = `
คุณคือผู้เชี่ยวชาญศาสตร์พยากรณ์ Cleromancy โบราณ (การเสี่ยงทายด้วยหินสลักและลูกเต๋า) แห่งวิหารศักดิ์สิทธิ์
จงวิเคราะห์คำทำนายชะตาชีวิตของผู้ใช้จากผลการสุ่มที่ได้จริงอย่างลึกซึ้ง
ให้คำตอบเป็นภาษาไทยที่ไพเราะ ขลัง มีน้ำหนัก มีความหวัง และมอบหลักคิดในการตัดสินใจที่ชัดเจน
ตอบกลับในรูปแบบ JSON ตาม Schema ที่กำหนดไว้เท่านั้น
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'ชื่อโองการหรือหัวข้อคำทำนายที่สละสลวย เช่น "แสงสุริยะทลายม่านหมอก" หรือ "กงล้อแห่งความมานะ"',
            },
            overview: {
              type: Type.STRING,
              description: 'ภาพรวมของกระแสชะตาตามผลเสี่ยงทายและคำถามของผู้ใช้ (ประมาณ 2-3 ย่อหน้า)',
            },
            deepAnalysis: {
              type: Type.STRING,
              description: 'การวิเคราะห์เจาะลึกเฉพาะจุด เชื่อมโยงสัญลักษณ์รูนหรือแต้มลูกเต๋าเข้ากับสถานการณ์ของผู้ใช้',
            },
            pivotalMoment: {
              type: Type.STRING,
              description: 'จุดเปลี่ยนสำคัญหรือสิ่งเตือนสติที่ต้องระวัง',
            },
            practicalGuidance: {
              type: Type.STRING,
              description: 'คำแนะนำการลงมือทำหรือหลักคิดที่เป็นรูปธรรมในการก้าวไปข้างหน้า',
            },
            mysticBlessing: {
              type: Type.STRING,
              description: 'คำอวยพรหรือโองการมงคลสั้นๆ 1-2 ประโยค',
            },
            elementalAffinity: {
              type: Type.STRING,
              description: 'ธาตุหนุนนำเด่น (เช่น ไฟ, ดิน, น้ำ, ลม, หรือ จิตวิญญาณ)',
            },
            auspiciousColors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'สีมงคลหนุนดวงชะตา 2-3 สี',
            },
          },
          required: [
            'title',
            'overview',
            'deepAnalysis',
            'pivotalMoment',
            'practicalGuidance',
            'mysticBlessing',
            'elementalAffinity',
            'auspiciousColors',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, reading: parsedData });
  } catch (error: any) {
    console.error('Error generating cleromancy reading:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to commune with the oracle.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Cleromancy Oracle Server running on port ${PORT}`);
  });
}

startServer();
