import { Hero } from "@/components/Hero";
import { NightShift } from "@/components/NightShift";
import { Chapters } from "@/components/Chapters";
import { Integrations } from "@/components/Integrations";
import { Global } from "@/components/Global";
import { Audience } from "@/components/Audience";
import { Thesis } from "@/components/Thesis";
import { Voices } from "@/components/Voices";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <NightShift />
      <Chapters />
      <Integrations />
      <Global />
      <Audience />
      <Thesis />
      <Voices />
      <FAQ />
      <FinalCTA />
    </>
  );
}
