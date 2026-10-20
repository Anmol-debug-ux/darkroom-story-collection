import m00 from "@/assets/m00.jpg.asset.json";
import m01 from "@/assets/m01.jpg.asset.json";
import m02 from "@/assets/m02.jpg.asset.json";
import m03 from "@/assets/m03.jpg.asset.json";
import m04 from "@/assets/m04.jpg.asset.json";
import m05 from "@/assets/m05.jpg.asset.json";
import m06 from "@/assets/m06.jpg.asset.json";
import m07 from "@/assets/m07.jpg.asset.json";
import m08 from "@/assets/m08.jpg.asset.json";
import m09 from "@/assets/m09.jpg.asset.json";
import m10 from "@/assets/m10.jpg.asset.json";
import m11 from "@/assets/m11.mp4.asset.json";
import m12 from "@/assets/m12.jpg.asset.json";
import m13 from "@/assets/m13.mp4.asset.json";
import m14 from "@/assets/m14.jpg.asset.json";
import m15 from "@/assets/m15.mp4.asset.json";

export const media = { portrait: m00.url, aboutPhoto: m01.url };

export const contact = {
  email: "srivasanmolrj@gmail.com",
  phone: "+91 94158 22361",
  phoneHref: "tel:+919415822361",
  linkedin: "https://www.linkedin.com/in/anmol-srivastava-a9b541386",
  site: "https://asai06.netlify.app",
  youtube: "https://www.youtube.com/@successpanel-f2k",
};

export const scenes = [
  { id: "hero", label: "Cold Open" },
  { id: "about", label: "Character Intro" },
  { id: "work", label: "The Reel" },
  { id: "services", label: "The Craft" },
  { id: "tools", label: "The Toolkit" },
  { id: "contact", label: "Credits" },
] as const;

export const categories = [
  "All", "AI Graphic Design", "Character Design", "Thumbnails", "UGC Ads", "Films", "Web Projects", "Content",
] as const;

export type Project = {
  slug: string;
  title: string;
  category: (typeof categories)[number];
  timecode: string;
  image: string;
  alt: string;
  size?: "wide" | "tall";
  video?: string;
  overview: string;
};

export const projects: Project[] = [
  { slug: "campaign-key-art", title: "Campaign Key Art", category: "AI Graphic Design", timecode: "00:00:04:12", image: m02.url, alt: "AI graphic design campaign artwork", size: "wide", overview: "Campaign visuals produced end-to-end through a generative pipeline, graded for a single coherent look." },
  { slug: "ai-series-lead", title: "AI Series — Lead Character", category: "Character Design", timecode: "00:00:07:21", image: m03.url, alt: "Original character design for AI animated series", size: "tall", overview: "Lead character developed for an AI animated series, built to stay consistent across shots and episodes." },
  { slug: "channel-thumbnail-set", title: "Channel Thumbnail Set", category: "Thumbnails", timecode: "00:00:11:08", image: m04.url, alt: "High CTR thumbnail design", overview: "A thumbnail system engineered around attention — contrast, faces, and a single readable idea." },
  { slug: "product-visual", title: "Product Visual", category: "AI Graphic Design", timecode: "00:00:14:19", image: m05.url, alt: "AI generated brand graphic", overview: "Product key visual produced at agency quality, at production speed." },
  { slug: "creator-style-ad-set", title: "Creator-Style Ad Set", category: "UGC Ads", timecode: "00:00:18:02", image: m06.url, alt: "UGC style advertisement still", size: "tall", video: m13.url, overview: "Scroll-stopping creator-style ad content, produced without a creator roster." },
  { slug: "supporting-cast", title: "Supporting Cast Concept", category: "Character Design", timecode: "00:00:21:15", image: m07.url, alt: "Character concept for animated AI series", overview: "Supporting cast concepts designed to sit in the same world as the lead." },
  { slug: "episode-cover-art", title: "Episode Cover Art", category: "Thumbnails", timecode: "00:00:24:07", image: m08.url, alt: "Thumbnail design sample", overview: "Episode cover art designed as a repeatable, recognisable series format." },
  { slug: "poster-series", title: "Poster Series", category: "AI Graphic Design", timecode: "00:00:27:23", image: m09.url, alt: "AI generated poster artwork", size: "wide", overview: "A poster series exploring one visual language across multiple frames." },
];

