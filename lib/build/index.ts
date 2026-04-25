import type { Meeting } from "../meetings/types";
import { COLOR } from "../meetings/types";

export type BuildDeliverable = {
  title: string;
  description: string;
  status: "done" | "before" | "during" | "after";
};

export type BuildResource = {
  label: string;
  description: string;
  href?: string;
};

export type BuildSession = Meeting & {
  shortTitle: string;
  focus: string;
  preBuild?: BuildDeliverable[];
  deliverables: BuildDeliverable[];
  resources?: BuildResource[];
};

export const buildMeeting01: BuildSession = {
  slug: "meeting-01",
  number: 1,
  title: "Build Meeting 1: Vibe Coding 101",
  shortTitle: "Meeting one",
  focus:
    "Understand the ecosystem: AI coding tools, IDEs, GitHub, Vercel, and how they fit together.",
  date: "2026-04-18",
  dateLabel: "Build Meeting 1",
  timeLabel: "Foundation session",
  location: "TTS Build Team",
  summary:
    "A beginner-friendly walkthrough of the builder ecosystem and the mindset shift from syntax to resourcefulness.",
  status: "past",
  accent: COLOR.red,
  deliverables: [
    {
      title: "Know the builder pipeline",
      description:
        "Explain the path from idea, to AI coding tool, to editor, to GitHub, to Vercel.",
      status: "done",
    },
    {
      title: "Pick an on-ramp",
      description:
        "Choose whether to start with Cursor, VS Code, Claude, Gemini, or another AI coding flow.",
      status: "done",
    },
    {
      title: "Leave with less fear around code",
      description:
        "Understand that your job is clear thinking, prompting, taste, and iteration, not memorizing syntax.",
      status: "done",
    },
  ],
  resources: [
    {
      label: "GitHub",
      description: "Where code lives, versions, and gets shared.",
      href: "https://github.com/",
    },
    {
      label: "Vercel",
      description: "Where a project becomes a live URL.",
      href: "https://vercel.com/",
    },
    {
      label: "Claude",
      description: "AI assistant for planning, prompting, and code generation.",
      href: "https://claude.ai/",
    },
  ],
  slides: [
    {
      kind: "title",
      eyebrow: "Build Meeting 01",
      title: "Vibe Coding 101",
      subtitle: "How ideas become live websites without memorizing syntax.",
      footer: "TTS Build Team",
    },
    {
      kind: "section",
      number: "01",
      title: "The builder ecosystem",
      blurb: "You do not need every tool mastered. You need to know what each tool is for.",
    },
    {
      kind: "bullets",
      eyebrow: "The pipeline",
      title: "Idea to live URL, in plain English",
      items: [
        { label: "You", detail: "Describe what you want to build." },
        {
          label: "AI coding tool",
          detail:
            "Claude, Gemini, Cursor, or another assistant helps generate and edit code.",
        },
        {
          label: "IDE",
          detail: "VS Code or Cursor is where you open folders and run the project.",
        },
        {
          label: "GitHub",
          detail: "Save changes, push commits, and recover from mistakes.",
        },
        {
          label: "Vercel",
          detail: "Deploy the project so it has a real URL anyone can visit.",
        },
      ],
    },
    {
      kind: "cta",
      eyebrow: "Before next time",
      title: "Come ready to build",
      body: "Meeting 2 is hands-on. Set up the tools first so the room can spend time making instead of installing.",
      actions: [
        {
          label: "Create GitHub",
          detail: "You need an account before you can save and publish code.",
        },
        {
          label: "Pick an AI tool",
          detail: "Use Claude, Gemini, Cursor, or another tool you can access.",
        },
        {
          label: "Install an editor",
          detail: "VS Code or Cursor. Either is fine.",
        },
      ],
    },
  ],
};

