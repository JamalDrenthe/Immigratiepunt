import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
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
  ShieldCheck,
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
  category: "finance" | "growth" | "recruitment" | "strategy";
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
    title: "Investor Relations Manager",
    domain: "Corporate / Pre-IPO",
    category: "finance",
    rewardShort: "Salaris + succesfee (investering)",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Succesfee over elk door jou aangebracht en gecontracteerd investeringsvolume (percentage in overleg).",
    hours: "32–40 per week",
    location: "100% remote (reisbereidheid voor internationale roadshows)",
    experience: "5+ jaar corporate finance, private equity, venture capital of IR",
    description:
      "Ter voorbereiding op een internationale beursnotering en meerdere kapitaalrondes zoeken wij een IR Manager. Je bent het vaste aanspreekpunt richting de financiële markt en onderhoudt relaties met institutionele beleggers, family offices en strategische co-investeerders.",
    tasks: [
      "Werven en onboarden van institutionele investeerders en kapitaalverstrekkers",
      "Regisseren van de internationale IR-roadshow en het bookbuilding-proces",
      "Presenteren van groeimodellen, kwartaalcijfers en IFRS-rapportage aan investeringscomités",
      "Schakelen met corporate finance-adviseurs, toezichthouders, juristen en auditors",
    ],
    profile: [
      "HBO/WO in finance, economie of bedrijfskunde, of gelijkwaardige ervaring",
      "Aantoonbaar netwerk binnen institutioneel kapitaal, family offices en private equity",
      "Nederlands en Engels op boardroomniveau",
      "Ervaring met IFRS, kapitaalmarkttransacties en pre-IPO-trajecten",
    ],
  },
  {
    id: "02",
    title: "Campagnemanager (Growth & Crowdfunding)",
    domain: "Growth & crowdfunding",
    category: "growth",
    rewardShort: "Salaris + campagnevergoeding",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Vergoeding per succesvol geactiveerd B2B-lid en per voltooide financieringscampagne.",
    hours: "32–40 per week",
    location: "100% remote",
    experience: "3+ jaar growth marketing, B2B of crowdfunding",
    description:
      "Je bent verantwoordelijk voor de B2B-wervingscampagnes en co-financieringstrajecten voor nieuwe hardware- en vastgoedprojecten. Je bouwt datagedreven funnels die op Europese schaal converteren.",
    tasks: [
      "Ontwerpen, lanceren en optimaliseren van crowdfunding- en ledenwervingscampagnes",
      "Uitrollen van multi-channel campagnes (LinkedIn, Meta, Google, programmatic, e-mail) voor Europese wervingshubs",
      "Continueren van A/B-tests op landingspagina's, advertenties en onboarding-flows",
      "Monitoren van campagnedata, acquisitiekosten (CAC) en funnelconversie",
    ],
    profile: [
      "HBO/WO in marketing, communicatie of data-analyse, of gelijkwaardige ervaring",
      "Minimaal 3 jaar ervaring met B2B performance marketing, leadgeneratie of grootschalige crowdfundingcampagnes",
      "Sterk in zowel copywriting als data-analyse",
      "Ondernemend en resultaatgericht",
    ],
  },
  {
    id: "03",
    title: "Sponsor- & Partnership Manager",
    domain: "Media, tech, events",
    category: "growth",
    rewardShort: "Salaris + dealvergoeding",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Dealvergoeding: percentage van elke gecontracteerde sponsor- of partnership-deal (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "3+ jaar B2B-partnerships, media of sponsoring",
    description:
      "Je sluit commerciële samenwerkingen, sponsorcontracten en strategische allianties voor de media-, compute- en community-platforms van de groep.",
    tasks: [
      "Binnenhalen van B2B-sponsors, adverteerders en mediapartners voor evenementen, platforms en hubs",
      "Initiëren van samenwerkingen met hardwareleveranciers, vastgoedpartijen en softwarelicentiepartners",
      "Ontwikkelen van sponsorpakketten en joint-venture-voorstellen",
      "Voeren van onderhandelingen van eerste pitch tot getekend contract",
    ],
    profile: [
      "HBO/WO, of vergelijkbare werkervaring",
      "Ervaring in B2B-sales, sponsorwerving, media-exploitatie of strategic partnerships",
      "Commercieel sterk, representatief en zelfsturend",
    ],
  },
  {
    id: "04",
    title: "Executive Search Consultant",
    domain: "Boardroom & C-level",
    category: "recruitment",
    rewardShort: "Salaris + plaatsingsfee (C-level)",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Plaatsingsfee per geplaatste executive, gebaseerd op bruto jaarsalaris of contractwaarde (in overleg).",
    hours: "32–40 per week",
    location: "100% remote",
    experience: "5+ jaar executive search of boardroom consulting",
    description:
      "Je werft boardroomposities voor de eigen holdings en voor opdrachtgevers van de B2B recruitment-marketplace. Je opereert op strategisch niveau en bent verantwoordelijk voor het vinden en binden van bestuurders en toezichthouders.",
    tasks: [
      "Werven van statutaire directieleden, non-executive directors (RvC) en country managers",
      "Plaatsen van C-level executives (CIO, CTO, Chief AI Officer, VP Engineering) bij externe opdrachtgevers",
      "Begeleiden van het volledige search-, selectie- en benoemingsproces op boardroomniveau",
    ],
    profile: [
      "HBO/WO, of gedegen praktijkervaring",
      "Minimaal 5 jaar ervaring bij een executive search-bureau of als senior headhunter voor C-level posities",
      "Gesprekspartner voor CEO's, commissarissen en investeringsmaatschappijen",
      "Nederlands en Engels vloeiend",
    ],
  },
  {
    id: "05",
    title: "360° Recruiter (IT & Tech-Detachering)",
    domain: "IT-detachering",
    category: "recruitment",
    rewardShort: "Salaris + margedeling",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Margedeling over gerealiseerde detacheringsomzet (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "2+ jaar 360°-recruitment of IT-detachering",
    description:
      "Je beheert zowel de klantkant (IT-detacheringsopdrachten) als de kandidatenkant (selectie en plaatsing van internationale specialisten die via de eigen relocatie-tak instromen).",
    tasks: [
      "Binnenhalen van B2B IT-detacheringscontracten en aanvragen",
      "Matchen van vooraf geverifieerde kennismigranten en IT-professionals aan jouw klantportefeuille",
      "Voeren van tariefonderhandelingen, begeleiden van sollicitatiegesprekken en afsluiten van contracten via het recruitment-systeem",
    ],
    profile: [
      "HBO/WO, of vergelijkbare ervaring",
      "Ervaring als 360°-recruiter, accountmanager of consultant in IT-, engineering- of tech-detachering",
      "Commercieel gedreven, proactief en relatiegericht",
      "Ervaring met moderne recruitmentsoftware en matchingtools",
    ],
  },
  {
    id: "06",
    title: "Tech Headhunter (Global AI & Engineering)",
    domain: "AI & engineering",
    category: "recruitment",
    rewardShort: "Salaris + succesfee (tech-specialist)",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Succesfee per geplaatste en geverifieerde tech-specialist (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "Aantoonbare ervaring in tech-sourcing of direct search",
    description:
      "Je spoort wereldwijd AI-engineers, systeemarchitecten en senior developers op voor externe B2B-klanten en de eigen R&D-, AI- en hardware-afdelingen. Voor geplaatste kandidaten regelt de groep ook visum en huisvesting.",
    tasks: [
      "Actief sourcen via GitHub, LinkedIn Recruiter, StackOverflow en eigen sourcing-tools",
      "Overtuigen van internationaal talent met het totaalpakket: baan, visum, relocatie en huisvesting",
      "Begeleiden van kandidaten door technische assessments tot contractondertekening",
    ],
    profile: [
      "HBO/WO, of vergelijkbare praktijkervaring",
      "Ervaring met het sourcen van schaarse developers en engineers",
      "Bekend met Python, Rust, Kubernetes en LLM-architecturen",
      "Vloeiend Engels, comfortabel met kandidaten in verschillende tijdzones",
    ],
  },
  {
    id: "07",
    title: "High-Ticket Closer (B2B-Proposities)",
    domain: "B2B-conversie",
    category: "growth",
    rewardShort: "Salaris + commissie per transactie",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Commissie per gecontracteerde B2B-transactie (percentage in overleg).",
    hours: "24–40 per week (flexibele agenda)",
    location: "100% remote",
    experience: "Aantoonbaar trackrecord in high-ticket closing",
    description:
      "Je voert de eindgesprekken met warme, voorgekwalificeerde zakelijke leads en sluit de deals voor de gecombineerde proposities (compute, digitale infrastructuur, zakelijk vastgoed). Koude acquisitie is geen onderdeel van de functie.",
    tasks: [
      "Voeren van consultatieve videocalls en telefoongesprekken met zakelijke beslissers",
      "Toelichten van de modulaire B2B-pakketten en het rendement van het ecosysteem",
      "Zorgen dat overeenkomsten tijdens of direct na het gesprek digitaal worden ondertekend",
      "Afstemmen met marketing en sales over leadkwaliteit",
    ],
    profile: [
      "HBO/WO, of gelijkwaardige saleservaring",
      "Trackrecord in consultative selling en high-ticket closing (bij voorkeur B2B SaaS, finance, vastgoed of consultancy)",
      "Sterk in actief luisteren, bezwaren behandelen en vertrouwen opbouwen",
      "Resultaatgericht en gedisciplineerd",
    ],
  },
  {
    id: "08",
    title: "Commercieel Agent (Compute, Cloud & Housing)",
    domain: "Compute & huisvesting",
    category: "growth",
    rewardShort: "Salaris + doorlopende courtage",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Provisie per afgesloten B2B-transactie én doorlopende courtage over contractverlengingen van jouw portefeuille (in overleg).",
    hours: "Flexibel, 24–40 per week",
    location: "100% remote (eigen regio-indeling mogelijk)",
    experience: "Zelfstandige B2B-sales of agentuurervaring",
    description:
      "Je vertegenwoordigt de commerciële eindproducten van de operationele clusters in de zakelijke markt: GPU-rekenkracht, zakelijke account-infrastructuur en short-/long-stay huisvesting voor expats en projectteams.",
    tasks: [
      "Verkopen van GPU-servers en digitale infrastructuur aan AI-bedrijven, mediabureaus en tech-ondernemingen",
      "Bemiddelen in B2B-huisvestingscontracten voor bedrijven die internationale specialisten huisvesten",
      "Opbouwen en beheren van een eigen klantenkring met meerjarige afnamecontracten",
    ],
    profile: [
      "HBO/WO, of gedegen commerciële achtergrond",
      "Sterk zakelijk netwerk in tech, media of corporate vastgoed",
      "Zelfstandig, plant eigen agenda, bouwt graag aan terugkerende omzet",
    ],
  },
  {
    id: "09",
    title: "B2B Sales Representative (SaaS & Ecosysteem)",
    domain: "SaaS & ecosysteem",
    category: "growth",
    rewardShort: "Salaris + commissie & staffelbonus",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Commissie per gesloten B2B-deal, plus maandelijkse staffelbonus bij behalen van targets (in overleg).",
    hours: "32–40 per week",
    location: "100% remote",
    experience: "Junior / medior / senior",
    description:
      "Je vult de commerciële pijplijn: je vertegenwoordigt de B2B SaaS-software (CRM, AI-outreach, workflow-automatisering) en de bredere ecosysteem-proposities, opent deuren bij nieuwe zakelijke klanten en zet contacten om in verkoopkansen.",
    tasks: [
      "Uitvoeren van gepersonaliseerde outbound campagnes via telefoon, videomessaging, e-mail en LinkedIn",
      "Geven van online productdemo's aan MKB- en enterprise-bedrijven",
      "Kwalificeren van zakelijke partijen en beheren van de eigen salesfunnel in samenwerking met de closers",
    ],
    profile: [
      "HBO/WO, of sterke aantoonbare saleservaring",
      "Communicatief vaardig, bestand tegen afwijzing, energie van nieuwe contacten",
      "Affiniteit met B2B SaaS, AI-tools en moderne salesmethodieken",
    ],
  },
  {
    id: "10",
    title: "Senior Strategy Consultant (AI, Werkkapitaal & M&A)",
    domain: "AI, werkkapitaal, M&A",
    category: "strategy",
    rewardShort: "Salaris + projectfee / M&A-fee",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Projectfee over de contractwaarde van elk enterprise-implementatietraject of afgeronde M&A-transactie (in overleg).",
    hours: "32–40 per week",
    location: "100% remote",
    experience: "7+ jaar strategy consulting, M&A of enterprise IT",
    description:
      "Je adviseert op directie- en C-level over AI-automatisering, werkkapitaaloptimalisatie en het begeleiden van fusies, overnames en integraties binnen het ecosysteem.",
    tasks: [
      "Adviseren van middelgrote en grote ondernemingen over AI-executiemotoren, B2B clearing-API's en werkstroomautomatisering",
      "Identificeren, beoordelen (due diligence) en begeleiden van acquisities van tech-startups, softwarebedrijven en licentiepartners",
      "Opstellen van business cases op boardroomniveau",
    ],
    profile: [
      "WO-master in business, finance, economie of IT, of gelijkwaardig topniveau door ervaring",
      "Minimaal 7 jaar ervaring als strategy consultant, M&A-adviseur of enterprise transformation manager",
      "Diepgaand financieel inzicht (kasstroommodellen, waarderingen, WCO) en begrip van AI- en cloudarchitecturen",
    ],
  },
  {
    id: "11",
    title: "Subsidieconsultant (R&D, AI & Duurzaamheid)",
    domain: "R&D, AI, duurzaamheid",
    category: "strategy",
    rewardShort: "Salaris + succespercentage (100% No Cure)",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Succespercentage over elk daadwerkelijk toegekend subsidiebedrag of gerealiseerd fiscaal voordeel (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "3+ jaar als subsidieadviseur of grant writer",
    description:
      "Binnen het ecosysteem wordt geïnvesteerd in eigen R&D en duurzame fysieke infrastructuur. Je haalt nationale, Britse en Europese innovatiesubsidies, tech-grants en fiscale regelingen binnen op no cure no pay basis.",
    tasks: [
      "In kaart brengen van relevante regelingen (WBSO, MIT, Horizon Europe, UK Innovate, duurzaamheidsfondsen)",
      "Opstellen en indienen van technisch en financieel onderbouwde aanvragen in samenwerking met developers, AI-architecten en vastgoedmanagers",
      "Benutten van fiscale voordelen rond kennismigranten en Europese innovatiehubs",
      "Verzorgen van projectadministratie en eindverantwoording conform UK GAAP en IFRS",
    ],
    profile: [
      "HBO/WO, of vergelijkbare ervaring",
      "Aantoonbare ervaring als subsidieconsultant met sterk slagingspercentage, bij voorkeur op het snijvlak van IT, AI, innovatie en duurzaamheid",
      "Sterk in het vertalen van technische projecten naar beoordelingscriteria",
    ],
  },
  {
    id: "12",
    title: "Recruitment Consultant (International Talent)",
    domain: "Internationaal talent & relocatie",
    category: "recruitment",
    rewardShort: "Salaris + plaatsingsfee per kandidaat",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Plaatsingsfee per succesvolle, gecontracteerde B2B-plaatsing (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "1+ jaar recruitment of HR",
    description:
      "Je bent verantwoordelijk voor de kandidaatkant: je begeleidt gekwalificeerde kennismigranten door het verificatieproces en matcht hen aan openstaande B2B-vacatures op het platform.",
    tasks: [
      "Voeren van diepte-interviews en begeleiden van kandidaten door screening en verificatie",
      "Matchen van gevalideerde IT-, engineering- en tech-specialisten aan openstaande vacatures via het ATS",
      "Coördineren van de digitale overdracht na plaatsing, zodat zusterentiteiten visum, huisvesting en financiële onboarding in gang zetten",
    ],
    profile: [
      "HBO/WO, of vergelijkbare praktijkervaring",
      "Mensgericht en organisatorisch sterk",
      "Gestructureerd, vaardig met moderne HR-software",
      "Vloeiend Nederlands en Engels",
    ],
  },
  {
    id: "13",
    title: "Corporate Funding Broker (Asset-backed & Vastgoed)",
    domain: "Hardware & vastgoed",
    category: "finance",
    rewardShort: "Salaris + bemiddelingscourtage",
    rewardFull: "Salaris in overleg, afhankelijk van ervaring. Bemiddelingscourtage per afgesloten financieringslijn, hardware-lease of vastgoedhypotheek (in overleg).",
    hours: "24–40 per week",
    location: "100% remote",
    experience: "5+ jaar debt advisory, corporate finance of leasing",
    description:
      "Je structureert en bemiddelt zakelijke financieringen voor de uitbreiding van GPU-serverclusters, de vastgoedportefeuille en de interne factoring- en werkkapitaalfaciliteiten.",
    tasks: [
      "Ophalen en structureren van kredietlijnen, equipment lease-constructies en zakelijke vastgoedhypotheken",
      "Bemiddelen bij banken, private debt-fondsen en BaaS/EMI-partners voor factoring- en liquiditeitslijnen",
      "Presenteren van geconsolideerde cijfers (UK GAAP, IFRS) en onderpandstructuren aan kredietcomités",
    ],
    profile: [
      "HBO/WO, of gelijkwaardig vakmanschap",
      "Ervaring als zakelijk financieringsadviseur, debt broker, accountmanager grootzakelijk bij een bank of leasing-specialist",
      "Netwerk van kapitaalverstrekkers, leasemaatschappijen, private debt-fondsen en vastgoedfinanciers",
    ],
  },
];

export const GENERAL_CONDITIONS = [
  {
    title: "Beloning op No Cure, No Pay Basis",
    desc: "Vast salaris in overleg, gecombineerd met royale succesfees, commissies, margedeling of plaatsingsfees. Geen plafond op je verdiensten.",
    icon: BadgePercent,
  },
  {
    title: "100% Remote Werkplek",
    desc: "Volledige vrijheid om thuis of overal ter wereld te werken, inclusief maandelijkse thuiswerkvergoeding.",
    icon: Globe2,
  },
  {
    title: "27 Vakantiedagen",
    desc: "Ruime verlofregeling op fulltime basis, met de optie om dagen bij te kopen of te sparen voor een sabbatical.",
    icon: Calendar,
  },
  {
    title: "Hardware in Bruikleen",
    desc: "Recente laptop en smartphone met onbeperkt data- en belabonnement, direct geleverd bij start.",
    icon: Laptop,
  },
  {
    title: "Ergonomisch Thuiswerkbudget",
    desc: "Budget voor inrichting van een professionele werkplek: elektrisch zit-sta bureau, 4K monitor en ergonomische stoel.",
    icon: Coffee,
  },
  {
    title: "Interne Academie & Opleiding",
    desc: "Permanente toegang tot interne masterclasses, certificeringstrajecten en AI-infrastructuur trainingen.",
    icon: GraduationCap,
  },
  {
    title: "Evenementen & Workations",
    desc: "Kwartaalborrels, jaarlijkse internationale workation met het hele team en gezamenlijke hackathons.",
    icon: Sparkles,
  },
  {
    title: "HBO- of WO-Denkniveau",
    desc: "Of aantoonbaar gelijkwaardige praktijkervaring met een overtuigend trackrecord in jouw vakgebied.",
    icon: Award,
  },
];

export default function Vacatures() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"matrix" | "cards">("matrix");
  const [activeJobModal, setActiveJobModal] = useState<JobPosition | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPosition | null>(null);

  // Application form fields
  const [formFullName, setFormFullName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLinkedin, setFormLinkedin] = useState("");
  const [formHours, setFormHours] = useState("32–40 uur per week");
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
        <title>No Cure, No Pay Vacatures | Internationale Tech-, AI- & Vastgoedgroep</title>
        <meta
          name="description"
          content="Bekijk 13 exclusieve 100% remote vacatures op no cure no pay basis binnen een internationale tech-, AI- en vastgoedgroep. Succesfees, provisies en doorgroeimogelijkheden."
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
                100% No Cure, No Pay & Commissiemodel
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                <Globe2 className="h-3.5 w-3.5 text-amber-700" />
                100% Remote Werken
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0eae1] px-3.5 py-1 text-xs font-semibold text-[#6c6a64] border border-[#e6dfd8]">
                <Clock className="h-3.5 w-3.5 text-[#6c6a64]" />
                24–40 uur | ZZP of Vast
              </span>
            </div>

            {/* Hero Title */}
            <div className="max-w-4xl">
              <div className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-2">
                Internationale Tech-, AI- & Vastgoedgroep (naam op aanvraag)
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#141413] leading-tight">
                13 Vacatures op <span className="text-primary underline decoration-primary/30 decoration-wavy">No Cure, No Pay</span> Basis
              </h1>
              <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-[#6c6a64] leading-relaxed">
                Op zoek naar maximale vrijheid, high-upside beloningen en een internationaal werkterrein?
                Wij werven direct voor 13 gespecialiseerde rollen binnen R&D, compute, vastgoed, relocatie en capital markets.
                Alle functies zijn 100% remote en gekoppeld aan royale succesfees, provisies en margedeling.
              </p>
            </div>

            {/* CTA Buttons & Stats */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#matrix"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Bekijk Overzichtsmatrix (13 functies)</span>
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
                <span>Bekijk Arbeidsvoorwaarden</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#e6dfd8] pt-6 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-[#141413]">13</div>
                <div className="text-xs text-[#6c6a64]">Openstaande no cure, no pay functies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">100%</div>
                <div className="text-xs text-[#6c6a64]">Remote (thuiswerkvergoeding + laptop)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">27 Dagen</div>
                <div className="text-xs text-[#6c6a64]">Vakantie met optie tot sparen / bijkopen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#141413]">Geen Plafond</div>
                <div className="text-xs text-[#6c6a64]">Op commissie, margedeling & succesfees</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. ARBEIDSVOORWAARDEN (GELDEN VOOR ALLE 13 FUNCTIES)           */}
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
                Onderstaande voorwaarden gelden uniform voor alle 13 functies, ongeacht je uren of specifieke domein.
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
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 text-xs text-[#3d3d3a] flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-amber-900 font-bold">
                !
              </div>
              <div>
                <strong className="font-semibold text-[#141413]">Transparante Beloningsstructuur:</strong> Alle functies combineren een basisafspraak in overleg met prestatiegedreven incentives (succesfees, dealvergoedingen, bemiddelingscourtages, margedeling of succespercentages). Hiermee bouw je direct mee aan het resultaat en profiteer je mee van elke gesloten transactie.
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. OVERZICHTSMATRIX (13 FUNCTIES)                              */}
        {/* ============================================================== */}
        <section id="matrix" className="py-14 md:py-20 border-b border-[#e6dfd8]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                  13 Actieve Posities
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                  Overzichtsmatrix van alle Vacatures
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#6c6a64]">
                  Filter op domein, zoek op trefwoord en bekijk de no cure, no pay beloning per rol.
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-2 rounded-xl border border-[#e6dfd8] bg-white p-1">
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
                  <span>Uitgebreide Kaarten</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: `Alle Rollen (${VACATURES_DATA.length})` },
                  { id: "finance", label: "Corporate & Finance" },
                  { id: "growth", label: "Growth, Media & Sales" },
                  { id: "recruitment", label: "Tech & Headhunting" },
                  { id: "strategy", label: "Strategie & Subsidies" },
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
                  placeholder="Zoek functie, domein, AI, WBSO..."
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

            {/* MATRIX TABLE VIEW */}
            {viewMode === "matrix" && (
              <div className="overflow-hidden rounded-2xl border border-[#e6dfd8] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f4ee] border-b border-[#e6dfd8] text-[#6c6a64] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4 w-14">ID</th>
                        <th className="py-3 px-4">Functie</th>
                        <th className="py-3 px-4">Domein</th>
                        <th className="py-3 px-4">No Cure, No Pay Beloning</th>
                        <th className="py-3 px-4 w-28">Uren</th>
                        <th className="py-3 px-4 text-right w-40">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ece6de]">
                      {filteredJobs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[#6c6a64]">
                            Geen vacatures gevonden voor &quot;{searchTerm}&quot;. Pas je zoekterm of filter aan.
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
                          [{job.id}/13]
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
                      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-emerald-900">
                        <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <BadgePercent className="h-3.5 w-3.5" /> No Cure, No Pay Beloning
                        </div>
                        <div className="font-semibold mt-0.5 text-[11px]">{job.rewardShort}</div>
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
                Van eerste contact tot start met volledige remote setup binnen gemiddeld 7 werkdagen.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Kennismaking",
                  desc: "Stuur je CV en LinkedIn-profiel in via het formulier met de vermelding van jouw gewenste vacature-ID (01 t/m 13).",
                },
                {
                  step: "02",
                  title: "Videogesprek (30 min)",
                  desc: "Gericht online gesprek over je aantoonbare trackrecord, actuele beschikbaarheid en de concrete no cure no pay vergoedingsstructuur.",
                },
                {
                  step: "03",
                  title: "Contract & Setup",
                  desc: "Overeenkomst opstellen, bruikleenapparatuur en smartphone verzenden, en toegang activeren tot systemen en de interne academie.",
                },
                {
                  step: "04",
                  title: "Start & Begeleiding",
                  desc: "100% remote aan de slag met intensieve onboarding en begeleiding bij je eerste deals, campagnes of plaatsingen.",
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
                <h3 className="font-bold text-lg text-[#141413]">Vragen over een functie of beloningsmodel?</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6c6a64]">
                  Neem direct contact op met onze talent-coördinatie via <a href="mailto:info@immigratiepunt.nl" className="font-semibold text-primary underline">info@immigratiepunt.nl</a>.
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
                      VACATURE [{activeJobModal.id}/13]
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
                      + Uniforme voorwaarden: 27 vakantiedagen, apparatuur in bruikleen, ergonomisch budget, thuiswerkvergoeding en interne academie.
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
                  Bedankt voor je reactie op de rol van <strong>{selectedJobForApply?.title}</strong>. We beoordelen je profiel en sturen binnen 48 uur een uitnodiging voor een 30 minuten durend videogesprek.
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
                        [{job.id}] {job.title} — {job.domain} ({job.rewardShort})
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
                    <option value="24 uur per week">24 uur per week (parttime)</option>
                    <option value="32 uur per week">32 uur per week</option>
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
                    placeholder="Beschrijf beknopt jouw belangrijkste successen (bijv. gerealiseerde investeringen, deals, placements of subsidies)..."
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
                    placeholder="Waarom past het no cure no pay / commissiemodel en deze specifieke rol bij jou?"
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
