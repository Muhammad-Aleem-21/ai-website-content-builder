const TYPE_GUIDE = {
  Agency: "Focus on expertise, process, results and client partnership. CTAs like 'Get a Free Consultation'.",
  "E-commerce": "Focus on product quality, shipping, returns and trust. CTAs like 'Shop Now'.",
  Portfolio: "Focus on the person's craft, work style and past projects. CTAs like 'View My Work' or 'Hire Me'.",
  Restaurant: "Focus on food, atmosphere, menu and visiting. CTAs like 'View Menu' or 'Visit Us'. Do not mention reservations unless the user did.",
  SaaS: "Focus on the problem solved, product benefits and ease of use. CTAs like 'Start Free Trial'.",
};

const TONE_GUIDE = {
  Professional: "Formal, confident, precise. No slang, no exclamation marks.",
  Creative: "Bold, imaginative, playful wordplay and vivid imagery.",
  Friendly: "Warm, conversational, approachable. Contractions are fine.",
  Minimal: "Short sentences. Few words. No filler, no exclamation marks.",
};

export const STRICT_RULES = `STRICT RULES:
- Use ONLY the services listed. Do not add services the user did not mention.
- Use ONLY facts found in the business information above. If something is not stated there, assume it is unknown.
- Do NOT invent any of these: certifications, sourcing claims, opening hours, prices, delivery times, policies, awards, statistics, years in business, amenities (Wi-Fi, power outlets, music, parking, seating, outdoor areas), payment methods, ordering options (pre-order, online ordering, delivery), booking systems, or dietary options.
- FAQs: write questions about the listed services, who the business is for, and how to get started. If a question needs a fact that is not in the business information, the answer must say the customer should contact the business to confirm. Never answer yes or no about something that was not provided.
- Testimonials are PLACEHOLDERS: clearly fictional names, generic roles, and no specific measurable claims.
- Headline options must each take a DIFFERENT angle (e.g. benefit-focused, emotion-focused, curiosity-focused), not rewordings of one idea.
- About variations must each take a DIFFERENT angle (e.g. story, mission, audience-focused) and must not start the same way.
- Match the tone consistently in every section.`;

const SYSTEM = `You are an expert website copywriter. You write conversion-focused website content.
You ALWAYS respond with a single valid JSON object and nothing else.`;

function businessBlock(input) {
  const { businessName, industry, services, audience, description, websiteType, tone } = input;
  return `Business information:
Business name: ${businessName}
Industry: ${industry}
Services: ${services}
Target audience: ${audience}
Description: ${description}
Website type: ${websiteType}
Tone: ${tone}

Website type guidance: ${TYPE_GUIDE[websiteType] ?? ""}
Tone guidance: ${TONE_GUIDE[tone] ?? ""}`;
}

export function buildPrompt(input) {
  const user = `Write website content for this business.

${businessBlock(input)}

${STRICT_RULES}

Return JSON in exactly this shape:
{
  "hero": {
    "headlines": ["3 different headline options"],
    "descriptions": ["3 different description options"],
    "ctaOptions": ["2-3 call-to-action button texts"]
  },
  "about": { "variations": ["3 different About Us paragraphs"] },
  "services": [{ "title": "", "description": "" }],
  "features": [{ "title": "", "description": "" }],
  "whyChooseUs": [{ "title": "", "description": "" }],
  "testimonials": [{ "quote": "", "name": "", "role": "" }],
  "faqs": [{ "question": "", "answer": "" }]
}

Provide one services item per listed service, 3-4 features, 3-4 whyChooseUs items, 3 testimonials and 5 FAQs.`;

  return { system: SYSTEM, user };
}

const SECTION_SHAPES = {
  hero: `{ "hero": { "headlines": ["3 options"], "descriptions": ["3 options"], "ctaOptions": ["2-3 options"] } }`,
  about: `{ "about": { "variations": ["3 different paragraphs"] } }`,
  services: `{ "services": [{ "title": "", "description": "" }] }  (one item per listed service)`,
  features: `{ "features": [{ "title": "", "description": "" }] }  (3-4 items)`,
  whyChooseUs: `{ "whyChooseUs": [{ "title": "", "description": "" }] }  (3-4 items)`,
  testimonials: `{ "testimonials": [{ "quote": "", "name": "", "role": "" }] }  (3 items)`,
  faqs: `{ "faqs": [{ "question": "", "answer": "" }] }  (5 items)`,
};

export function buildSectionPrompt(input, section, currentContent, instruction) {
  const user = `Rewrite ONE section of a website for this business.

${businessBlock(input)}

Section to regenerate: "${section}"

Current version of this section (write something clearly DIFFERENT from it):
${JSON.stringify(currentContent, null, 2)}

${instruction ? `User instruction: ${instruction}\n` : ""}
${STRICT_RULES}

Return JSON in exactly this shape and include ONLY this section:
${SECTION_SHAPES[section]}`;

  return { system: SYSTEM, user };
}