export const buildMeeting02: BuildSession = {
  slug: "meeting-02",
  number: 2,
  title: "Build Meeting 2: Vibe Code Your First Web Page",
  shortTitle: "Meeting two",
  focus:
    "Arrive set up, follow along, and leave with a first webpage started and saved to GitHub.",
  date: "2026-04-25",
  dateLabel: "Build Meeting 2",
  timeLabel: "Hands-on build session",
  location: "TTS Build Team",
  summary:
    "A hands-on session for setting up the builder workflow, prompting resourcefully, and vibe coding a first personal webpage.",
  status: "upcoming",
  accent: COLOR.gold,
  preBuild: [
    {
      title: "Create or log into GitHub",
      description:
        "You should be able to make a repo, commit changes, and push code before the meeting starts.",
      status: "before",
    },
    {
      title: "Choose your AI coding tool",
      description:
        "Have Claude, Gemini, Cursor, or another AI coding assistant ready to use.",
      status: "before",
    },
    {
      title: "Install Cursor or VS Code",
      description:
        "Open the editor once before the meeting so we do not spend the first half installing software.",
      status: "before",
    },
    {
      title: "Create or log into Vercel",
      description:
        "Vercel is how the project becomes a public link when you are ready to ship it.",
      status: "before",
    },
    {
      title: "Bring your laptop charged",
      description:
        "If something breaks, bring the exact error message so we can debug quickly.",
      status: "before",
    },
  ],
  deliverables: [
    {
      title: "A first working webpage",
      description:
        "Use an AI coding tool to generate a simple webpage that runs locally or can be previewed.",
      status: "during",
    },
    {
      title: "One personal design change",
      description:
        "Make the page feel like you: edit copy, colors, layout, images, or a visual effect.",
      status: "during",
    },
    {
      title: "A project direction",
      description:
        "Write down what your personal portfolio or first site should become next.",
      status: "after",
    },
    {
      title: "Saved to GitHub",
      description:
        "Push your progress so the work can continue after the meeting.",
      status: "after",
    },
  ],
  resources: [
    {
      label: "GitHub",
      description: "Create an account and save your first repo.",
      href: "https://github.com/",
    },
    {
      label: "Vercel",
      description: "Deploy a GitHub repo to a live URL.",
      href: "https://vercel.com/",
    },
    {
      label: "VS Code",
      description: "A free code editor that works for every project.",
      href: "https://code.visualstudio.com/",
    },
    {
      label: "Cursor",
      description: "An AI-first code editor for building with prompts.",
      href: "https://cursor.com/",
    },
    {
      label: "Claude",
      description: "Useful for prompt engineering, planning, and debugging.",
      href: "https://claude.ai/",
    },
  ],
  slides: [
    {
      kind: "title",
      eyebrow: "Build Meeting 02",
      title: "Vibe Code Your First Web Page",
      subtitle:
        "Come set up. Leave with something real started.",
      footer: "TTS Build Team",
    },
    {
      kind: "section",
      number: "01",
      title: "Tonight is not a lecture",
      blurb:
        "We already covered the ecosystem. This time, we start building and use the room to get unstuck.",
    },
    {
      kind: "bullets",
      eyebrow: "Before the meeting",
      title: "Do the setup first",
      body:
        "If these are done before you arrive, we can spend the meeting making instead of installing.",
      items: [
        { label: "GitHub", detail: "Create or log into your account." },
        { label: "Editor", detail: "Install Cursor or VS Code." },
        { label: "AI tool", detail: "Have Claude, Gemini, Cursor, or similar ready." },
        { label: "Vercel", detail: "Create or log into an account for deployment." },
        { label: "Laptop", detail: "Bring it charged and ready." },
      ],
    },
    {
      kind: "three-up",
      eyebrow: "Roles",
      title: "Who helps with what",
      cards: [
        {
          label: "Zoom",
          heading: "Caleb",
          body:
            "Prompt engineering, resourceful prompting, finding references, and showing niche finessing tricks.",
          accent: COLOR.gold,
        },
        {
          label: "Room",
          heading: "Kaitlyn",
          body:
            "In-person support for formatting, functionality, and getting websites unstuck.",
          accent: COLOR.red,
        },
        {
          label: "Later",
          heading: "Product strategy",
          body:
            "Portfolio positioning and product strategy matter, but the next step is getting people building.",
          accent: COLOR.blue,
        },
      ],
    },
    {
      kind: "bullets",
      eyebrow: "Resourceful prompting",
      title: "Prompt like a builder",
      items: [
        {
          label: "Name the outcome",
          detail: "Say what the page should do and what should be visible.",
        },
        {
          label: "Bring references",
          detail:
            "Find a GitHub repo, portfolio, scroll effect, or product detail you want to learn from.",
        },
        {
          label: "Ask for small steps",
          detail:
            "Generate the first version, run it, paste the error, then improve one thing at a time.",
        },
        {
          label: "Steal the mechanic, not the identity",
          detail:
            "Use references to understand scroll effects, iPad frames, cards, and motion, then make it yours.",
        },
      ],
    },
    {
      kind: "quote",
      quote:
        "Good prompting is not magic. It is being specific, showing references, and staying resourceful when the first answer breaks.",
      attribution: "Build Team",
    },
    {
      kind: "cta",
      eyebrow: "Starter prompt",
      title: "Build a personal webpage",
      body:
        "Paste this into your AI tool, then keep iterating: Build me a simple personal webpage with a hero, about section, projects section, and contact section. Keep it clean, modern, and easy to customize. Explain how to run it locally.",
      actions: [
        {
          label: "Run it",
          detail: "Open the project and see the page.",
        },
        {
          label: "Personalize it",
          detail: "Change copy, colors, layout, and one interaction.",
        },
        {
          label: "Save it",
          detail: "Commit and push your progress to GitHub.",
        },
      ],
    },
    {
      kind: "cta",
      eyebrow: "Walkaway",
      title: "Leave with proof you can build",
      body:
        "By the end, you should have a first webpage started, a clearer project direction, and a GitHub repo you can keep improving.",
      actions: [
        { label: "Page", detail: "A simple website you can show." },
        { label: "Repo", detail: "A saved place to continue building." },
        { label: "Next idea", detail: "One direction for your portfolio." },
      ],
    },
  ],
};

export const BUILD_SESSIONS: BuildSession[] = [buildMeeting01, buildMeeting02];

export function getBuildSession(slug: string) {
  return BUILD_SESSIONS.find((session) => session.slug === slug);
}

export function buildSessionSlugs() {
  return BUILD_SESSIONS.map((session) => session.slug);
}

export const currentBuildSession = buildMeeting02;
