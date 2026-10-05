import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowUpRight, Briefcase, Home, Landmark, LogOut, UserRound } from "lucide-react";
import { getMember, signOut } from "@/lib/auth";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const member = getMember();

  useEffect(() => {
    if (!member) navigate("/inloggen");
  }, [member, navigate]);

  if (!member) return null;

  const partners = [
    { key: "djobba", icon: Briefcase, url: "https://djobba.nl" },
    { key: "woningvry", icon: Home, url: "https://woningvry.nl" },
    { key: "xabiworld", icon: Landmark, url: "https://xabiworld.com" },
  ];

  return (
    <>
      <Helmet>
        <title>{t('account.meta.title')}</title>
        <meta name="description" content={t('account.meta.description')} />
      </Helmet>

      <section className="bg-[#faf9f5] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#efe9de]">
                <UserRound className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="section-kicker mb-1">{t('account.kicker')}</div>
                <h1 className="font-display text-4xl tracking-tight text-[#141413] md:text-5xl">
                  {t('account.title', { name: member.name })}
                </h1>
                <p className="mt-1 text-sm text-[#6c6a64]">{member.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-4 text-sm font-medium text-[#3d3d3a] transition-colors hover:bg-[#efe9de]"
            >
              <LogOut className="h-4 w-4" />
              {t('account.signOut')}
            </button>
          </div>

          <div className="mb-4">
            <h2 className="font-display text-2xl tracking-tight text-[#141413]">
              {t('account.servicesTitle')}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6c6a64]">
              {t('account.servicesSubtitle')}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {partners.map(({ key, icon: Icon, url }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8 transition-colors hover:border-primary/40 hover:bg-[#efe9de]/40"
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
      </section>
    </>
  );
}
