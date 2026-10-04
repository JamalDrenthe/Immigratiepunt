import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export function CtaBand() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#faf9f5] py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-xl bg-primary p-10 text-center text-white md:p-16">
          <h2 className="font-display mx-auto mb-4 max-w-2xl text-4xl tracking-tight md:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/85">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/registreren"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#faf9f5] px-6 text-sm font-medium text-[#141413] transition-colors hover:bg-white"
            >
              {t('cta.newcomerButton')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/help-mee"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#252320]/25 px-6 text-sm font-medium text-white transition-colors hover:bg-[#252320]/40"
            >
              {t('cta.helperButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
