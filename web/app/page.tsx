import type { Metadata } from "next";
import { HomeStory } from "@/components/HomeStory";
import "./story.css";

export const metadata: Metadata = {
  title: "ihiring.ai | Less time screening. More time hiring.",
  description: "Meet SAM, your AI interviewer. Screen applicants, schedule interviews and turn conversations into detailed reports for your hiring team.",
  openGraph: {
    title: "Less time screening. More time hiring. | ihiring.ai",
    description: "Screen. Schedule. Interview. Understand. Meet SAM, the AI interviewer for hiring teams.",
  },
};

export default function Home() {
  return (
    <HomeStory />
  );
}
