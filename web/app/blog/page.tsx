import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { StoryReveal } from "@/components/StoryReveal";

export const metadata: Metadata = {
  title: "Candidate Interview Guide",
  alternates: { canonical: "/blog" },
  description: "What to expect from an interview with SAM and how to prepare.",
};

const sections = [
  { h: "Before your interview", p: "Use the link in your invitation to choose a time. Check your internet connection, camera, and microphone, and find a quiet space with good lighting." },
  { h: "Prepare your examples", p: "Review your résumé and the role description. Think of projects that show your experience, the decisions you made, and what you learned." },
  { h: "During the conversation", p: "SAM asks about your experience and follows up on your answers. Speak naturally and explain your thinking. Follow the instructions in your invitation about notes and permitted tools." },
  { h: "What happens next", p: "Your hiring team reviews the interview report and decides on next steps. Contact the team that invited you for updates about your application." },
];

export default function BlogPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <Eyebrow>For candidates</Eyebrow>
        <h1 className="display mt-5 text-balance text-5xl leading-[1.05] sm:text-7xl">Your interview <em>with SAM.</em></h1>
        <p className="mt-6 text-xl leading-relaxed text-ink/80">Expect a conversation about your experience, with follow-up questions along the way. Here’s how to get ready.</p>
        {sections.map((section, index) => (
          <StoryReveal key={section.h} className="mt-10 border-t border-ink/10 pt-8">
            <span className="font-mono text-xs text-brand">0{index + 1}</span>
            <h2 className="display mt-2 text-3xl sm:text-4xl">{section.h}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/80">{section.p}</p>
          </StoryReveal>
        ))}
      </article>
    </Container>
  );
}
