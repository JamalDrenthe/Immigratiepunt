import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Home,
  Coins,
  HeartHandshake,
  ShieldCheck,
  Scale,
  Globe2,
  Laptop,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Send,
  Building2,
  Users,
  Award,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Coffee,
  Check,
  X,
  Target,
  BadgePercent,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { submitJobApplication } from "@/lib/firebase";

export interface JobPosition {
  id: string; // e.g. "01"
  title: string;
  domain: string;
  partnerBrand?: string;
  category: "work" | "housing" | "subsidies" | "helpers" | "corporate" | "legal";
  rewardShort: string;
  rewardFull: string;
  hours: string;
  location: string;
  experience: string;
  description: string;
  tasks: string[];
  profile: string[];
}

export const VACATURES_DATA: JobPosition[] = [
  {
    id: "01",
    title: "B2B Accountmanager Werkgevers & Detachering",
    domain: "Werk & Arbeidsmarkt (Djobba.nl)",
    partnerBrand: "Djobba",
    category: "work",
    rewardShort: "Plaatsingsfee + marge per gewerkt uur",
    rewardFull: "Prestatiebeloning: Aantrekkelijke plaatsingsfee per gematchte nieuwkomer bij Nederlandse werkgevers, plus doorlopende margedeling bij detacherings- en uitzendcontracten (percentage in overleg).",
    hours: "24–40 uur per week",
    location: "100% remote (optioneel bezoeken van werkgevers)",
    experience: "2+ jaar B2B sales, werving & selectie of arbeidsbemiddeling",
    description:
      "Als Accountmanager Werkgevers bouw je de brug tussen gemotiveerde internationale talenten van Immigratiepunt en Nederlandse werkgevers die kampen met personeelstekorten. Je sluit wervings- en detacheringscontracten via ons partnerplatform Djobba.nl.",
    tasks: [
      "Acquireren van Nederlandse werkgevers in sectoren als logistiek, techniek, horeca, IT en administratie",
      "Koppelen van vooraf gescreende nieuwkomers met een geldig BSN en werkstatus aan vacatures",
      "Onderhandelen over uurtarieven, bemiddelingsfees en contractvoorwaarden",
      "Samenwerken met ons kandidaat-intaketeam voor een soepele onboarding op de werkvloer",
    ],
    profile: [
      "HBO-werk- en denkniveau, met een commerciële of recruitmentachtergrond",
      "Aantoonbaar netwerk bij Nederlandse MKB-bedrijven of uitzendorganisaties",
      "Uitstekende beheersing van het Nederlands; Engels is een sterke pré",
      "Zelfsturend, communicatief sterk en gedreven door resultaat en maatschappelijke impact",
    ],
  },
  {
    id: "02",
    title: "Relocatie- & Huisvestingsmakelaar",
    domain: "Wonen & Vastgoed (WoningVry.nl)",
    partnerBrand: "WoningVry",
    category: "housing",
    rewardShort: "Vaste courtage per huurovereenkomst",
    rewardFull: "No Cure, No Pay: Vaste bemiddelingscourtage per gesloten huurovereenkomst of succesvol toegewezen kamer/appartement via WoningVry.nl.",
    hours: "20–40 uur per week (flexibel in te delen)",
    location: "100% remote (met optionele bezichtigingen)",
    experience: "1+ jaar ervaring in vastgoedbemiddeling, verhuur of expat relocation",
    description:
      "Vind veilige, legale en betaalbare woonruimte voor nieuwkomers en expats in Nederland. Je onderhoudt contacten met particuliere verhuurders, vastgoedbeheerders en woningcorporaties en beschermt huurders tegen malafide verhuurders.",
    tasks: [
      "Werven van betrouwbare verhuurders en woningaanbieders in heel Nederland",
      "Matchen van gescreende huurders (met BSN en inkomen) aan beschikbare woonruimtes",
      "Controleren van huurovereenkomsten op juridische geldigheid en gemeentelijke inschrijfbaarheid",
      "Begeleiden van het sleuteloverdracht- en borgproces via WoningVry.nl",
    ],
    profile: [
      "Ervaring met de Nederlandse huurmarkt, puntensysteem en huurbeschermingsregels",
      "Sterk netwerk van vastgoedeigenaren, makelaars of woningbeheerders",
      "Empathisch, betrouwbaar en alert op huurdersbescherming tegen oplichting",
      "Goede beheersing van het Nederlands en Engels",
    ],
  },
  {
    id: "03",
    title: "Subsidie- & Fondsenadviseur Immigranten",
    domain: "Sociale Zekerheid & Fondsen (Potjes Radar)",
    category: "subsidies",
    rewardShort: "Succespercentage over toegekende potjes",
    rewardFull: "100% No Cure, No Pay: Succespercentage over toegekende subsidies, legesvrijstellingen, WBSO-aanvragen en gemeentelijke voorzieningen.",
    hours: "20–32 uur per week",
    location: "100% remote",
    experience: "2+ jaar ervaring als subsidieadviseur, bewindvoerder of sociaal raadsvrouw/man",
    description:
      "Help nieuwkomers en werkgevers optimaal gebruik te maken van de beschikbare overheidspotjes: van Stichting Leergeld en DUO-inburgeringsleningen tot IDW-diplomawaardering en IND-legeskwijtschelding.",
    tasks: [
      "In kaart brengen van subsidieregelingen op gemeentelijk, provinciaal en landelijk niveau",
      "Samenstellen en indienen van complete aanvraagdossiers namens nieuwkomers en gezinnen",
      "Benutten van regelingen voor werkgevers die statushouders en kennismigranten aannemen",
      "Monitoren van toekenningen en afhandelen van communicatie met uitvoeringsorganisaties",
    ],
    profile: [
      "Diepgaande kennis van de Nederlandse sociale zekerheid, Participatiewet en toeslagen",
      "Nauwkeurig in dossieropbouw, formulieren en termijnbewaking",
      "Klantgericht, integer en vastberaden om het maximale uit voorzieningen te halen",
      "HBO-niveau in sociaal-juridische dienstverlening, bestuurskunde of rechten",
    ],
  },
  {
    id: "04",
    title: "Community Recruiter Postadres-Helpers",
    domain: "Vrijwilligers & Briefadressen Netwerk",
    category: "helpers",
    rewardShort: "Vaste bonus per geactiveerde helper",
    rewardFull: "Prestatiebonus: Vaste vergoeding per getoetste, goedgekeurde en actieve postadres-helper die succesvol gekoppeld wordt aan een nieuwkomer in de database.",
    hours: "16–32 uur per week (flexibel)",
    location: "100% remote",
    experience: "Ervaring in community building, werving, HR of vrijwilligerscoördinatie",
    description:
      "Het hart van Immigratiepunt is ons netwerk van betrouwbare Nederlandse burgers die hun briefadres openstellen voor officiële post. Jij werft, toetst en begeleidt nieuwe helpers in grote steden en regio's.",
    tasks: [
      "Werven van nieuwe postadres-helpers via online campagnes, wijknetwerken en maatschappelijke initiatieven",
      "Voeren van verificatiegesprekken en controleren van adres- en woonsituatie",
      "Uitleggen van het veilige juridische kader (briefadres vs. hoofdbewoning, geen belastingrisico)",
      "Begeleiden van helpers bij het gebruik van het portaal en de uitbetaling van brievenvergoedingen",
    ],
    profile: [
      "Warme, betrouwbare communicator die vertrouwen wekt bij Nederlandse burgers",
      "Kennis van gemeentelijke regelgeving rondom het briefadres (BRP)",
      "Proactief in online werving via buurtfora, vrijwilligersplatforms en sociale media",
      "Hart voor de missie van Immigratiepunt",
    ],
  },
  {
    id: "05",
    title: "Zakelijke Urgentie Consultant (Expats & Werkgevers)",
    domain: "Zakelijke Spoedtrajecten",
    category: "corporate",
    rewardShort: "15–25% commissie op urgentie-pakketten",
    rewardFull: "Directe provisie: 15% tot 25% van de contractwaarde op elk gecontracteerd Zakelijke Urgentie abonnement (€ 500 – € 1.500 / maand) voor de versnelde integratie van medewerkers.",
    hours: "24–40 uur per week",
    location: "100% remote",
    experience: "3+ jaar ervaring in B2B consultatieve verkoop, HR consultancy of corporate mobility",
    description:
      "Internationale bedrijven, uitzenders en detacheerders hebben vaak spoed bij het regelen van BSN, bankrekening en inschrijving voor hun buitenlandse professionals. Jij sluit Zakelijke Urgentie-abonnementen af waarbij wij alle rompslomp uithanden nemen.",
    tasks: [
      "Benaderen van HR-directeuren, mobiliteitsmanagers en uitzendbureaus met internationale krachten",
      "Presenteren van onze Zakelijke Urgentie Regeling (snelle BSN-afspraak, bank binnen 48u, brieven & bellen)",
      "Afsluiten van maandelijkse en jaarlijkse corporate service level agreements (SLA's)",
      "Zorgen voor een vlekkeloze overdracht naar de operationele dossierbeheerders",
    ],
    profile: [
      "Bewezen trackrecord in B2B consultative selling richting HR of directieniveau",
      "Commerciële drive gecombineerd met een servicegerichte, ontzorgende instelling",
      "Vloeiend in Nederlands en Engels; extra talenkennis is een plus",
      "Affiniteit met expat relocation, kennismigranten en wet- en regelgeving",
    ],
  },
  {
    id: "06",
    title: "Juridisch Consulent Immigratie & IND",
    domain: "Juridische Ondersteuning & Bezwaar",
    category: "legal",
    rewardShort: "Dossiervergoeding per afgeronde zaak",
    rewardFull: "Vergoeding per dossier: Vaste case-fee per succesvol ingediend bezwaarschrift, toegekende legesvrijstelling of afgeronde aanvraag gesubsidieerde rechtsbijstand (RvR).",
    hours: "16–32 uur per week",
    location: "100% remote",
    experience: "Afgeronde WO/HBO Rechtenstudie met specialisatie in Vreemdelingenrecht of Bestuursrecht",
    description:
      "Complexe dossiers rond verblijfsvergunningen, legeskosten, BRP-weigeringen en toevoegingen vereisen scherpe juridische kennis. Jij biedt gespecialiseerde ondersteuning op no cure no pay basis.",
    tasks: [
      "Beoordelen van IND-besluiten, afwijzingen van gemeentelijke inschrijvingen en legesfacturen",
      "Opstellen van formele bezwaarschriften, zienswijzen en kwijtscheldingsverzoeken",
      "Samenwerken met aangesloten advocatenkantoren en Het Juridisch Loket voor toevoegingen",
      "Adviseren van het Immigratiepunt-team bij complexe casuïstiek rondom verblijfsrechten",
    ],
    profile: [
      "Juridische opleiding (HBO Sociaal-Juridisch of WO Rechten)",
      "Aantoonbare ervaring met de Vreemdelingenwet 2000 en de Wet BRP",
      "Vlijmscherp in schriftelijke argumentatie en termijnbewaking",
      "Grote maatschappelijke betrokkenheid bij de rechtspositie van nieuwkomers",
    ],
  },
];

