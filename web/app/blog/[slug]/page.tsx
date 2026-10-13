import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../blog.css";
import { Container } from "@/components/ui";
import { formatDate, getPost, posts, readMinutes } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = posts.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-brand">
          <ArrowLeft size={15} aria-hidden="true" /> All articles
        </Link>
        <p className="mt-8"><span className="blog-tag">{post.category}</span></p>
        <h1 className="display mt-5 text-balance text-4xl leading-[1.1] sm:text-6xl">{post.title}</h1>
        <p className="mt-5 text-sm text-mute">ihiring team · {formatDate(post.date)} · {readMinutes(post)} min read</p>
        <p className="mt-8 text-xl leading-relaxed text-ink/80">{post.intro}</p>

        {post.sections.map(section => (
          <section key={section.h} className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="display text-3xl sm:text-4xl">{section.h}</h2>
            {section.p.map(text => <p key={text} className="mt-4 text-lg leading-relaxed text-ink/80">{text}</p>)}
            {section.list && (section.ordered ? (
              <ol className="blog-list is-ordered mt-4">{section.list.map(item => <li key={item}>{item}</li>)}</ol>
            ) : (
              <ul className="blog-list mt-4">{section.list.map(item => <li key={item}>{item}</li>)}</ul>
            ))}
          </section>
        ))}

        <div className="blog-cta mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">See SAM in action</h2>
          <p className="mt-2 text-base leading-relaxed text-mute">Book a walkthrough of the interview experience and reports.</p>
          <Link href="/contact" className="mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 text-[15px] font-medium text-white transition-colors hover:bg-brand-ink">
            Request a demo\\ <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </article>

      <div className="mx-auto mt-20 max-w-6xl">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-ink">Keep reading</h2>
        <ul className="mt-5 grid gap-6 sm:grid-cols-2">
          {related.map(r => (
            <li key={r.slug}>
              <Link href={`/blog/${r.slug}`} className="blog-card group flex h-full flex-col">
                <span className="blog-tag">{r.category}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{r.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mute">{r.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
