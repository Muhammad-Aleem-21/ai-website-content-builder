import { generateContent, regenerateSection } from "./generate.js";

const input = {
  businessName: "Brew & Bloom",
  industry: "Cafe",
  services: "Specialty coffee, fresh pastries, catering",
  audience: "Young professionals and students",
  description: "A cozy neighborhood cafe serving ethically sourced coffee.",
  websiteType: "Restaurant",
  tone: "Friendly",
};

const content = await generateContent(input);
console.log("ORIGINAL HERO HEADLINES:", content.hero.headlines);

const newHero = await regenerateSection(input, "hero", content, "make it shorter and punchier");
console.log("REGENERATED HERO:", JSON.stringify(newHero, null, 2));

const newFaqs = await regenerateSection(input, "faqs", content);
console.log("REGENERATED FAQS:", JSON.stringify(newFaqs, null, 2));