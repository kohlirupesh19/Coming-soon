"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: ""
};

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.company.trim().length < 2) {
    errors.company = "Please provide your company name.";
  }

  if (!values.projectType.trim()) {
    errors.projectType = "Please choose a project type.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Please include at least 20 characters about your project.";
  }

  return errors;
}

export default function ContactForm() {
  const [formValues, setFormValues] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSuccess("");
    setSubmitError("");

    const validation = validateForm(formValues);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      });

      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !data.success) {
        setSubmitError(data.error ?? "Unable to send your message right now. Please try again.");
        return;
      }

      setFormValues(initialForm);
      setErrors({});
      setSuccess(data.message ?? "Message sent successfully.");
    } catch {
      setSubmitError("Network error. Please try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-divider py-24 md:py-28" aria-labelledby="contact-heading">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="contact-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Let&apos;s Build Something Meaningful
          </h2>
          <p className="mt-4 text-text-muted">
            Tell us what you&apos;re building. We&apos;ll respond with a practical next-step plan.
          </p>
        </div>

        <form
          className="glass-panel mx-auto mt-12 max-w-3xl rounded-2xl border border-white/12 p-6 md:p-8"
          noValidate
          onSubmit={handleSubmit}
          aria-describedby={hasErrors ? "form-errors" : undefined}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-text-muted">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="input-base"
                value={formValues.name}
                onChange={(event) => handleChange("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                autoComplete="name"
                required
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-text-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-base"
                value={formValues.email}
                onChange={(event) => handleChange("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                autoComplete="email"
                required
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="mb-1.5 block text-sm text-text-muted">
                Company
              </label>
              <input
                id="company"
                name="company"
                className="input-base"
                value={formValues.company}
                onChange={(event) => handleChange("company", event.target.value)}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={errors.company ? "company-error" : undefined}
                autoComplete="organization"
                required
              />
              {errors.company && (
                <p id="company-error" className="mt-1 text-xs text-red-300">
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="projectType" className="mb-1.5 block text-sm text-text-muted">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                className="input-base"
                value={formValues.projectType}
                onChange={(event) => handleChange("projectType", event.target.value)}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={errors.projectType ? "projectType-error" : undefined}
                required
              >
                <option value="">Select a project type</option>
                <option value="web-platform">Web Platform</option>
                <option value="ai-software">AI Software</option>
                <option value="mobile-app">Mobile App</option>
                <option value="cloud-infrastructure">Cloud Infrastructure</option>
                <option value="product-engineering">Product Engineering</option>
              </select>
              {errors.projectType && (
                <p id="projectType-error" className="mt-1 text-xs text-red-300">
                  {errors.projectType}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="mb-1.5 block text-sm text-text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="input-base resize-y"
              value={formValues.message}
              onChange={(event) => handleChange("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-red-300">
                {errors.message}
              </p>
            )}
          </div>

          {(submitError || hasErrors) && (
            <p id="form-errors" className="mt-4 text-sm text-red-300" role="alert">
              {submitError || "Please review the highlighted fields and submit again."}
            </p>
          )}

          {success && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/22 bg-white/[0.07] px-3 py-2 text-sm text-white" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              {success}
            </p>
          )}

          <div className="mt-6">
            <Button type="submit" size="lg" className="min-w-[180px]" disabled={sending}>
              {sending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
