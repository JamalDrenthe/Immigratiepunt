import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowRight, LogIn, ShieldCheck, UserCheck, HeartHandshake, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { signIn, signInWithGoogle, signInAsDemo, DEMO_ACCOUNTS, MemberRole, isEmailAdmin } from "@/lib/auth";

export default function Inloggen() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/account");
    } catch (err) {
      console.error(err);
      setError("Er ging iets mis bij het inloggen met Google. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: MemberRole) => {
    setIsSubmitting(true);
    signInAsDemo(role);
    navigate("/account");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError(t("login.errorInvalid"));
      return;
    }
    setIsSubmitting(true);
    const role: MemberRole = isEmailAdmin(email) ? "admin" : "newcomer";
    signIn({
      email,
      name: email.split("@")[0],
      role,
      provider: "credentials",
    });
    navigate("/account");
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-sm text-[#141413] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <>
      <Helmet>
        <title>{t("login.meta.title")}</title>
        <meta name="description" content={t("login.meta.description")} />
      </Helmet>

      <section className="bg-[#faf9f5] py-12 md:py-20">
        <div className="container mx-auto max-w-lg px-4">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-7 shadow-sm md:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#efe9de]">
                <LogoMark className="h-6 w-6" />
              </div>
              <h1 className="font-display text-3xl tracking-tight text-[#141413]">
                {t("login.title")}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6c6a64]">
                {t("login.subtitle")}
              </p>
            </div>

            {/* Google OAuth Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e6dfd8] bg-white px-4 text-sm font-semibold text-[#141413] shadow-sm transition-all hover:border-[#141413]/30 hover:bg-[#faf9f5] disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Inloggen met Google</span>
              </button>
              <p className="text-center text-xs text-[#6c6a64]">
                Inloggen met <span className="font-medium text-[#141413]">info@immigratiepunt.nl</span> verleent direct beheerderstoegang (Admin).
              </p>
            </div>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-8 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Demo Accounts (1-klik login)
                </span>
                <span className="text-[11px] text-[#8c887f]">Kies een rol</span>
              </div>

              <div className="space-y-2">
                {/* Demo Immigrant */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("newcomer")}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-between rounded-lg border border-[#e6dfd8] bg-white p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-[#fffdf9]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#141413]">
                        {DEMO_ACCOUNTS.newcomer.name}
                      </div>
                      <div className="text-[11px] text-[#6c6a64]">
                        {DEMO_ACCOUNTS.newcomer.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-100/70 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    Immigrant
                  </span>
                </button>

                {/* Demo Helper */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("helper")}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-between rounded-lg border border-[#e6dfd8] bg-white p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-[#fffdf9]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#141413]">
                        {DEMO_ACCOUNTS.helper.name}
                      </div>
                      <div className="text-[11px] text-[#6c6a64]">
                        {DEMO_ACCOUNTS.helper.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md bg-blue-100/70 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                    Hulpverlener
                  </span>
                </button>

                {/* Demo Admin */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-between rounded-lg border border-[#e6dfd8] bg-white p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-[#fffdf9]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#141413]">
                        {DEMO_ACCOUNTS.admin.name}
                      </div>
                      <div className="text-[11px] text-[#6c6a64]">
                        {DEMO_ACCOUNTS.admin.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md bg-purple-100/70 px-2 py-0.5 text-[11px] font-medium text-purple-800">
                    Admin
                  </span>
                </button>
              </div>
            </div>

            <div className="relative my-7 flex items-center justify-center">
              <span className="w-full border-t border-[#e6dfd8]" />
              <span className="bg-white px-3 text-xs uppercase text-[#6c6a64]">of handmatig</span>
              <span className="w-full border-t border-[#e6dfd8]" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#141413]">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="uw@email.nl"
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#141413]">
                  {t("login.password")}
                </label>
                <input
                  type="password"
                  value={password}
                  placeholder="••••••••"
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
                {t("login.submit")}
              </button>
            </form>

            <div className="mt-8 border-t border-[#e6dfd8] pt-6 text-center">
              <p className="text-sm text-[#6c6a64]">
                {t("login.noAccount")}{" "}
                <Link href="/registreren" className="font-medium text-primary hover:underline">
                  {t("login.registerLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
