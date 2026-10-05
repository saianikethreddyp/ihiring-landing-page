import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tips for interviewing with Sam",
  description: "Invited to interview with Sam on ihiring? Here is what to expect and how to prepare.",
};

const sections = [
  {
    h: "What is an interview on ihiring?",
    p: "An interview on ihiring involves a live conversation with Sam, our AI recruiter, conducted via video interview call, same as any other interview. Unlike the other interviews, the process is designed to be fair and consistent, eliminating human biases or variables like recruiter mood or skill level as Sam only cares about your knowledge and is never biased.",
  },
  {
    h: "What’s required from you?",
    p: "Video calls on ihiring are like those on Zoom or Teams. Strong and stable internet service is essential for the interview. Choose a quiet, distraction-free environment with good lighting if using video, and dress appropriately.",
  },
  {
    h: "Consider it like your other interview.",
    p: "Approach the conversation as you would a standard job interview. Highlight your experience, problem-solving skills, and industry knowledge. Review your resume, align your skills with the job requirements, and research the company if applicable. You can keep your notes next to you. But do not use any external tools like search engines or AI during the call and stay focused.",
  },
  {
    h: "Most important, be yourself.",
    p: "Stay calm and authentic—this is your opportunity to showcase your personality and capabilities. Speak naturally, focus on clarity, and convey enthusiasm. The goal is to make the experience both productive and enjoyable.",
  },
];

export default function BlogPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <Eyebrow>For candidates</Eyebrow>
        <h1 className="display mt-5 text-balance text-5xl leading-[1] sm:text-7xl">
          Tips for interviewing with Sam, on ihiring
        </h1>
        <p className="mt-4 font-mono text-sm text-mute">
          <time dateTime="2025-02-22">February 22, 2025</time>
        </p>
        <p className="mt-8 text-lg leading-relaxed">
          Firstly, congratulations! Receiving an invitation to an interview is the first step toward advancing your
          career and achieving your future goals. ihiring is an AI-driven, candidate-focused interview platform that
          empowers talented individuals like you to shine.
        </p>
        {sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="display text-3xl sm:text-4xl">{s.h}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/80">{s.p}</p>
          </section>
        ))}
      </article>
    </Container>
  );
}
