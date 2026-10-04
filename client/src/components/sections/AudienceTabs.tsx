import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AudienceTabs() {
  const { t } = useTranslation();

  const panels = [
    {
      value: "newcomer",
      bullets: t('audience.newcomer.bullets', { returnObjects: true }) as string[],
      cta: "/registreren",
      ctaLabel: t('audience.newcomer.cta'),
    },
    {
      value: "helper",
      bullets: t('audience.helper.bullets', { returnObjects: true }) as string[],
      cta: "/help-mee",
      ctaLabel: t('audience.helper.cta'),
    },
  ];

  return (
    <section id="voor-wie" className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('audience.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('audience.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">{t('audience.subtitle')}</p>
        </div>

        <Tabs defaultValue="newcomer" className="w-full">
          <TabsList className="mb-8 h-auto rounded-lg bg-transparent p-0">
            <TabsTrigger
              value="newcomer"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-[#efe9de] data-[state=active]:text-[#141413] data-[state=active]:shadow-none"
            >
              {t('audience.newcomer.tab')}
            </TabsTrigger>
            <TabsTrigger
              value="helper"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-[#efe9de] data-[state=active]:text-[#141413] data-[state=active]:shadow-none"
            >
              {t('audience.helper.tab')}
            </TabsTrigger>
          </TabsList>

          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              <div className="grid gap-10 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8 md:grid-cols-2 md:p-10">
                <div>
                  <h3 className="font-display mb-4 text-3xl tracking-tight text-[#141413]">
                    {t(`audience.${panel.value}.heading`)}
                  </h3>
                  <p className="text-base leading-relaxed text-[#3d3d3a]">
                    {t(`audience.${panel.value}.text`)}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <ul className="space-y-3">
                    {panel.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-[#3d3d3a]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Link
                      href={panel.cta}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
                    >
                      {panel.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