export const GENERAL_CONDITIONS = [
  {
    title: "Eerlijke No Cure, No Pay Beloning",
    desc: "Aantrekkelijke provisies, plaatsingsfees en succespercentages gekoppeld aan daadwerkelijk gesloten matches, verhuren of toegekende subsidies.",
    icon: BadgePercent,
  },
  {
    title: "100% Remote & Flexibel",
    desc: "Werk volledig vanuit huis of onderweg, met flexibele indeling van je uren (van 16 tot 40 uur per week) afgestemd op jouw agenda.",
    icon: Globe2,
  },
  {
    title: "Echte Maatschappelijke Impact",
    desc: "Geen holle KPI's: elke succesvolle bemiddeling helpt een nieuwkomer direct aan een veilig adres, een vaste baan of financiële zekerheid.",
    icon: HeartHandshake,
  },
  {
    title: "Hardware & Onkostenvergoeding",
    desc: "Laptop en smartphone in bruikleen voor zakelijk gebruik, gecombineerd met een maandelijkse vergoeding voor thuiswerkkosten.",
    icon: Laptop,
  },
  {
    title: "Sterke Partner Ecosystemen",
    desc: "Directe toegang tot onze gerenommeerde partners: Djobba.nl voor werkgevers, WoningVry.nl voor huisvesting en Xabi World voor bankzaken.",
    icon: Building2,
  },
  {
    title: "Dossier- & Juridische Kennisbank",
    desc: "Uitgebreide interne training over de BRP, Participatiewet, IND-richtlijnen en gemeentelijke briefadresprocedures.",
    icon: GraduationCap,
  },
  {
    title: "27 Vakantiedagen",
    desc: "Ruime verlofregeling op fulltime basis, inclusief de optie tot bijkopen of sparen voor een langere reis of sabbatical.",
    icon: Calendar,
  },
  {
    title: "HBO/WO-niveau of Werkervaring",
    desc: "We hechten vooral waarde aan zelfredzaamheid, integriteit, mensenkennis en een bewezen trackrecord in bemiddeling.",
    icon: Award,
  },
];

