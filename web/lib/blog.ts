export type PostSection = { h: string; p: string[]; list?: string[]; ordered?: boolean };

export type Post = {
  slug: string;
  title: string;
  category: "Using ihiring" | "Integrations" | "Engineering" | "Hiring" | "For candidates";
  excerpt: string;
  date: string; // ISO
  intro: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "how-ihiring-changes-the-hiring-process",
    title: "How ihiring changes the hiring process",
    category: "Hiring",
    excerpt: "The first round is where hiring slows down. Here is what changes when screening, scheduling, interviews and reports run on their own.",
    date: "2026-10-13",
    intro: "Most hiring delays do not come from the final decision. They come from the first round, where one recruiter has to read, schedule, interview and write up every candidate. ihiring takes that work over, so your team can spend its time on the conversations that need a person.",
    sections: [
      {
        h: "The first round is the bottleneck",
        p: [
          "A strong applicant pool is good news, until every application needs a resume review, a calendar slot, a call and a set of notes. The work grows with every applicant, but the team stays the same size.",
          "The result is familiar: good candidates wait days for a reply, recruiters are buried in admin, and decisions are made on thin notes written from memory.",
        ],
      },
      {
        h: "What changes with ihiring",
        p: ["Each part of the first round moves from a manual step to something that runs on its own:"],
        list: [
          "Reading resumes: applications are screened and ranked against the role, instead of being read one by one in the order they arrive.",
          "Chasing calendars: candidates book and reschedule themselves at any hour, with notifications by email and phone.",
          "First-round calls: interviews run in parallel with follow-up questions, instead of one recruiter taking one call at a time.",
          "Writing notes: every interview produces a report with video, transcript and a summary.",
          "Updating your ATS: results sync to the system you already use, so nobody copies them between tools.",
        ],
      },
      {
        h: "What your team does instead",
        p: [
          "With the repetitive work handled, recruiters start from a ranked shortlist and complete reports. They spend their time talking to the strongest candidates, answering questions and making offers, which is the part of recruiting that people are best at.",
        ],
      },
      {
        h: "What does not change",
        p: [
          "Your team still makes the decision. SAM provides the report and a recommendation, and people decide who moves forward. ihiring changes how the first round is run, not who is accountable for the outcome.",
        ],
      },
    ],
  },
  {
    slug: "how-teams-use-ihiring-from-application-to-report",
    title: "How teams use ihiring, from application to report",
    category: "Using ihiring",
    excerpt: "A walk through the full workflow, and how staffing firms, enterprise teams and startups each put it to work.",
    date: "2026-10-13",
    intro: "A first-round interview is simple on paper: read the resume, find a time, talk, write it up. At volume, it becomes the part of hiring that uses the most hours. This is how teams use ihiring to take that work off their plate.",
    sections: [
      {
        h: "Start with the role",
        p: [
          "Everything begins with the job. Your team sets up the role and the criteria that matter, and ihiring uses them to screen every application and to shape the interview. The same criteria apply to every candidate, which keeps the process consistent.",
        ],
      },
      {
        h: "SAM reads and ranks every application",
        p: [
          "Resumes are screened and ranked against the role, so your team starts with the strongest candidates instead of an inbox. Applications arrive from your job boards and ATS, so nothing needs to be entered again.",
        ],
      },
      {
        h: "Candidates book their own time",
        p: [
          "Candidates schedule and reschedule with SAM at any hour, and receive notifications by email and phone. Your recruiters stop trading emails to find a slot.",
        ],
      },
      {
        h: "SAM runs the interview",
        p: [
          "The first interview is a live one-to-one video conversation. SAM asks about the candidate’s experience and follows up on each answer. Many interviews can run at once, so volume does not turn into a queue.",
        ],
      },
      {
        h: "Your team gets the report",
        p: [
          "Every interview ends with a report: video, transcript, a professional summary and a recommendation. The results sync to your ATS. SAM provides the insight, and your team decides who moves forward.",
        ],
      },
      {
        h: "How different teams use it",
        p: [],
        list: [
          "Staffing and recruitment firms run screening and first interviews across many client roles, then share a report with each client.",
          "Enterprise talent teams give every applicant the same structured first round, with results synced to their ATS.",
          "Startups and growing teams handle first rounds without a recruiting team, and step in for the final conversations.",
        ],
      },
    ],
  },
  {
    slug: "connect-ihiring-to-your-ats",
    title: "Connecting ihiring to your ATS and job boards",
    category: "Integrations",
    excerpt: "What flows in, what flows back, and how to get started with Workday, Greenhouse, Lever, Ashby, Bullhorn and your job boards.",
    date: "2026-10-13",
    intro: "Your ATS is where hiring decisions live, so a new tool only helps if it fits around it. ihiring is designed to sit alongside the systems your team already uses, so recruiters keep one workflow.",
    sections: [
      {
        h: "What ihiring connects to",
        p: ["ihiring integrates with the ATS platforms and job boards that hiring teams use most:"],
        list: [
          "ATS: Workday, Greenhouse, Lever, Ashby and Bullhorn.",
          "Job boards: LinkedIn, Indeed and Glassdoor.",
        ],
      },
      {
        h: "What flows in",
        p: [
          "Applications come from your ATS and job boards, so candidates are screened where they already apply. There is no separate application form to maintain.",
        ],
      },
      {
        h: "What flows back",
        p: [
          "Screening results, the interview report and the recommendation are attached to the candidate in your ATS. The report includes the interview video, a transcript and a professional summary. Recruiters see everything in the tool they already open every day.",
        ],
      },
      {
        h: "Why it matters",
        p: [
          "Nobody has to copy results from one tool to another, and there is no second system of record to keep up to date. The ATS stays the source of truth, and ihiring adds the first-round work in front of it.",
        ],
      },
      {
        h: "Getting started",
        p: ["Most teams begin small and expand once they trust the results:"],
        ordered: true,
        list: [
          "Pick one role to start with.",
          "Connect your ATS and job boards.",
          "Decide which pipeline stage triggers an interview.",
          "Review the first reports with your team and adjust.",
        ],
      },
      {
        h: "Plans and details",
        p: [
          "Integrations are available from the Small & Medium plan. Exactly which fields sync depends on your ATS, so ask us about your setup when you book a demo.",
        ],
      },
    ],
  },
  {
    slug: "real-time-voice-interviews-engineering",
    title: "What real-time voice interviews demand from an AI system",
    category: "Engineering",
    excerpt: "Latency, turn-taking, unreliable networks and scale: the engineering behind an interview that feels like a conversation.",
    date: "2026-10-13",
    intro: "An AI interviewer can look simple from the outside: a candidate talks, the system answers. Making that feel like a conversation, rather than a phone menu, is a real-time engineering problem.",
    sections: [
      {
        h: "Latency is the product",
        p: [
          "People notice delays in conversation within a few hundred milliseconds. A long pause after every answer makes an interview feel mechanical, and it makes candidates more anxious.",
          "So the system is built as a streaming pipeline, not a chain of requests and responses. Audio is transcribed as the candidate speaks, the next question is prepared while they finish, and the reply is spoken as soon as it is ready.",
        ],
      },
      {
        h: "Knowing when the candidate has finished",
        p: [
          "Turn-taking is harder than it sounds. A pause might mean the candidate is thinking, not done. Cutting someone off is worse than waiting a moment too long, so the system weighs silence together with the content of the answer.",
          "It also has to handle interruptions gracefully, such as a candidate asking for a question to be repeated.",
        ],
      },
      {
        h: "Audio and video that survive real networks",
        p: [
          "Candidates join from phones, laptops and shared Wi-Fi. Live sessions use WebRTC, which adapts to weak connections, and the interview has to degrade gracefully: keeping the audio clear even when video quality drops.",
        ],
      },
      {
        h: "Scale without queueing",
        p: [
          "Every interview is a live session, so capacity matters. Sessions run in parallel, which means a surge of applicants does not become a waiting list. The challenge is keeping the experience the same whether ten or a thousand interviews are running at once.",
        ],
      },
      {
        h: "A transcript you can trust",
        p: [
          "Transcription quality affects everything downstream: follow-up questions, summaries and reports. Accents, background noise and technical vocabulary all matter. The transcript is stored next to the video, so your team can check any summary against what the candidate actually said.",
        ],
      },
    ],
  },
  {
    slug: "how-an-ai-interviewer-asks-better-follow-ups",
    title: "How an AI interviewer asks better follow-up questions",
    category: "Engineering",
    excerpt: "Structure, probing and evidence: how adaptive questions test depth while keeping every interview comparable.",
    date: "2026-10-13",
    intro: "A list of fixed questions only tells you what a candidate has rehearsed. The follow-up is where depth shows. Here is how an AI interviewer can probe without losing the structure that keeps interviews fair.",
    sections: [
      {
        h: "Why follow-ups matter",
        p: [
          "“What trade-offs did you make?” is a better question than most openers, because it cannot be answered from memory. Good interviewers use follow-ups to separate real experience from a polished summary.",
        ],
      },
      {
        h: "Structure first",
        p: [
          "Adaptive interviewing starts from a structure: a defined set of topics tied to the role, and the same core questions for every candidate. That structure keeps interviews comparable.",
        ],
      },
      {
        h: "Probing inside the structure",
        p: [
          "Within each topic, SAM listens to the answer and decides whether to go deeper, ask for an example or move on. A vague answer gets a request for specifics. A strong answer gets a harder follow-up.",
        ],
      },
      {
        h: "From answers to evidence",
        p: [
          "Instead of scoring a general impression, the system pulls out concrete evidence: what the candidate did, which decisions they made and what happened as a result. Reports connect those points to the transcript and video, so reviewers can check them.",
        ],
      },
      {
        h: "Keeping people in the loop",
        p: [
          "Adaptive does not mean autonomous. SAM provides interview reports and recommendations, and your team decides who moves forward. A reviewer should always be able to see why a recommendation was made, and to disagree with it.",
        ],
      },
      {
        h: "Consistency and fairness",
        p: [
          "The same structure, the same core questions and the same conversation at any hour give you a consistent process to compare candidates against. No tool removes the need for human judgment and regular review, but a consistent process is a better starting point than a different call for every candidate.",
        ],
      },
    ],
  },
  {
    slug: "candidate-interview-guide",
    title: "Your interview with SAM: a candidate guide",
    category: "For candidates",
    excerpt: "What to expect from an interview with SAM and how to get ready, from your setup to the follow-up questions.",
    date: "2025-02-22",
    intro: "Expect a conversation about your experience, with follow-up questions along the way. Here is how to get ready.",
    sections: [
      {
        h: "Before your interview",
        p: [
          "Use the link in your invitation to choose a time. Check your internet connection, camera and microphone, and find a quiet space with good lighting.",
        ],
      },
      {
        h: "Prepare your examples",
        p: [
          "Review your résumé and the role description. Think of projects that show your experience, the decisions you made and what you learned.",
        ],
      },
      {
        h: "During the conversation",
        p: [
          "SAM asks about your experience and follows up on your answers. Speak naturally and explain your thinking. Follow the instructions in your invitation about notes and permitted tools.",
        ],
      },
      {
        h: "What happens next",
        p: [
          "Your hiring team reviews the interview report and decides on next steps. Contact the team that invited you for updates about your application.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find(p => p.slug === slug);

export const wordCount = (post: Post) =>
  [post.intro, ...post.sections.flatMap(s => [s.h, ...s.p, ...(s.list ?? [])])].join(" ").split(/\s+/).length;

export const readMinutes = (post: Post) => Math.max(2, Math.round(wordCount(post) / 200));

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
