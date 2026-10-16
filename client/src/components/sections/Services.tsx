import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Home, 
  Briefcase, 
  FileText, 
  Landmark, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Clock,
  Award
} from "lucide-react";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Service = {
  id: number;
  name: string;
  imageUrl: string;
  icon: string;
};

type ServicesResponse = {
  success: boolean;
  data: Service[];
};

type ServiceDetailMeta = {
  name: string;
  partnerBadge: string;
  statBadge: string;
  icon: React.ReactNode;
  themeColor: string;
  bullets: string[];
  modalSubtitle: string;
  modalOverview: string;
  steps: { step: string; title: string; desc: string }[];
  guarantees: string[];
  partnerInfo?: { name: string; tag: string; description: string };
};

const SERVICE_META: Record<string, ServiceDetailMeta> = {
  housing: {
    name: "housing",
    partnerBadge: "Partner WoningVry",
    statBadge: "100% Huurbescherming",
    icon: <Home className="h-6 w-6 text-emerald-600" />,
    themeColor: "emerald",
    bullets: [
      "Geverifieerd woning- en kameraanbod via partner WoningVry",
      "Juridische huurcontractcontrole & bescherming tegen oplichting",
      "Zekerheid over gemeentelijke inschrijving & aanvraag huurtoeslag",
    ],
    modalSubtitle: "Vind veilige en betrouwbare woonruimte zonder malafide tussenpersonen",
    modalOverview:
      "De Nederlandse huurmarkt is krap en ingewikkeld voor nieuwkomers. Immigratiepunt beschermt je tegen illegale contracten, woekerprijzen en oplichting. In nauwe samenwerking met ons gecertificeerde partnerplatform WoningVry begeleiden wij je van de eerste zoektocht tot de sleuteloverdracht en de officiële inschrijving bij de gemeente.",
    steps: [
      {
        step: "01",
        title: "Woonwensen & Budgetanalyse",
        desc: "We inventariseren jouw gewenste regio, budget en vereiste voorwaarden (zelfstandig, kamer of gezinswoning).",
      },
      {
        step: "02",
        title: "Geverifieerd Aanbod via WoningVry",
        desc: "Toegang tot veilige listings met verhuurders die openstaan voor internationale nieuwkomers.",
      },
      {
        step: "03",
        title: "Juridische Huurcontractscreening",
        desc: "Onze experts controleren het concept-huurcontract op huurbescherming, servicekosten en ontbindende voorwaarden.",
      },
      {
        step: "04",
        title: "Inschrijving & Huurtoeslag",
        desc: "Begeleiding bij inschrijving in de Basisregistratie Personen (BRP) en officiële aanvraag van huurtoeslag.",
      },
    ],
    guarantees: [
      "Geen onwettige bemiddelingskosten of sleutelgeld",
      "Gegarandeerde BRP-inschrijving op het huuradres",
      "Nederlandse huurovereenkomst conform het Burgerlijk Wetboek",
    ],
    partnerInfo: {
      name: "WoningVry",
      tag: "Officiële Huisvestingspartner",
      description: "WoningVry is gespecialiseerd in betrouwbare verhuur voor expats en nieuwkomers zonder bureaucratische drempels.",
    },
  },
  employment: {
    name: "employment",
    partnerBadge: "Partner Djobba",
    statBadge: "92% binnen 30d op gesprek",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    themeColor: "primary",
    bullets: [
      "Nederlands CV & motivatiebrief volgens lokale wervingsnormen",
      "Directe vacaturematching via ons partnernetwerk Djobba",
      "Interviewtraining, CAO-advies & salarisonderhandeling",
    ],
    modalSubtitle: "Bouw een succesvolle carrière op in de Nederlandse arbeidsmarkt",
    modalOverview:
      "Werk vinden in een nieuw land vraagt om meer dan alleen vertalen van je cv. De Nederlandse werkcultuur hecht grote waarde aan specifieke competenties, directheid en CAO-kaders. Via ons strategische partnerschap met Djobba koppelen we jouw talent rechtstreeks aan inclusieve werkgevers en stomen we je klaar voor sollicitaties.",
    steps: [
      {
        step: "01",
        title: "Loopbaanscan & CV-Optimalisatie",
        desc: "We herschrijven je werkervaring naar het Nederlandse format en optimaliseren je LinkedIn-profiel voor recruiters.",
      },
      {
        step: "02",
        title: "Vacaturematching via Djobba",
        desc: "Directe introductie bij werkgevers die meertalige professionals en nieuwkomers actief verwelkomen.",
      },
      {
        step: "03",
        title: "Sollicitatietraining & Rollenspel",
        desc: "Oefen typisch Nederlandse interviewvragen, cultuurverschillen en effectieve zelfpresentatie met een coach.",
      },
      {
        step: "04",
        title: "Arbeidsvoorwaarden & CAO-Check",
        desc: "Onafhankelijk advies over marktconforme salarissen, pensioen, vakantiedagen en proeftijdbescherming.",
      },
    ],
    guarantees: [
      "Nederlandstalig en Engelstalig professioneel CV-template",
      "Persoonlijke begeleiding door ervaren recruitmentconsulenten",
      "Toegang tot niet-openbare vacatures in tech, logistiek, zorg en zakelijke diensten",
    ],
    partnerInfo: {
      name: "Djobba",
      tag: "Officiële Werkgelegenheidspartner",
      description: "Djobba verbindt internationale talenten met betrouwbare Nederlandse werkgevers en begeleidt nieuwkomers naar een duurzame baan.",
    },
  },
  banking: {
    name: "banking",
    partnerBadge: "Partner Xabi World",
    statBadge: "IBAN in 48 uur",
    icon: <Landmark className="h-6 w-6 text-[#e8a55a]" />,
    themeColor: "amber",
    bullets: [
      "Nederlandse betaalrekening (IBAN) binnen 48 uur na BSN",
      "Volledige activatie van iDEAL & mobiel bankieren",
      "Heldere uitleg over spaaropties zonder verborgen kosten",
    ],
    modalSubtitle: "Directe toegang tot het Nederlandse betalingsverkeer en iDEAL",
    modalOverview:
      "Zonder Nederlandse IBAN-bankrekening kun je in Nederland vrijwel niets: salaris ontvangen, huur betalen, een telefoonabonnement afsluiten of online betalen met iDEAL. Samen met bankpartner Xabi World zorgen we dat jouw bankrekening binnen recordtijd operationeel is.",
    steps: [
      {
        step: "01",
        title: "Documentverificatie",
        desc: "Voorbereiding van identificatie, BSN-document en postadres-overeenkomst.",
      },
      {
        step: "02",
        title: "Directe Rekeningaanvraag",
        desc: "Versneld digitaal aanvraagtraject bij erkende Nederlandse banken via Xabi World.",
      },
      {
        step: "03",
        title: "Activatie iDEAL & DigiD",
        desc: "Volledige installatie van mobiel bankieren, betaalpas en koppeling met DigiD.",
      },
      {
        step: "04",
        title: "Financieel Welzijn & Advies",
        desc: "Uitleg over automatische incasso's, spaarrentes en bescherming tegen phishing.",
      },
    ],
    guarantees: [
      "Officiële Nederlandse IBAN voor salaris en toeslagen",
      "iDEAL-functionaliteit en contactloos betalen",
      "Volledig Nederlands depositogarantiestelsel (DGS)",
    ],
    partnerInfo: {
      name: "Xabi World",
      tag: "Officiële Bankpartner",
      description: "Xabi World faciliteert financiële onboarding voor internationale nieuwkomers en expats in Nederland.",
    },
  },
  administrative: {
    name: "administrative",
    partnerBadge: "Immigratiepunt",
    statBadge: "BSN-garantie",
    icon: <FileText className="h-6 w-6 text-[#7c3aed]" />,
    themeColor: "purple",
    bullets: [
      "BSN-afspraak boeken en gemeentelijke registratie begeleiden",
      "Ondersteuning bij IND-aanvragen en verblijfsdocumenten",
      "Beëdigde vertalingen en legalisaties van officiële aktes",
    ],
    modalSubtitle: "Professionele ontzorging bij alle overheids- en IND-procedures",
    modalOverview:
      "Het Nederlandse administratieve systeem staat bekend om strenge regels en lange wachttijden. Immigratiepunt gidst je door alle bureaucratische formaliteiten. Wij zorgen voor foutloze dossiers, tijdige afspraken en rechtsgeldige beëdigde vertalingen.",
    steps: [
      {
        step: "01",
        title: "Dossiercheck & BSN-Voorbereiding",
        desc: "Grondige controle van paspoorten, geboorteakten en postadres-bevestigingen.",
      },
      {
        step: "02",
        title: "Gemeenteafspraak & BRP-Inschrijving",
        desc: "Reservering van het officiële tijdslot bij de gemeente en instructie voor de afspraak.",
      },
      {
        step: "03",
        title: "IND & Verblijfsvergunning",
        desc: "Ondersteuning bij verlenging, aanvraag of statuswijziging van je verblijfstitel.",
      },
      {
        step: "04",
        title: "DigiD & Zorgverzekering",
        desc: "Directe activatie van je digitale overheidssleutel (DigiD) en keuze voor een basiszorgverzekering.",
      },
    ],
    guarantees: [
      "Juridisch gecontroleerde aanvraagdossiers",
      "Beëdigde vertalers voor documenten in alle talen",
      "Snelle escalatielijnen bij gemeentelijke vertragingen",
    ],
  },
};

