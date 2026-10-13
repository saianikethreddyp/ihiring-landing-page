"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import clsx from "clsx";
import { demoForm } from "@/lib/site";

type Values = Record<string, string>;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values) {
  const e: Values = {};
  if (!v.name?.trim()) e.name = "Tell us your name.";
  if (!v.organizationName?.trim()) e.organizationName = "Which company are you with?";
  if (!v.jobTitle?.trim()) e.jobTitle = "What is your role?";
  if (!emailRe.test(v.email?.trim() ?? "")) e.email = "Enter a valid work email.";
  if (!v.source) e.source = "Pick one so we know what is working.";
  return e;
}

export function DemoForm() {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Values>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const success = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  useEffect(() => {
    if (status === "done") success.current?.focus();
  }, [status]);

  const set = (k: string, val: string) => {
    setValues((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: "" }));
  };

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (submitting.current) return;
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]))),
        signal: AbortSignal.timeout(15000),
      });
      const result = await res.json();
      setStatus(res.ok && result.ok === true ? "done" : "error");
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "done") {
    return (
      <div ref={success} tabIndex={-1} role="status" className="demo-success rounded-3xl border border-[#dfe7f2] bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgba(30,64,130,0.25)] sm:p-12">
        <CheckCircle2 className="mx-auto text-brand" size={40} />
        <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">Thanks, {values.name?.trim().split(/\s+/)[0]}.</h2>
        <p className="mt-3 text-base leading-relaxed text-mute">We have your request and will be in touch shortly to set up your demo.</p>
      </div>
    );
  }

  const input =
    "mt-2 block h-12 w-full rounded-lg border bg-white px-4 text-base outline-none transition-colors placeholder:text-mute/60 hover:border-brand/40 focus:border-brand focus:ring-4 focus:ring-brand/15";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Request a demo" aria-busy={status === "sending"} className="demo-form relative overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(30,64,130,0.25)] sm:p-9">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-[#6fa3ff]" />
      <h2 className="text-2xl font-semibold tracking-tight">Request a demo</h2>
      <p className="mb-7 mt-1.5 text-[15px] text-mute">Tell us a little about your team. Fields marked * are required.</p>
      <fieldset disabled={status === "sending"}>
        <legend className="sr-only">Your contact details</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        {demoForm
          .filter((f) => !("options" in f && f.options))
          .map((f) => {
            const required = f.label.endsWith("*");
            const label = f.label.replace("*", "");
            const full = f.name === "phoneNumber";
            return (
              <div key={f.name} className={clsx(full && "sm:col-span-2")}>
                <label htmlFor={`f-${f.name}`} className="text-sm font-medium">
                  {label}
                  {required && <span aria-hidden="true" className="ml-1 text-brand">*</span>}
                  {!required && <span className="ml-1 font-normal text-mute">(optional)</span>}
                </label>
                <input
                  id={`f-${f.name}`}
                  name={f.name}
                  required={required}
                  maxLength={200}
                  type={f.name === "email" ? "email" : f.name === "phoneNumber" ? "tel" : "text"}
                  autoComplete={
                    { name: "name", email: "email", phoneNumber: "tel", organizationName: "organization", jobTitle: "organization-title" }[f.name]
                  }
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={!!errors[f.name]}
                  aria-describedby={errors[f.name] ? `e-${f.name}` : undefined}
                  className={clsx(input, errors[f.name] ? "border-red-400" : "border-line")}
                />
                {errors[f.name] && (
                  <p id={`e-${f.name}`} className="mt-1.5 text-sm text-red-600">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            );
          })}

        {demoForm
          .filter((f) => "options" in f && f.options)
          .map((f) => (
            <div key={f.name} className="sm:col-span-2">
              <label htmlFor={`f-${f.name}`} className="text-sm font-medium">
                {f.label.replace("*", "")}
                <span aria-hidden="true" className="ml-1 text-brand">*</span>
              </label>
              <select
                id={`f-${f.name}`}
                name={f.name}
                required
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                aria-invalid={!!errors[f.name]}
                aria-describedby={errors[f.name] ? `e-${f.name}` : undefined}
                className={clsx(input, errors[f.name] ? "border-red-400" : "border-line")}
              >
                <option value="">Select one</option>
                {"options" in f &&
                  f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
              </select>
              {errors[f.name] && (
                <p id={`e-${f.name}`} className="mt-1.5 text-sm text-red-600">
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}
      </div>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          We couldn’t send your request. Your details are still here—try again, or email <a className="underline" href="mailto:info@ihiring.ai">info@ihiring.ai</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="demo-submit mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-ink disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          "Book a demo"
        )}
      </button>
      <p className="mt-3 text-center text-xs text-mute">We only use this to contact you about your demo. <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link></p>
    </form>
  );
}
