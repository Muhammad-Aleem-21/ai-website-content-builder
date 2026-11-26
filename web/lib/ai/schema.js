import { z } from "zod";

export const WEBSITE_TYPES = ["Agency", "E-commerce", "Portfolio", "Restaurant", "SaaS"];
export const TONES = ["Professional", "Creative", "Friendly", "Minimal"];

// Validates what the user submits from the form
export const InputSchema = z.object({
  businessName: z.string().trim().min(1).max(100),
  industry: z.string().trim().min(1).max(100),
  services: z.string().trim().min(1).max(500),
  audience: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(1000),
  websiteType: z.enum(WEBSITE_TYPES),
  tone: z.enum(TONES),
});

// Validates what the AI returns
export const ContentSchema = z.object({
  hero: z.object({
    headlines: z.array(z.string()).length(3),
    descriptions: z.array(z.string()).length(3),
    ctaOptions: z.array(z.string()).min(2),
  }),
  about: z.object({
    variations: z.array(z.string()).min(2),
  }),
  services: z.array(
    z.object({ title: z.string(), description: z.string() })
  ),
  features: z.array(
    z.object({ title: z.string(), description: z.string() })
  ),
  whyChooseUs: z.array(
    z.object({ title: z.string(), description: z.string() })
  ),
  testimonials: z.array(
    z.object({ quote: z.string(), name: z.string(), role: z.string() })
  ),
  faqs: z.array(
    z.object({ question: z.string(), answer: z.string() })
  ),
});

export const SECTIONS = Object.keys(ContentSchema.shape);

export function sectionSchema(section) {
  return z.object({ [section]: ContentSchema.shape[section] });
}