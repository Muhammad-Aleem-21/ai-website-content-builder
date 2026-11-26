import { generateContent } from "./generate.js";

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
console.log(JSON.stringify(content, null, 2));

const tests = [
  { businessName: "Brew & Bloom", industry: "Cafe", services: "Specialty coffee, fresh pastries, catering", audience: "Young professionals and students", description: "A cozy neighborhood cafe serving ethically sourced coffee.", websiteType: "Restaurant", tone: "Friendly" },
  { businessName: "FlowDesk", industry: "Project management software", services: "Task boards, team chat, time tracking", audience: "Remote startup teams", description: "A simple tool to keep remote teams organized.", websiteType: "SaaS", tone: "Minimal" },
  { businessName: "Ayesha Khan", industry: "Graphic design", services: "Logo design, branding, social media graphics", audience: "Small businesses", description: "Freelance designer helping small brands look professional.", websiteType: "Portfolio", tone: "Creative" },
];

for (const input of tests) {
  console.log("=====", input.businessName, input.websiteType, input.tone);
  const content = await generateContent(input);
  console.log(JSON.stringify(content, null, 2));
}