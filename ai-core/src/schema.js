import { z } from "zod";

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

// List of section names: hero, about, services, features, ...
export const SECTIONS = Object.keys(ContentSchema.shape);

// Wraps one section as { sectionName: ... } because JSON mode
// needs the top-level value to be an object.
export function sectionSchema(section) {
  return z.object({ [section]: ContentSchema.shape[section] });
}