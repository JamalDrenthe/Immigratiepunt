import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeekerForm } from "@/components/forms/SeekerForm";
import { HelperForm } from "@/components/forms/HelperForm";

export default function Registreren() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const defaultTab = params.get("type") === "helper" ? "helper" : "seeker";

  const benefits = [
    'registration.benefits.personal',
    'registration.benefits.streamlined',
    'registration.benefits.access',
    'registration.benefits.bilingual',
  ];

  return (
    <>
      <Helmet>
        <title>{t('registerPage.meta.title')}</title>
        <meta name="description" content={t('registerPage.meta.description')} />
      </Helmet>

      <section className="bg-[#faf9f5] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-14 lg:grid-cols-[5fr_7fr]">
            <div>
              <div className="section-kicker">{t('registerPage.kicker')}</div>
              <h1 className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-[#141413]">
                {t('registration.title')}
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-[#3d3d3a]">
                {t('registration.subtitle')}
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-sm leading-6 text-[#3d3d3a]">{t(benefit)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8 md:p-10">
              <Tabs
                defaultValue={defaultTab}
                className="w-full"
                onValueChange={(value) => navigate(value === "helper" ? "/registreren?type=helper" : "/registreren")}
              >
                <TabsList className="mb-8 grid h-auto w-full grid-cols-2 rounded-lg bg-[#efe9de] p-1">
                  <TabsTrigger
                    value="seeker"
                    className="rounded-md px-4 py-2.5 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-[#faf9f5] data-[state=active]:text-[#141413] data-[state=active]:shadow-none"
                  >
                    {t('registerPage.seekerTab')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="helper"
                    className="rounded-md px-4 py-2.5 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-[#faf9f5] data-[state=active]:text-[#141413] data-[state=active]:shadow-none"
                  >
                    {t('registerPage.helperTab')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="seeker">
                  <h2 className="font-display mb-6 text-3xl tracking-tight text-[#141413]">
                    {t('registration.formTitle')}
                  </h2>
                  <SeekerForm />
                </TabsContent>
                <TabsContent value="helper">
                  <h2 className="font-display mb-2 text-3xl tracking-tight text-[#141413]">
                    {t('helperForm.title')}
                  </h2>
                  <p className="mb-6 text-sm leading-6 text-[#6c6a64]">
                    {t('helperForm.subtitle')}
                  </p>
                  <HelperForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
