import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { StoryReveal } from "@/components/StoryReveal";

export const metadata: Metadata = {
  title: "About Us",
  alternates: { canonical: "/about" },
  description: "The team and principles behind SAM, iHiring’s AI interviewer.",
};

const principles = [
  { title: "A conversation, not a questionnaire.", body: "Candidates should have room to explain their experience. SAM asks follow-up questions and keeps the interview conversational." },
  { title: "Respect people’s time.", body: "Flexible scheduling gives candidates more choice and helps hiring teams spend less time coordinating first rounds." },
  { title: "People make the decision.", body: "SAM provides interview reports for your team to review. Your team decides who moves forward." },
];

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <Eyebrow>About iHiring</Eyebrow>
        <h1 className="display mt-5 text-balance text-5xl leading-[1.05] sm:text-7xl">More room for the <em>human side</em> of hiring.</h1>
        <p className="mt-8 text-xl leading-relaxed text-ink/80">iHiring is the San Francisco-based company behind SAM, an AI interviewer built to help teams get to know candidates through conversation.</p>
        <StoryReveal className="mt-12">
          <h2 className="display text-3xl sm:text-4xl">Why we built SAM</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">First-round interviews take time: reviewing applications, finding a calendar slot, and asking the same opening questions. We built SAM to handle that groundwork, giving teams more time to explore the experience and potential behind each application.</p>
        </StoryReveal>
        <div className="mt-14">
          <h2 className="display text-3xl sm:text-4xl">What guides us</h2>
          <div className="mt-6 space-y-4">
            {principles.map((item, index) => (
              <StoryReveal key={item.title} delay={index * 60} className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-7">
                <span className="font-mono text-xs text-brand">0{index + 1}</span>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-mute">{item.body}</p>
              </StoryReveal>
            ))}
          </div>
        </div>
        <StoryReveal className="mt-14 border-t border-ink/10 pt-10">
          <h2 id="leadership" className="display scroll-mt-24 text-3xl sm:text-4xl">Our founder</h2>
          <p className="mt-5 text-xl font-semibold">Ram Pailla</p>
          <p className="mt-1 text-sm text-brand">Founder & CEO</p>
          <p className="mt-3 text-base leading-relaxed text-mute">Ram founded iHiring to make the first interview easier for candidates and hiring teams.</p>
        </StoryReveal>
      </article>
    </Container>
  );
}