export default function Vacatures() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "matrix">("cards");
  const [activeJobModal, setActiveJobModal] = useState<JobPosition | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPosition | null>(null);

  // Application form fields
  const [formFullName, setFormFullName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLinkedin, setFormLinkedin] = useState("");
  const [formHours, setFormHours] = useState("24–32 uur per week");
  const [formMotivation, setFormMotivation] = useState("");
  const [formTrackrecord, setFormTrackrecord] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter positions
  const filteredJobs = useMemo(() => {
    return VACATURES_DATA.filter((job) => {
      const matchesCategory =
        selectedCategory === "all" || job.category === selectedCategory;
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.rewardShort.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.includes(searchTerm) ||
        job.tasks.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const openApplyForJob = (job: JobPosition) => {
    setSelectedJobForApply(job);
    setFormSubmitted(false);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName || !formEmail || !selectedJobForApply) {
      toast({
        title: "Vul de verplichte velden in",
        description: "Naam, e-mail en vacature zijn vereist om je sollicitatie te versturen.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      submitJobApplication({
        jobId: selectedJobForApply.id,
        jobTitle: selectedJobForApply.title,
        fullName: formFullName,
        email: formEmail,
        phone: formPhone,
        linkedinUrl: formLinkedin,
        hoursPerWeek: formHours,
        motivation: formMotivation,
        trackrecord: formTrackrecord,
      });

      setIsSubmitting(false);
      setFormSubmitted(true);
      toast({
        title: "Sollicitatie succesvol ontvangen!",
        description: `Dank voor je sollicitatie voor [${selectedJobForApply.id}] ${selectedJobForApply.title}. Ons team neemt spoedig contact op.`,
      });
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Er is een fout opgetreden",
        description: "Je kunt je CV ook direct mailen naar info@immigratiepunt.nl.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>No Cure, No Pay Vacatures | Werken bij Immigratiepunt</title>
        <meta
          name="description"
          content="Bekijk onze 100% remote vacatures op no cure no pay basis rondom werk (Djobba), huisvesting (WoningVry), subsidies, helpers en zakelijke integratie."
        />
      </Helmet>

      <div className="bg-[#faf9f5] min-h-screen text-[#141413]">
        {/* ============================================================== */}
        {/* 1. HERO HEADER                                                 */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden border-b border-[#e6dfd8] bg-linear-to-b from-white via-[#faf9f5] to-[#f4eee6] py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(#c36a4f_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                100% No Cure, No Pay & Prestatiegedreven
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                <Globe2 className="h-3.5 w-3.5 text-amber-700" />
                100% Remote Werken
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0eae1] px-3.5 py-1 text-xs font-semibold text-[#6c6a64] border border-[#e6dfd8]">
                <HeartHandshake className="h-3.5 w-3.5 text-[#6c6a64]" />
                Maatschappelijke Impact & Reëel Verdienmodel
              </span>
            </div>

            {/* Hero Title */}
            <div className="max-w-4xl">
              <div className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-2">
                Carrières bij Immigratiepunt & Partner-Ecosysteem
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#141413] leading-tight">
                Bouw mee aan integratie met <span className="text-primary underline decoration-primary/30 decoration-wavy">No Cure, No Pay</span> rollen
              </h1>
              <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-[#6c6a64] leading-relaxed">
                Wil je maximale vrijheid, flexibele uren en royale vergoedingen combineren met echte maatschappelijke betekenis?
                Wij werven zelfstandige professionals die immigranten helpen met werk (Djobba), veilige huisvesting (WoningVry), subsidies, postadressen en zakelijke spoedtrajecten.
                Geen loze KPI&apos;s, maar eerlijke beloningen per geslaagde plaatsing, huurcontract of toegekend potje.
              </p>
            </div>

            {/* CTA Buttons & Stats */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#posities"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Bekijk de 6 Functies</span>
                <ChevronDown className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedJobForApply(VACATURES_DATA[0]);
                  setApplyModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d8d2c9] bg-white px-5 py-3 text-sm font-semibold text-[#141413] shadow-xs hover:bg-[#faf9f5] transition-colors"
              >
                <Send className="h-4 w-4 text-primary" />
                <span>Direct Solliciteren</span>
              </button>

              <a
                href="#voorwaarden"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#6c6a64] hover:text-[#141413] px-3 py-2 transition-colors"
              >
                <span>Bekijk Faciliteiten</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#e6dfd8] pt-6 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-[#141413]">6</div>
                <div className="text-xs text-[#6c6a64]">Reële no cure, no pay functies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">100%</div>
                <div className="text-xs text-[#6c6a64]">Remote (thuiswerkvergoeding + laptop)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">Direct</div>
                <div className="text-xs text-[#6c6a64]">Gekoppeld aan Djobba, WoningVry & Fondsen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">Geen Plafond</div>
                <div className="text-xs text-[#6c6a64]">Op plaatsingsfees, courtages & bonussen</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. ARBEIDSVOORWAARDEN (GELDEN VOOR ALLE FUNCTIES)              */}
        {/* ============================================================== */}
        <section id="voorwaarden" className="py-14 md:py-20 border-b border-[#e6dfd8] bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="inline-block rounded-full bg-[#f0eae1] px-3 py-1 text-xs font-semibold text-[#6c6a64] uppercase tracking-wider mb-2">
                Uniforme Faciliteiten
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                Arbeidsvoorwaarden & Faciliteiten
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6c6a64]">
                Heldere, professionele faciliteiten die uniform gelden voor al onze bemiddelaars, adviseurs en recruiters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GENERAL_CONDITIONS.map((cond, idx) => {
                const Icon = cond.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-5 transition-all hover:border-primary/40 hover:shadow-xs hover:bg-white"
                  >
                    <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e6dfd8] text-primary shadow-2xs group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-[#141413] mb-1.5">{cond.title}</h3>
                    <p className="text-xs text-[#6c6a64] leading-relaxed">{cond.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Note on compensation structure */}
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 text-xs text-emerald-950 flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-200 text-emerald-900 font-bold">
                ✓
              </div>
              <div>
                <strong className="font-semibold text-emerald-900">Heldere, Eerlijke Geldstromen:</strong> Jouw verdiensten komen voort uit reële markttransacties: Nederlandse werkgevers die betalen voor gematcht personeel (Djobba), verhuurders die een courtage vergoeden (WoningVry), bedrijven die zakelijke urgentie afnemen, of overheidsfondsen waarbij een succesvergoeding geldt. Je werkt met opgeheven hoofd aan echte oplossingen.
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. DE 6 LOGISCHE IMMIGRATIEPUNT POSITIES                       */}
        {/* ============================================================== */}
        <section id="posities" className="py-14 md:py-20 border-b border-[#e6dfd8]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                  6 Doelgerichte Rollen
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                  Actuele No Cure, No Pay Vacatures
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#6c6a64]">
                  Kies jouw specialisme: werkgeversbemiddeling, huisvesting, subsidies, helpers werven, zakelijke spoed of juridisch.
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-2 rounded-xl border border-[#e6dfd8] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === "cards"
                      ? "bg-primary text-white"
                      : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Kaarten</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("matrix")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === "matrix"
                      ? "bg-primary text-white"
                      : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Matrix Tabel</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: `Alle Rollen (${VACATURES_DATA.length})` },
                  { id: "work", label: "Werk (Djobba)" },
                  { id: "housing", label: "Wonen (WoningVry)" },
                  { id: "subsidies", label: "Subsidies & Potjes" },
                  { id: "helpers", label: "Briefadres Helpers" },
                  { id: "corporate", label: "Zakelijke Urgentie" },
                  { id: "legal", label: "Juridisch & IND" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border ${
                      selectedCategory === cat.id
                        ? "bg-[#141413] text-white border-[#141413]"
                        : "bg-white text-[#6c6a64] border-[#e6dfd8] hover:border-[#141413]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c6a64]" />
                <input
                  type="text"
                  placeholder="Zoek rol, Djobba, WoningVry, subsidie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[#e6dfd8] bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6c6a64] hover:text-[#141413]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* CARDS VIEW */}
            {viewMode === "cards" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-[#f0eae1] pb-3 mb-3">
                        <span className="font-mono text-xs font-bold text-primary">
                          [{job.id}/06]
                        </span>
                        <span className="rounded-full bg-[#f0eae1] px-2.5 py-0.5 text-[10px] font-semibold text-[#3d3d3a]">
                          {job.domain}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#141413] leading-snug">
                        {job.title}
                      </h3>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[#6c6a64]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {job.hours}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe2 className="h-3 w-3 text-emerald-600" /> 100% remote
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-[#6c6a64] line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Reward Badge */}
                      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
                        <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <BadgePercent className="h-3.5 w-3.5" /> No Cure, No Pay Beloning
                        </div>
                        <div className="font-semibold mt-1 text-[11px] leading-snug">{job.rewardShort}</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#f0eae1] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveJobModal(job)}
                        className="text-xs font-semibold text-[#6c6a64] hover:text-[#141413] underline underline-offset-4"
                      >
                        Lees alle taken & profiel
                      </button>

                      <button
                        type="button"
                        onClick={() => openApplyForJob(job)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                      >
                        <span>Solliciteer</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MATRIX TABLE VIEW */}
            {viewMode === "matrix" && (
              <div className="overflow-hidden rounded-2xl border border-[#e6dfd8] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f4ee] border-b border-[#e6dfd8] text-[#6c6a64] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4 w-14">ID</th>
                        <th className="py-3 px-4">Functie</th>
                        <th className="py-3 px-4">Domein & Pijler</th>
                        <th className="py-3 px-4">No Cure, No Pay Beloning</th>
                        <th className="py-3 px-4 w-28">Uren</th>
                        <th className="py-3 px-4 text-right w-40">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ece6de]">
                      {filteredJobs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[#6c6a64]">
                            Geen vacatures gevonden voor &quot;{searchTerm}&quot;. Pas je zoekfilter aan.
                          </td>
                        </tr>
                      ) : (
                        filteredJobs.map((job) => (
                          <tr
                            key={job.id}
                            className="hover:bg-[#faf9f5] transition-colors group"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-primary">
                              {job.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#141413] text-sm group-hover:text-primary transition-colors">
                                {job.title}
                              </div>
                              <div className="text-[11px] text-[#6c6a64] sm:hidden mt-0.5">
                                {job.domain}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 hidden sm:table-cell">
                              <span className="inline-block rounded-md bg-[#f0eae1] px-2 py-0.5 text-[11px] font-medium text-[#3d3d3a]">
                                {job.domain}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                                <BadgePercent className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{job.rewardShort}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#6c6a64] text-[11px] whitespace-nowrap">
                              {job.hours}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setActiveJobModal(job)}
                                  className="inline-flex h-8 items-center rounded-lg border border-[#e6dfd8] bg-white px-2.5 text-xs font-semibold text-[#141413] hover:bg-[#faf9f5]"
                                  title="Bekijk alle details en taken"
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openApplyForJob(job)}
                                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                                >
                                  <span>Solliciteer</span>
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. SOLLICITATIEPROCEDURE (4 STAPPEN)                           */}
        {/* ============================================================== */}
        <section className="py-14 md:py-20 bg-white border-b border-[#e6dfd8]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <span className="inline-block rounded-full bg-[#f0eae1] px-3 py-1 text-xs font-semibold text-[#6c6a64] uppercase tracking-wider mb-2">
                Eenvoudig & Snel
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                Het Sollicitatieproces in 4 Stappen
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6c6a64]">
                Van kennismaking tot start binnen gemiddeld 5 werkdagen.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Aanmelding & CV",
                  desc: "Meld je aan via het formulier met je CV, LinkedIn-profiel en jouw gewenste rol (01 t/m 06).",
                },
                {
                  step: "02",
                  title: "Kennismaking (30 min)",
                  desc: "Kort online videogesprek over je ervaring, affiniteit met de doelgroep en de commissieafspraken.",
                },
                {
                  step: "03",
                  title: "Toegang & Briefing",
                  desc: "Overeenkomst, verzending van eventuele apparatuur en directe onboarding in onze systemen en partnerkanalen.",
                },
                {
                  step: "04",
                  title: "Start & Begeleiding",
                  desc: "100% remote van start met directe ondersteuning vanuit het kernteam van Immigratiepunt bij je eerste matches.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-2xs"
                >
                  <div className="font-mono text-2xl font-bold text-primary/40 mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-[#141413] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#6c6a64] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick Contact Box */}
            <div className="mt-12 rounded-2xl border border-[#e6dfd8] bg-linear-to-r from-[#faf9f5] to-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg text-[#141413]">Vragen over een functie of beloningsstructuur?</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6c6a64]">
                  Neem rechtstreeks contact op met ons team via <a href="mailto:info@immigratiepunt.nl" className="font-semibold text-primary underline">info@immigratiepunt.nl</a>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedJobForApply(VACATURES_DATA[0]);
                  setApplyModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Open Sollicitatieformulier</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* JOB DETAILS MODAL                                              */}
        {/* ============================================================== */}
        <Dialog open={!!activeJobModal} onOpenChange={(open) => !open && setActiveJobModal(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl">
            {activeJobModal && (
              <>
                <DialogHeader className="border-b border-[#f0eae1] pb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      VACATURE [{activeJobModal.id}/06]
                    </span>
                    <Badge variant="outline" className="bg-[#f0eae1] text-[#3d3d3a] border-[#e6dfd8]">
                      {activeJobModal.domain}
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl font-bold text-[#141413]">
                    {activeJobModal.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#6c6a64] mt-1">
                    Locatie: {activeJobModal.location} • Uren: {activeJobModal.hours} • Ervaring: {activeJobModal.experience}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4 text-xs">
                  {/* Over de rol */}
                  <div>
                    <h4 className="font-bold text-sm text-[#141413] mb-1.5">Over de Rol</h4>
                    <p className="text-[#3d3d3a] leading-relaxed">{activeJobModal.description}</p>
                  </div>

                  {/* Taken */}
                  <div>
                    <h4 className="font-bold text-sm text-[#141413] mb-2">Verantwoordelijkheden & Taken</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-[#3d3d3a]">
                      {activeJobModal.tasks.map((task, i) => (
                        <li key={i} className="leading-relaxed">{task}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Profiel */}
                  <div>
                    <h4 className="font-bold text-sm text-[#141413] mb-2">Gevraagd Profiel</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-[#3d3d3a]">
                      {activeJobModal.profile.map((item, i) => (
                        <li key={i} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Beloning Box */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <div className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
                      <BadgePercent className="h-4 w-4 text-emerald-700" />
                      No Cure, No Pay Beloningsstructuur
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                      {activeJobModal.rewardFull}
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-2">
                      + Uniforme faciliteiten: 27 vakantiedagen, apparatuur in bruikleen, thuiswerkvergoeding en toegang tot de juridische dossier-kennisbank.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#f0eae1] pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveJobModal(null)}
                    className="text-xs font-semibold text-[#6c6a64] hover:text-[#141413]"
                  >
                    Sluiten
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const job = activeJobModal;
                      setActiveJobModal(null);
                      openApplyForJob(job);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-[#a9583e]"
                  >
                    <span>Solliciteer op deze Rol</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ============================================================== */}
        {/* APPLICATION FORM MODAL                                         */}
        {/* ============================================================== */}
        <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl">
            <DialogHeader className="border-b border-[#f0eae1] pb-3">
              <span className="font-mono text-xs font-bold text-primary">
                SOLLICITATIE [100% REMOTE & NO CURE, NO PAY]
              </span>
              <DialogTitle className="text-xl font-bold text-[#141413]">
                Solliciteer Direct
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6c6a64]">
                Stuur je gegevens en trackrecord in. Binnen 2 werkdagen nemen we contact op voor een kennismaking.
              </DialogDescription>
            </DialogHeader>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-[#141413]">
                  Sollicitatie Ontvangen!
                </h3>
                <p className="text-xs text-[#6c6a64] max-w-sm mx-auto leading-relaxed">
                  Bedankt voor je reactie op de rol van <strong>{selectedJobForApply?.title}</strong>. We beoordelen je profiel en sturen binnen 48 uur een uitnodiging voor een 30 minuten online kennismakingsgesprek.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setApplyModalOpen(false)}
                    className="bg-primary text-white hover:bg-[#a9583e]"
                  >
                    Sluit Venster
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 py-2 text-xs">
                {/* Select Job */}
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">
                    Selecteer Functie *
                  </label>
                  <select
                    value={selectedJobForApply?.id || "01"}
                    onChange={(e) => {
                      const found = VACATURES_DATA.find((j) => j.id === e.target.value);
                      if (found) setSelectedJobForApply(found);
                    }}
                    className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                  >
                    {VACATURES_DATA.map((job) => (
                      <option key={job.id} value={job.id}>
                        [{job.id}] {job.title} — {job.domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      Volledige Naam *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Alexander Jansen"
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alexander@voorbeeld.nl"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      placeholder="+31 6 12345678"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      LinkedIn Profiel URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/jouwnaam"
                      value={formLinkedin}
                      onChange={(e) => setFormLinkedin(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Hours per week */}
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">
                    Beschikbaarheid per week
                  </label>
                  <select
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="16–24 uur per week">16–24 uur per week (parttime)</option>
                    <option value="24–32 uur per week">24–32 uur per week</option>
                    <option value="36–40 uur per week">36–40 uur per week (fulltime)</option>
                    <option value="Flexibel / Projectbasis">Flexibel / Projectbasis (ZZP / Freelance)</option>
                  </select>
                </div>

                {/* Trackrecord */}
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">
                    Trackrecord & Relevante Ervaring
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Beschrijf beknopt jouw ervaring met arbeidsbemiddeling, verhuur, subsidies, vrijwilligerswerving of juridische dossiers..."
                    value={formTrackrecord}
                    onChange={(e) => setFormTrackrecord(e.target.value)}
                    className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                {/* Motivation / Remarks */}
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">
                    Korte Toelichting of Motivatie
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Waarom past deze rol en het no cure no pay / commissiemodel binnen Immigratiepunt bij jou?"
                    value={formMotivation}
                    onChange={(e) => setFormMotivation(e.target.value)}
                    className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#f0eae1]">
                  <div className="text-[11px] text-[#6c6a64]">
                    Vragen? Mail naar <span className="font-semibold text-[#141413]">info@immigratiepunt.nl</span>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white hover:bg-[#a9583e]"
                  >
                    {isSubmitting ? "Verzenden..." : "Verstuur Sollicitatie"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