export function Services() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [activeModal, setActiveModal] = useState<ServiceDetailMeta | null>(null);

  const { data: services, isLoading } = useQuery<ServicesResponse>({
    queryKey: ['/api/services'],
  });

  return (
    <section id="services" className="relative overflow-hidden bg-[#faf9f5] py-20 md:py-28">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-[#5db8a6]/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-14 max-w-2xl">
          <div className="section-kicker">{t('services.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('services.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('services.subtitle')}
          </p>
        </MotionReveal>

        <MotionStaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#efe9de] p-8 animate-pulse">
                <div className="mb-6 h-10 w-10 rounded-xl bg-[#e6dfd8]" />
                <div className="mb-3 h-6 w-3/4 rounded bg-[#e6dfd8]" />
                <div className="mb-2 h-4 w-full rounded bg-[#e6dfd8]" />
                <div className="h-4 w-2/3 rounded bg-[#e6dfd8]" />
              </div>
            ))
          ) : (
            services?.data?.map((service: Service) => {
              const meta = SERVICE_META[service.name] || SERVICE_META.housing;
              return (
                <MotionStaggerItem key={service.id}>
                  <EnhancedServiceCard
                    service={service}
                    meta={meta}
                    onOpenModal={() => setActiveModal(meta)}
                  />
                </MotionStaggerItem>
              );
            })
          )}
        </MotionStaggerContainer>
      </div>

      {/* Deep-Dive Interactive Details Dialog */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        {activeModal && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-[#e6dfd8] bg-[#faf9f5] p-6 sm:p-10 shadow-2xl">
            <DialogHeader className="text-left pb-4 border-b border-[#e6dfd8]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3 w-3" />
                  <span>{activeModal.partnerBadge}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{activeModal.statBadge}</span>
                </span>
              </div>
              <DialogTitle className="font-display text-3xl font-medium tracking-tight text-[#141413] sm:text-4xl">
                {t(`services.${activeModal.name}.title`, activeModal.name)}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-[#6c6a64] mt-1">
                {activeModal.modalSubtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-8">
              {/* Overview Paragraph */}
              <div>
                <h4 className="font-display text-xl font-medium text-[#141413] mb-2">Waarom deze ondersteuning?</h4>
                <p className="text-sm leading-relaxed text-[#3d3d3a]">
                  {activeModal.modalOverview}
                </p>
              </div>

              {/* Partner Highlight Card if exists */}
              {activeModal.partnerInfo && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg font-semibold text-[#141413]">
                      In samenwerking met {activeModal.partnerInfo.name}
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                      {activeModal.partnerInfo.tag}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#3d3d3a]">
                    {activeModal.partnerInfo.description}
                  </p>
                </div>
              )}

              {/* 4-Step Action Roadmap */}
              <div>
                <h4 className="font-display text-xl font-medium text-[#141413] mb-4">Ons 4-Stappenplan</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeModal.steps.map((s) => (
                    <div key={s.step} className="rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#181715] text-[11px] font-bold text-white">
                          {s.step}
                        </span>
                        <h5 className="text-sm font-semibold text-[#141413]">{s.title}</h5>
                      </div>
                      <p className="text-xs leading-relaxed text-[#6c6a64]">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees & Features */}
              <div className="rounded-2xl border border-[#e6dfd8] bg-[#efe9de]/70 p-5">
                <h4 className="font-display text-lg font-medium text-[#141413] mb-3">Wat wij garanderen</h4>
                <ul className="space-y-2.5">
                  {activeModal.guarantees.map((g, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#3d3d3a]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom Call to Action */}
            <div className="pt-4 border-t border-[#e6dfd8] flex flex-col sm:flex-row gap-3 justify-end items-center">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#e6dfd8] text-xs font-semibold text-[#6c6a64] hover:bg-[#efe9de] transition-colors"
              >
                Sluiten
              </button>
              <button
                onClick={() => {
                  const serviceParam = activeModal.name;
                  setActiveModal(null);
                  navigate(`/registreren?service=${serviceParam}`);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-primary/25 hover:bg-[#a9583e] transition-all"
              >
                <span>Direct aanmelden voor deze dienst</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

function EnhancedServiceCard({
  service,
  meta,
  onOpenModal,
}: {
  service: Service;
  meta: ServiceDetailMeta;
  onOpenModal: () => void;
}) {
  const { t } = useTranslation();

  return (
    <ThreeDCard depth={8} className="h-full rounded-2xl">
      <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#e6dfd8]/80 bg-[#efe9de]/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-[#efe9de] hover:shadow-xl hover:shadow-[#cc785c]/15">
        <div>
          {/* Top badges and icon */}
          <ThreeDItem translateZ={25} className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
              {meta.icon}
            </div>
            <span className="rounded-full bg-white/90 border border-[#e6dfd8] px-3 py-1 text-[11px] font-semibold text-[#141413] shadow-xs">
              {t(`services.${service.name}.partnerBadge`, meta.partnerBadge)}
            </span>
          </ThreeDItem>

          {/* Stat Pill */}
          <ThreeDItem translateZ={20} className="mb-3">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{t(`services.${service.name}.stat`, meta.statBadge)}</span>
            </div>
          </ThreeDItem>

          {/* Title */}
          <ThreeDItem translateZ={30}>
            <h3 className="font-display mb-3 text-2xl font-medium tracking-tight text-[#141413] transition-colors group-hover:text-primary">
              {t(`services.${service.name}.title`)}
            </h3>
          </ThreeDItem>

          {/* Description */}
          <ThreeDItem translateZ={15}>
            <p className="mb-5 text-xs leading-relaxed text-[#3d3d3a]">
              {t(`services.${service.name}.description`)}
            </p>
          </ThreeDItem>

          {/* Bullet highlights */}
          <ThreeDItem translateZ={20} className="mb-6 space-y-2 border-t border-[#e6dfd8]/70 pt-4">
            {meta.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs leading-tight text-[#3d3d3a]">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </ThreeDItem>
        </div>

        {/* Dual Actions in Card Footer */}
        <ThreeDItem translateZ={25} className="pt-4 border-t border-[#e6dfd8]/80 flex items-center justify-between gap-2">
          {/* Info Button that triggers modal */}
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6c6a64] transition-colors hover:text-primary"
          >
            <Info className="h-3.5 w-3.5" />
            <span>{t('services.learnMore', 'Meer informatie')}</span>
          </button>

          {/* Direct Apply Button */}
          <Link
            href={`/registreren?service=${service.name}`}
            className="group/btn inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#a9583e] hover:shadow-sm"
          >
            <span>{t('services.startNow', 'Direct starten')}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </ThreeDItem>
      </div>
    </ThreeDCard>
  );
}
