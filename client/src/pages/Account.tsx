import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import {
  ArrowUpRight,
  Briefcase,
  Home,
  Landmark,
  LogOut,
  UserRound,
  ShieldCheck,
  CheckCircle2,
  Mail,
  HeartHandshake,
  UserCheck,
  ExternalLink,
  Coins,
  FileText,
  Users,
} from "lucide-react";
import { getMember, signOut, signInAsDemo, MemberRole } from "@/lib/auth";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const member = getMember();

  useEffect(() => {
    if (!member) navigate("/inloggen");
  }, [member, navigate]);

  if (!member) return null;

  const isAdminRole = member.role === "admin" || member.email.toLowerCase() === "info@jamaldrenthe.com";
  const isHelperRole = member.role === "helper";
  const isNewcomerRole = !isAdminRole && !isHelperRole;

  const partners = [
    { key: "djobba", icon: Briefcase, url: "https://djobba.nl" },
    { key: "woningvry", icon: Home, url: "https://woningvry.nl" },
    { key: "xabiworld", icon: Landmark, url: "https://xabiworld.com" },
  ];

  const handleRoleSwitch = (role: MemberRole) => {
    signInAsDemo(role);
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>{isAdminRole ? "Admin Dashboard | Immigratiepunt" : t("account.meta.title")}</title>
        <meta name="description" content={t("account.meta.description")} />
      </Helmet>

      <section className="bg-[#faf9f5] py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header Bar */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#e6dfd8] pb-8">
            <div className="flex items-center gap-4 md:gap-5">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                  isAdminRole
                    ? "bg-purple-100 text-purple-700"
                    : isHelperRole
                    ? "bg-blue-100 text-blue-700"
                    : "bg-[#efe9de] text-primary"
                }`}
              >
                {isAdminRole ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : isHelperRole ? (
                  <HeartHandshake className="h-7 w-7" />
                ) : (
                  <UserRound className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="section-kicker">{t("account.kicker")}</span>
                  {isAdminRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                      <ShieldCheck className="h-3 w-3" />
                      Administrator
                    </span>
                  )}
                  {isHelperRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      <HeartHandshake className="h-3 w-3" />
                      Hulpverlener
                    </span>
                  )}
                  {isNewcomerRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <UserCheck className="h-3 w-3" />
                      Immigrant
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl tracking-tight text-[#141413] md:text-4xl">
                  {t("account.title", { name: member.name })}
                </h1>
                <p className="mt-1 text-sm text-[#6c6a64]">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Demo Account Quick Switcher */}
              <div className="hidden items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white p-1 text-xs sm:flex">
                <span className="px-2 text-[#8c887f]">Demo wissel:</span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isAdminRole ? "bg-purple-100 text-purple-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("helper")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isHelperRole ? "bg-blue-100 text-blue-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Helper
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("newcomer")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isNewcomerRole ? "bg-emerald-100 text-emerald-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Immigrant
                </button>
              </div>

              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfd8] bg-white px-4 text-sm font-medium text-[#3d3d3a] transition-colors hover:bg-[#efe9de]"
              >
                <LogOut className="h-4 w-4" />
                {t("account.signOut")}
              </button>
            </div>
          </div>

          {/* ADMIN VIEW */}
          {isAdminRole && (
            <div className="space-y-8">
              {/* System Infrastructure Card */}
              <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#141413]">
                        Systeem- & Toegangsbeheer
                      </h2>
                      <p className="text-xs text-[#6c6a64]">
                        Status van gekoppelde platforms en beveiliging
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Alles Operationeel
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Firebase Koppeling</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      immigratiepunt-dev
                    </div>
                    <div className="mt-1 text-[11px] text-[#6c6a64]">
                      Beheerder: info@jamaldrenthe.com
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Firestore Rules</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      isAdmin() Actief
                    </div>
                    <div className="mt-1 text-[11px] text-[#6c6a64]">
                      Alleen admin leest/schrijft data
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">GitHub & Vercel</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Git Push Geverifieerd
                    </div>
                    <div className="mt-1 text-[11px] text-[#6c6a64]">
                      Repo: JamalDrenthe/Immigratiepunt
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-[#f0eae1] pt-4">
                  <a
                    href="https://console.firebase.google.com/project/immigratiepunt-dev/overview"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e6dfd8] bg-white px-3.5 py-2 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#6c6a64]" />
                    Firebase Console openen
                  </a>
                  <a
                    href="https://github.com/JamalDrenthe/Immigratiepunt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e6dfd8] bg-white px-3.5 py-2 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#6c6a64]" />
                    GitHub Repo openen
                  </a>
                </div>
              </div>

              {/* Admin Key Metrics */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6c6a64]">
                  Platform Overzicht
                </h3>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
                    <div className="flex items-center justify-between text-[#6c6a64]">
                      <span className="text-xs font-medium">Nieuwkomers</span>
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#141413]">18</div>
                    <div className="text-xs text-emerald-600">+3 deze week</div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
                    <div className="flex items-center justify-between text-[#6c6a64]">
                      <span className="text-xs font-medium">Postadres Helpers</span>
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#141413]">9</div>
                    <div className="text-xs text-blue-600">Amsterdam, Rotterdam, Den Haag</div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
                    <div className="flex items-center justify-between text-[#6c6a64]">
                      <span className="text-xs font-medium">Poststukken Verwerkt</span>
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#141413]">74</div>
                    <div className="text-xs text-[#6c6a64]">Gemeente & IND brieven</div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
                    <div className="flex items-center justify-between text-[#6c6a64]">
                      <span className="text-xs font-medium">Vergoedingen</span>
                      <Coins className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#141413]">€ 185,00</div>
                    <div className="text-xs text-[#6c6a64]">Uitbetaald aan helpers</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HULPVERLENER VIEW */}
          {isHelperRole && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#141413]">
                        Jouw Aangeboden Postadres
                      </h2>
                      <p className="text-xs text-[#6c6a64]">
                        Geregistreerd adres: Hoofdstraat 42, 1011 AA Amsterdam
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Actief gekoppeld
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Post deze maand</div>
                    <div className="mt-1 text-2xl font-bold text-[#141413]">6 brieven</div>
                    <div className="text-[11px] text-emerald-600">€ 2,50 vergoeding per brief</div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Vergoeding ontvangen</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">€ 15,00</div>
                    <div className="text-[11px] text-[#6c6a64]">Maandelijkse donatie: € 5,00</div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Netto verdienste</div>
                    <div className="mt-1 text-2xl font-bold text-primary">+ € 10,00</div>
                    <div className="text-[11px] text-primary">En je helpt iemand aan een BSN!</div>
                  </div>
                </div>
              </div>

              {/* Matched Newcomers */}
              <div className="rounded-xl border border-[#e6dfd8] bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold text-[#141413]">
                  Aan jouw adres gekoppelde nieuwkomer
                </h3>
                <div className="flex items-center justify-between rounded-lg border border-[#ece6de] bg-[#faf9f5] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                      FA
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#141413]">Fatima Al-Mansoor</div>
                      <div className="text-xs text-[#6c6a64]">Aanvraag BSN bij Gemeente Amsterdam</div>
                    </div>
                  </div>
                  <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                    Wacht op post van Gemeente
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* IMMIGRANT / NEWCOMER VIEW */}
          {isNewcomerRole && (
            <div className="mb-10 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#141413]">
                      Jouw Vestigings- en BSN Status
                    </h2>
                    <p className="text-xs text-[#6c6a64]">
                      Postadres gekoppeld via partnerhelper: Jan de Vries (Amsterdam)
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Postadres Actief
                </span>
              </div>
            </div>
          )}

          {/* Integration Services Section (Available to everyone) */}
          <div className="mt-10">
            <div className="mb-4">
              <h2 className="font-display text-2xl tracking-tight text-[#141413]">
                {t("account.servicesTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6c6a64]">
                {t("account.servicesSubtitle")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {partners.map(({ key, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-[#e6dfd8] bg-white p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#efe9de] transition-colors group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[#6c6a64] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                    {t(`account.partners.${key}.label`)}
                  </div>
                  <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413]">
                    {t(`account.partners.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-6 text-[#3d3d3a]">
                    {t(`account.partners.${key}.text`)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