export const films = [
  { title: "Digital Presenter Delivery", category: "AI Avatar Video", poster: m10.url, src: m11.url },
  { title: "Perfume — Creator-Style Ad", category: "UGC Ads", poster: m12.url, src: m13.url },
  { title: "Motion Design Excerpt", category: "2D Animation", poster: m14.url, src: m15.url },
];

export const otherWork = [
  { title: "Success Panel", kind: "YouTube channel", note: "Student-guidance content for JEE / NEET aspirants.", href: contact.youtube, category: "Content" },
  { title: "Scheme Sathi", kind: "SIH 2026", note: "Smart India Hackathon 2026 project.", category: "Web Projects" },
  { title: "StudySync", kind: "Web project", note: "Study collaboration product.", category: "Web Projects" },
  { title: "Vice Streets", kind: "Game", note: "Game project.", category: "Web Projects" },
  { title: "ESP32 Maze Robocar", kind: "Hardware", note: "Autonomous maze-solving robot car on ESP32.", category: "Web Projects" },
  { title: "Vellum", kind: "Study products", note: "Study products for students.", category: "Content" },
];

export type ServiceCat = "creative" | "ai" | "automation";
export const services: { cat: ServiceCat; title: string; body: string }[] = [
  { cat: "creative", title: "Brand Identity Design", body: "Logo systems, visual language, and guidelines built to hold up across every touchpoint you'll ever need." },
  { cat: "creative", title: "AI Graphic Design", body: "Campaign visuals, key art, and social graphics produced at agency quality, at production speed." },
  { cat: "creative", title: "Thumbnail Design", body: "High-CTR thumbnails engineered around attention, not just aesthetics." },
  { cat: "creative", title: "Landing Page & Website Design", body: "Conversion-focused pages with the polish of a flagship product launch." },
  { cat: "creative", title: "AI Presentation Design", body: "Decks that pitch as hard as the idea inside them — built, styled, and story-lined end to end." },
  { cat: "creative", title: "Creative Direction", body: "The point of view that ties every asset back to one coherent brand story." },
  { cat: "creative", title: "Character Design for AI Series", body: "Consistent, ownable characters built to carry an entire series." },
  { cat: "creative", title: "Scriptwriting & Student Guidance", body: "Scripts and JEE / NEET guidance content written to inform and hold attention." },
  { cat: "ai", title: "AI Video Production", body: "Full video production pipelines built on generative tools — scripted, shot, and edited." },
  { cat: "ai", title: "AI Avatar Videos", body: "Digital presenters that deliver your message on camera — without a camera." },
  { cat: "ai", title: "Cinematic AI Films", body: "Short-form narrative films built entirely from generative pipelines, cut like a real production." },
  { cat: "ai", title: "2D Animation", body: "Character and motion animation for explainers, series, and social-first storytelling." },
  { cat: "ai", title: "Motion Graphics", body: "Kinetic type, transitions, and brand motion systems that make static feel alive." },
  { cat: "ai", title: "Prompt Engineering", body: "The unglamorous craft that decides whether your AI output looks premium or generic." },
  { cat: "ai", title: "UGC Ads", body: "Scroll-stopping creator-style ad content, produced without a creator roster." },
  { cat: "ai", title: "AI Content Creation", body: "Always-on content engines that keep every channel fed without burning out a team." },
  { cat: "automation", title: "Creative Automation", body: "Repeatable pipelines that turn a single brief into an entire content batch." },
  { cat: "automation", title: "Workflow & No-code Automation", body: "n8n, Zapier, and Make systems that connect your tools so nothing needs manual handoff." },
  { cat: "automation", title: "Chatbot Development", body: "Conversational systems that qualify, support, and convert around the clock." },
  { cat: "automation", title: "Content & Marketing Automation", body: "Distribution systems that get your content in front of the right audience, automatically." },
  { cat: "automation", title: "AI Strategy & Consulting", body: "An honest roadmap for where AI actually moves your business forward — and where it doesn't." },
  { cat: "automation", title: "Generative AI Solutions", body: "Custom builds where off-the-shelf tools stop being enough for what you need." },
];

