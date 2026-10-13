import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "./blog.css";
import { Container, Eyebrow } from "@/components/ui";
import { StoryReveal } from "@/components/StoryReveal";
import { formatDate, posts, readMinutes } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description: "How ihiring works, how it connects to your tools, the engineering behind SAM, and a guide for candidates.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="display mt-5 max-w-3xl text-balance text-5xl leading-[1.05] sm:text-7xl">Ideas for <em>better hiring.</em></h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/80">How teams use ihiring, how it fits your tools, the engineering behind SAM, and a guide for candidates.</p>

        <StoryReveal className="mt-14">
          <Link href={`/blog/${featured.slug}`} className="blog-featured group block">
            <span className="blog-tag">{featured.category}</span>
            <h2 className="display mt-4 max-w-2xl text-balance text-3xl leading-tight sm:text-5xl">{featured.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">{featured.excerpt}</p>
            <span className="mt-6 flex items-center gap-4 text-sm text-mute">
              <span>{formatDate(featured.date)}</span><span aria-hidden="true">·</span><span>{readMinutes(featured)} min read</span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-brand transition-transform group-hover:translate-x-1">Read article <ArrowRight size={16} aria-hidden="true" /></span>
            </span>
          </Link>
        </StoryReveal>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(post => (
            <li key={post.slug}>
              <StoryReveal className="h-full">
                <Link href={`/blog/${post.slug}`} className="blog-card group flex h-full flex-col">
                  <span className="blog-tag">{post.category}</span>
                  <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{post.title}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mute">{post.excerpt}</p>
                  <span className="mt-6 flex items-center gap-3 text-sm text-mute">
                    <span>{formatDate(post.date)}</span><span aria-hidden="true">·</span><span>{readMinutes(post)} min</span>
                    <ArrowRight size={16} className="ml-auto text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </StoryReveal>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
