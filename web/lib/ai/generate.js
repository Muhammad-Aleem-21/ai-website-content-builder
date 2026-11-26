import Groq from "groq-sdk";
import { ContentSchema, sectionSchema, SECTIONS } from "./schema.js";
import { buildPrompt, buildSectionPrompt } from "./prompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "openai/gpt-oss-120b";

const SECTION_TEMPERATURE = {
  hero: 0.8,
  about: 0.8,
  services: 0.4,
  features: 0.4,
  whyChooseUs: 0.4,
  testimonials: 0.4,
  faqs: 0.3,
};

const FULL_TEMPERATURE = 0.6;

async function requestValidated(system, user, schema, temperature) {
  const messages = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  for (let attempt = 1; attempt <= 2; attempt++) {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content;
    let feedback;

    try {
      const result = schema.safeParse(JSON.parse(raw));
      if (result.success) return result.data;
      feedback = `Your JSON was invalid: ${JSON.stringify(result.error.issues)}. Return the corrected full JSON only.`;
    } catch {
      feedback = "That was not valid JSON. Return valid JSON only.";
    }

    messages.push({ role: "assistant", content: raw });
    messages.push({ role: "user", content: feedback });
  }

  throw new Error("AI failed to return valid content after 2 attempts");
}

export async function generateContent(input) {
  const { system, user } = buildPrompt(input);
  return requestValidated(system, user, ContentSchema, FULL_TEMPERATURE);
}

export async function regenerateSection(input, section, currentContent, instruction = "") {
  if (!SECTIONS.includes(section)) {
    throw new Error(`Unknown section "${section}". Valid: ${SECTIONS.join(", ")}`);
  }
  const { system, user } = buildSectionPrompt(input, section, currentContent[section], instruction);
  const result = await requestValidated(system, user, sectionSchema(section), SECTION_TEMPERATURE[section]);
  return result[section];
}