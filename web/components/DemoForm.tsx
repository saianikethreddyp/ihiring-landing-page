"use client";

import { useState } from "react";
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
  if (!emailRe.test(v.email ?? "")) e.email = "Enter a valid work email.";
  if (!v.source) e.source = "Pick one so we know what is working.";
  return e;
}

export function DemoForm() {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Values>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: string, val: string) => {
    setValues((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: "" }));
  };

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-[28px] border border-ink/10 bg-card p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
        <h2 className="display mt-4 text-4xl">Thanks, {values.name?.split(" ")[0]}.</h2>
        <p className="mt-2 text-mute">We have your request and will reach out at {values.email} to set up your demo.</p>
      </div>
    );
  }

  const input =
    "mt-1.5 block h-11 w-full rounded-xl border bg-paper px-3.5 text-base outline-none transition-colors placeholder:text-mute/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[28px] border border-ink/10 bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {demoForm
          .filter((f) => !("options" in f && f.options))
          .map((f) => {
            const required = f.label.endsWith("*");
            const label = f.label.replace("*", "");
            const full = f.name === "email" || f.name === "phoneNumber";
            return (
              <div key={f.name} className={clsx(full && "sm:col-span-2")}>
                <label htmlFor={`f-${f.name}`} className="text-sm font-medium">
                  {label}
                  {!required && <span className="ml-1 font-normal text-mute">(optional)</span>}
                </label>
                <input
                  id={`f-${f.name}`}
                  name={f.name}
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
              </label>
              <select
                id={`f-${f.name}`}
                name={f.name}
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

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong sending that. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-paper transition-colors hover:bg-ink-2 disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          "Book a demo"
        )}
      </button>
      <p className="mt-3 text-center text-xs text-mute">We only use this to contact you about your demo.</p>
    </form>
  );
}
