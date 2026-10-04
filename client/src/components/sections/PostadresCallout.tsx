import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, MailOpen } from "lucide-react";

export function PostadresCallout() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#faf9f5] pb-20 md:pb-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-xl bg-primary p-10 text-white md:p-16">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]">
                <MailOpen className="h-4 w-4" />
                {t('postadres.badge')}
              </div>
              <h2 className="font-display mb-4 max-w-2xl text-4xl tracking-tight md:text-5xl">
                {t('postadres.calloutTitle')}
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-white/85">
                {t('postadres.calloutText')}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
                <div className="font-display text-4xl">€0,50 – €5</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/75">
                  {t('postadres.perMail')}
                </div>
              </div>
              <Link
                href="/help-mee"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#faf9f5] px-6 text-sm font-medium text-[#141413] transition-colors hover:bg-white"
              >
                {t('postadres.calloutCta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
