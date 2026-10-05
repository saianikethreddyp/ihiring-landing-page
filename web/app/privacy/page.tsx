import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ihiring Inc. collects, uses and shares personal information.",
};

// ihiring's own policy text (last updated March 03, 2025), kept verbatim from the current site.
const html = fs.readFileSync(path.join(process.cwd(), "content/privacy.html"), "utf8");

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="legal mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </Container>
  );
}
