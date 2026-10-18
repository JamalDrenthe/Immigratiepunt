import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Briefcase, 
  Home, 
  CreditCard,
  Building2,
  Globe2,
  Award
} from "lucide-react";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export default function OverOns() {
  const { t, i18n } = useTranslation();

  const values = [
    {
      icon: Users,
      title: t('aboutPage.values.val1Title', 'Menselijke Maat'),
      text: t('aboutPage.values.val1Text', 'Geen kille formulieren, maar persoonlijke begeleiding in jouw eigen taal door adviseurs die om je geven.'),
      color: "#cc785c"
    },
    {
      icon: ShieldCheck,
      title: t('aboutPage.values.val2Title', '100% Juridisch & Veilig'),
      text: t('aboutPage.values.val2Text', 'Een postadres is uitsluitend voor correspondentie en heeft geen invloed op belastingen, huur of uitkeringen van de helper.'),
      color: "#5db8a6"
    },
    {
      icon: HeartHandshake,
      title: t('aboutPage.values.val3Title', 'Wederzijds Voordeel'),
      text: t('aboutPage.values.val3Text', 'Helpers worden fair beloond voor elk poststuk (€0,50 tot €5,-) en nieuwkomers krijgen een vliegende start.'),
      color: "#e8a55a"
    },
    {
      icon: Sparkles,
      title: t('aboutPage.values.val4Title', 'Volledig Ecosysteem'),
      text: t('aboutPage.values.val4Text', 'Van postadres en BSN tot bankrekening, een dak boven het hoofd en een fijne baan: alles onder één dak.'),
      color: "#7c3aed"
    }
  ];

  const partners = [
    {
      name: "Djobba",
      tag: "Werk & Carrière",
      desc: "Koppelt internationale talenten en nieuwkomers direct aan betrouwbare werkgevers in Nederland.",
      icon: Briefcase,
      color: "#cc785c"
    },
    {
      name: "WoningVry",
      tag: "Huisvesting & Wonen",
      desc: "Begeleidt nieuwkomers naar veilige en eerlijke huurwoningen zonder malafide tussenpersonen.",
      icon: Home,
      color: "#5db8a6"
    },
    {
      name: "Xabi World",
      tag: "Bank & Financiën",
      desc: "Helpt bij het snel openen van een Nederlandse bankrekening en het begrijpen van het financiële systeem.",
      icon: CreditCard,
      color: "#e8a55a"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('aboutPage.meta.title', 'Over Ons | Immigratiepunt')}</title>
        <meta name="description" content={t('aboutPage.meta.description', 'Leer meer over de missie, visie en het team van Immigratiepunt.')} />
        <meta property="og:title" content={t('aboutPage.meta.title', 'Over Ons | Immigratiepunt')} />
        <meta property="og:locale" content={i18n.language} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#faf9f5] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#cc785c]/10 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#e8a55a]/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <MotionReveal direction="up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e6dfd8] bg-[#efe9de]/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#141413]">
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span>{t('aboutPage.badge', 'Over Immigratiepunt')}</span>
              </div>
              <h1 className="font-display mb-6 text-5xl font-medium leading-[1.05] tracking-tight text-[#141413] md:text-6xl">
                {t('aboutPage.title', 'Een warm en helder begin in Nederland')}
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-[#3d3d3a]">
                {t('aboutPage.subtitle', 'Wij doorbreken de bureaucratische drempels voor internationale nieuwkomers via persoonlijke begeleiding en het baanbrekende postadres-programma.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/registreren"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#a9583e]"
                >
                  <span>Aan de slag</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/help-mee"
                  className="inline-flex h-12 items-center rounded-xl border border-[#e6dfd8] bg-white px-7 text-sm font-semibold text-[#141413] shadow-sm transition-all hover:bg-[#efe9de]"
                >
                  Word Helper
                </Link>
              </div>
            </MotionReveal>

            {/* Legal Foundation Card (Replaces AI Compass) */}
            <MotionReveal direction="left">
              <div className="rounded-3xl border border-[#e6dfd8] bg-white p-7 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-[#f0eae1] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-sm text-[#141413]">
                      {t('aboutPage.legalCard.title', 'Wettelijk Kader Briefadres')}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    {t('aboutPage.legalCard.badge', 'Art. 2.45 Wet BRP')}
                  </span>
                </div>

                <p className="text-xs text-[#3d3d3a] leading-relaxed mb-4">
                  {t('aboutPage.legalCard.intro', 'De Nederlandse wet (Wet basisregistratie personen) biedt iedereen die tijdelijk geen vast woonadres heeft het recht op een officieel briefadres. Dit voorkomt dat nieuwkomers buiten het systeem vallen.')}
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141413] block">
                        {t('aboutPage.legalCard.point1Title', 'Geen effect op belastingen van de helper')}
                      </strong>
                      <span className="text-[#6c6a64] text-[11px]">
                        {t('aboutPage.legalCard.point1Desc', 'Een briefadresgever telt niet mee als medebewoner voor de afvalstoffenheffing, huurtoeslag of bijstand.')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141413] block">
                        {t('aboutPage.legalCard.point2Title', 'Officiële toestemmingsverklaring')}
                      </strong>
                      <span className="text-[#6c6a64] text-[11px]">
                        {t('aboutPage.legalCard.point2Desc', 'De helper ondertekent het gemeentelijke formulier waarmee de nieuwkomer zich inschrijft bij Burgerzaken.')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141413] block">
                        {t('aboutPage.legalCard.point3Title', 'Strikte privacygarantie')}
                      </strong>
                      <span className="text-[#6c6a64] text-[11px]">
                        {t('aboutPage.legalCard.point3Desc', 'Helpers openen nooit post; zij loggen uitsluitend de afzender in het beveiligde portaal.')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Impact Statistics Counter */}
      <section className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <MotionStaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <MotionStaggerItem className="text-center">
              <div className="font-display text-4xl font-bold tracking-tight text-[#141413] sm:text-5xl">4</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                {t('aboutPage.stats.newcomers', "Kernregio's (A'dam, R'dam, Utrecht, Den Haag)")}
              </div>
            </MotionStaggerItem>
            <MotionStaggerItem className="text-center">
              <div className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">€ 0,50 - € 5</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                {t('aboutPage.stats.helpers', 'Staffelvergoeding per poststuk')}
              </div>
            </MotionStaggerItem>
            <MotionStaggerItem className="text-center">
              <div className="font-display text-4xl font-bold tracking-tight text-emerald-600 sm:text-5xl">48u</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                {t('aboutPage.stats.satisfaction', 'IBAN-activatie na BSN (Xabi)')}
              </div>
            </MotionStaggerItem>
            <MotionStaggerItem className="text-center">
              <div className="font-display text-4xl font-bold tracking-tight text-[#e8a55a] sm:text-5xl">100%</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                {t('aboutPage.stats.avgDays', 'Juridisch Briefadres (Wet BRP)')}
              </div>
            </MotionStaggerItem>
          </MotionStaggerContainer>
        </div>
      </section>

      {/* Mission & The Problem / Solution */}
      <section className="bg-[#faf9f5] py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <MotionReveal direction="right">
              <div className="section-kicker">{t('aboutPage.mission.kicker', 'Onze Missie')}</div>
              <h2 className="font-display mb-6 text-4xl font-medium tracking-tight text-[#141413] md:text-5xl">
                {t('aboutPage.mission.title', 'Waarom Immigratiepunt bestaat')}
              </h2>
              <p className="mb-4 text-base leading-relaxed text-[#3d3d3a]">
                {t('aboutPage.mission.text1', 'Jaarlijks komen duizenden gemotiveerde mensen naar Nederland om te werken, studeren of een nieuw bestaan op te bouwen. Velen lopen echter vast in een bureaucratische vicieuze cirkel: zonder vast woonadres kun je geen BSN aanvragen, zonder BSN kun je geen bankrekening openen, en zonder bankrekening kun je geen huurcontract of salaris ontvangen.')}
              </p>
              <p className="text-base leading-relaxed text-[#3d3d3a]">
                {t('aboutPage.mission.text2', 'Immigratiepunt is opgericht om deze cirkel direct te doorbreken. Door particulieren en organisaties te verbinden die hun adres als tijdelijk postadres aanbieden, geven we nieuwkomers de sleutel tot officiële registratie.')}
              </p>
            </MotionReveal>

            {/* Visual Breakthrough Flow in 3D Card */}
            <MotionReveal direction="left">
              <ThreeDCard depth={10} className="rounded-3xl shadow-xl shadow-black/5">
                <div className="rounded-3xl border border-[#e6dfd8] bg-[#efe9de] p-8 sm:p-10">
                  <div className="mb-6 flex items-center justify-between border-b border-[#e6dfd8] pb-4">
                    <span className="font-display text-2xl font-medium text-[#141413]">De Vicieuze Cirkel Doorbroken</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Oplossing</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-[#e6dfd8]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 font-bold text-xs shrink-0">1</span>
                      <span className="text-sm font-medium text-[#3d3d3a]">Geen vast adres ➔ Gemeente weigert BSN inschrijving</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 rotate-90 text-primary" />
                    </div>
                    <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 p-4 border border-primary/30">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shrink-0">IP</span>
                      <span className="text-sm font-bold text-[#141413]">Immigratiepunt koppelt een gecertificeerd Postadres-helper</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 rotate-90 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-4 rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                      <span className="text-sm font-semibold text-emerald-900">BSN Toegekend ➔ Bankrekening geopend ➔ Woning & Werk mogelijk!</span>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-t border-[#e6dfd8] bg-[#f5f0e8] py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <MotionReveal direction="up" className="mb-14 max-w-2xl">
            <div className="section-kicker">{t('aboutPage.values.kicker', 'Kernwaarden')}</div>
            <h2 className="font-display mb-4 text-4xl font-medium tracking-tight text-[#141413] md:text-5xl">
              {t('aboutPage.values.title', 'Waar wij voor staan')}
            </h2>
            <p className="text-lg leading-relaxed text-[#3d3d3a]">
              Vier fundamenten die ten grondslag liggen aan alles wat we doen bij Immigratiepunt.
            </p>
          </MotionReveal>

          <MotionStaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <MotionStaggerItem key={v.title}>
                  <ThreeDCard depth={8} className="h-full rounded-2xl">
                    <div className="flex h-full flex-col rounded-2xl border border-[#e6dfd8] bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
                      <div
                        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                        style={{ backgroundColor: v.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display mb-3 text-2xl font-medium tracking-tight text-[#141413]">
                        {v.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#3d3d3a]">
                        {v.text}
                      </p>
                    </div>
                  </ThreeDCard>
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerContainer>
        </div>
      </section>

      {/* Partners Ecosystem */}
      <section className="bg-[#faf9f5] py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <MotionReveal direction="up" className="mb-14 max-w-2xl">
            <div className="section-kicker">{t('aboutPage.partners.kicker', 'Partners')}</div>
            <h2 className="font-display mb-4 text-4xl font-medium tracking-tight text-[#141413] md:text-5xl">
              {t('aboutPage.partners.title', 'Samenwerken voor maximale impact')}
            </h2>
            <p className="text-lg leading-relaxed text-[#3d3d3a]">
              {t('aboutPage.partners.subtitle', 'Immigratiepunt werkt nauw samen met toonaangevende integratiepartners om jouw overgang compleet te maken.')}
            </p>
          </MotionReveal>

          <MotionStaggerContainer className="grid gap-6 md:grid-cols-3">
            {partners.map((partner) => {
              const Icon = partner.icon;
              return (
                <MotionStaggerItem key={partner.name}>
                  <ThreeDCard depth={8} className="h-full rounded-2xl">
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#e6dfd8] bg-[#efe9de]/70 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-[#efe9de] hover:shadow-xl">
                      <div>
                        <div className="mb-5 flex items-center justify-between">
                          <span
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                            style={{ backgroundColor: partner.color }}
                          >
                            <Icon className="h-6 w-6" />
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#141413] border border-[#e6dfd8]">
                            {partner.tag}
                          </span>
                        </div>
                        <h3 className="font-display mb-3 text-3xl font-medium tracking-tight text-[#141413]">
                          {partner.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#3d3d3a]">
                          {partner.desc}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#e6dfd8]/60">
                        <Link
                          href="/account"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                        >
                          <span>Bekijk integratie</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </ThreeDCard>
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerContainer>
        </div>
      </section>

      {/* Team / Community Section */}
      <section className="border-t border-[#e6dfd8] bg-[#181715] py-20 text-[#faf9f5] md:py-28">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <MotionReveal direction="up" className="mx-auto max-w-2xl">
            <div className="section-kicker">{t('aboutPage.team.kicker', 'Ons Netwerk')}</div>
            <h2 className="font-display mb-6 text-4xl font-medium tracking-tight text-[#faf9f5] md:text-5xl">
              {t('aboutPage.team.title', 'Gedreven door mensen met passie voor verbinding')}
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-[#a09d96]">
              {t('aboutPage.team.text', 'Het Immigratiepunt-netwerk bestaat uit ervaren consulenten, juridische specialisten, vrijwilligers en ervaringsdeskundigen door heel Nederland.')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/registreren"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#a9583e]"
              >
                <span>Meld je aan als nieuwkomer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Contact opnemen
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
