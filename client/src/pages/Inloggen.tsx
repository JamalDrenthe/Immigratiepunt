import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowRight, LogIn } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { signIn } from "@/lib/auth";

export default function Inloggen() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError(t('login.errorInvalid'));
      return;
    }
    setIsSubmitting(true);
    signIn({ email, name: email.split("@")[0], role: "newcomer" });
    navigate("/account");
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-sm text-[#141413] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <>
      <Helmet>
        <title>{t('login.meta.title')}</title>
        <meta name="description" content={t('login.meta.description')} />
      </Helmet>

      <section className="bg-[#faf9f5] py-16 md:py-24">
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8 md:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#efe9de]">
                <LogoMark className="h-6 w-6" />
              </div>
              <h1 className="font-display text-3xl tracking-tight text-[#141413]">
                {t('login.title')}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6c6a64]">
                {t('login.subtitle')}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#141413]">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#141413]">
                  {t('login.password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg bg-[#f5e5de] px-4 py-2.5 text-xs font-medium text-[#a9583e]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-[#a9583e] disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {t('login.submit')}
              </button>
            </form>

            <div className="mt-8 border-t border-[#e6dfd8] pt-6 text-center">
              <p className="text-sm text-[#6c6a64]">
                {t('login.noAccount')}{" "}
                <Link href="/registreren" className="font-medium text-primary hover:underline">
                  {t('login.registerLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