export const stages = [
  ["Discovery", "Understand the brand, the audience, and the actual business outcome the work needs to drive."],
  ["Research", "Study the category, the competition, and the references worth stealing from — or avoiding entirely."],
  ["Strategy", "Define the creative direction, the channels, and how success will actually be measured."],
  ["Prompt Engineering", "Build and test the prompt systems that will drive consistent, on-brand generative output."],
  ["Creation", "Produce the work — design, video, animation, or copy — with a human hand on every pass."],
  ["Automation", "Wrap the working process into a repeatable pipeline so future output doesn't start from zero."],
  ["Testing", "Stress-test the system and the output against edge cases before anything ships."],
  ["Delivery", "Hand off final assets and systems in the format your team actually works in."],
  ["Optimization", "Review real performance data and refine the system for the next cycle."],
] as const;

export const collabSteps = [
  ["Book a Call", "A 30-minute conversation to understand what you're trying to build and whether it's a fit."],
  ["Research", "I study your brand, category, and audience before proposing any direction."],
  ["Planning", "A clear scope, timeline, and deliverables — no ambiguity about what you're getting."],
  ["Creation", "Design and production begins, with checkpoints so nothing arrives as a surprise."],
  ["Review", "Structured feedback rounds keep revisions fast and focused."],
  ["Launch", "Final assets and systems delivered, tested, and ready to go live."],
  ["Support", "Ongoing help as the work lives in the real world and needs change."],
] as const;

export const tools = [
  ["ChatGPT", "Scripting & Ideation"], ["Claude", "Writing & Reasoning"], ["Midjourney", "Key Art"],
  ["Runway", "Generative Video"], ["Leonardo", "Image Generation"], ["ElevenLabs", "Voice"],
  ["CapCut", "Editing"], ["Canva", "Layout"], ["Figma", "Interface Design"], ["Adobe", "Post-production"],
  ["n8n", "Automation"], ["Zapier", "Automation"], ["Make", "Automation"], ["Notion", "Production Office"],
  ["GitHub", "Version Control"], ["Vercel", "Deployment"],
] as const;

export const marqueeItems = [
  "Creative Direction", "AI Video Production", "Prompt Engineering", "Workflow Automation",
  "Brand Identity", "Motion Graphics", "Content Systems",
];

export const pillars = [
  ["Mission", "Make world-class creative production accessible to teams without world-class budgets — without compromising taste."],
  ["Vision", "A future where the bottleneck on great brand storytelling is imagination, not headcount or hours."],
  ["Philosophy", "Automation should protect craft, not replace it. The system exists to serve the story — never the other way around."],
  ["What's different", "I ship as a designer, director, and engineer in one — so nothing is lost translating between disciplines."],
] as const;

export const faqs = [
  ["What does a typical engagement look like?", "A discovery call, a clear scope, then production with checkpoints. Most projects follow the nine production stages shown above."],
  ["Do you only use AI?", "No. AI is part of the pipeline — every output gets a human pass for taste, consistency, and brand fit."],
  ["Can you build automations for my existing tools?", "Yes. I work with n8n, Zapier, and Make to connect the tools your team already uses."],
  ["Do you work remotely?", "Yes — based in Gorakhpur, India, working remotely with teams anywhere."],
];
