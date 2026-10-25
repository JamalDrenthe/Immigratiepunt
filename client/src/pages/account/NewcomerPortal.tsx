import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  Briefcase,
  Landmark,
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  Send,
  Eye,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
  User,
  Sliders,
  Settings,
  Globe,
  Bell,
  Lock,
  CreditCard,
  BrainCircuit,
  Wallet,
  Coins,
  GraduationCap,
  Scale,
} from "lucide-react";
import { Member } from "@/lib/auth";
import {
  LetterLogDoc,
  UserDocument,
  SupportMessage,
  IntegrationProfile,
  saveUserDocument,
  deleteUserDocument,
  sendSupportMessage,
  saveIntegrationProfile,
  updateLetterStatus,
  fetchOnboardingData,
  fetchSubscriptionForUser,
} from "@/lib/firebase";

interface NewcomerPortalProps {
  member: Member;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  letters: LetterLogDoc[];
  setLetters: React.Dispatch<React.SetStateAction<LetterLogDoc[]>>;
  documents: UserDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<UserDocument[]>>;
  supportMessages: SupportMessage[];
  setSupportMessages: React.Dispatch<React.SetStateAction<SupportMessage[]>>;
  integrationProfile: IntegrationProfile;
  setIntegrationProfile: React.Dispatch<React.SetStateAction<IntegrationProfile>>;
}

export default function NewcomerPortal({
  member,
  activeTab,
  setActiveTab,
  letters,
  setLetters,
  documents,
  setDocuments,
  supportMessages,
  setSupportMessages,
  integrationProfile,
  setIntegrationProfile,
}: NewcomerPortalProps) {
  // Address copy state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Letter Preview Modal
  const [selectedLetter, setSelectedLetter] = useState<LetterLogDoc | null>(null);

  // Checklist state
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    0: true, // Registratie bij Immigratiepunt
    1: true, // Postadres toegewezen
    2: true, // Briefadresverklaring getekend
    3: false, // BSN afspraak bij Gemeente
    4: false, // Bankrekening via Xabi World
    5: false, // Huisvesting via WoningVry
    6: false, // Werk via Djobba
  });

  // Document Upload Modal state
  const [showDocModal, setShowDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<UserDocument["category"]>("Identiteit & Paspoort");

  // Support Message state
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Integration form state
  const [bsnDate, setBsnDate] = useState(integrationProfile.bsnAppointmentDate || "2026-10-24");
  const [bsnSaved, setBsnSaved] = useState(false);
  const [housingCity, setHousingCity] = useState(integrationProfile.housingCityPreference || "Amsterdam / Utrecht");

  // Onboarding & Subscription data
  const onboarding = fetchOnboardingData(member.email);
  const subscription = fetchSubscriptionForUser(member.email, "newcomer");
  const [housingBudget, setHousingBudget] = useState(integrationProfile.housingBudget || "€ 850 - € 1.200 / maand");
  const [housingSaved, setHousingSaved] = useState(false);
  const [workSector, setWorkSector] = useState(integrationProfile.workSector || "Administratie & Klantenservice");
  const [workSaved, setWorkSaved] = useState(false);

  // Profile Settings state
  const [profileName, setProfileName] = useState(member.name);
  const [profilePhone, setProfilePhone] = useState(member.phone || "+31 6 12345678");
  const [profileSaved, setProfileSaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);

  // Postadres details for Fatima
  const helperName = "Jan de Vries";
  const helperStreet = "Hoofdstraat 42";
  const helperPostalCity = "1011 AA Amsterdam";

  const fullPostalAddressFormatted = `${member.name}
t.a.v. Postadres Immigratiepunt
${helperStreet}
${helperPostalCity}
Nederland`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullPostalAddressFormatted);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const toggleChecklistStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc = saveUserDocument({
      userEmail: member.email,
      title: docTitle.trim(),
      category: docCategory,
      status: "in_behandeling",
      fileSize: "1.4 MB",
    });

    setDocuments((prev) => [newDoc, ...prev]);
    setDocTitle("");
    setShowDocModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    deleteUserDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgContent.trim()) return;

    const newMsg = sendSupportMessage({
      fromEmail: member.email,
      fromName: member.name,
      subject: msgSubject.trim(),
      message: msgContent.trim(),
    });

    setSupportMessages((prev) => [newMsg, ...prev]);
    setMsgSubject("");
    setMsgContent("");
    setMsgSuccess(true);
    setTimeout(() => setMsgSuccess(false), 4000);
  };

  const handleSaveBsn = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...integrationProfile,
      bsnAppointmentDate: bsnDate,
      bsnStatus: "gepland" as const,
    };
    saveIntegrationProfile(updated);
    setIntegrationProfile(updated);
    setBsnSaved(true);
    setTimeout(() => setBsnSaved(false), 3000);
  };

  const handleSaveHousing = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...integrationProfile,
      housingCityPreference: housingCity,
      housingBudget: housingBudget,
    };
    saveIntegrationProfile(updated);
    setIntegrationProfile(updated);
    setHousingSaved(true);
    setTimeout(() => setHousingSaved(false), 3000);
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...integrationProfile,
      workSector: workSector,
    };
    saveIntegrationProfile(updated);
    setIntegrationProfile(updated);
    setWorkSaved(true);
    setTimeout(() => setWorkSaved(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Completion calculation
  const totalSteps = 7;
  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. OVERZICHT (DASHBOARD)                                       */}
      {/* ============================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Welcome & Progress Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50/70 via-white to-amber-50/30 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Dossier Actief • Postadres Gekoppeld
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#141413] md:text-2xl">
                  Welkom terug, {member.name.split(" ")[0]}!
                </h2>
                <p className="mt-1 max-w-xl text-xs md:text-sm text-[#6c6a64] leading-relaxed">
                  Jouw integratietraject in Nederland verloopt volgens plan. Je postadres is actief en klaar voor officiële correspondentie van de Gemeente en IND.
                </p>
              </div>

              {/* Progress Circle & Counter */}
              <div className="flex items-center gap-4 rounded-xl border border-emerald-200/80 bg-white p-4 shadow-xs">
                <div className="text-right">
                  <div className="text-xs font-medium text-[#6c6a64]">Traject Voortgang</div>
                  <div className="text-2xl font-bold text-emerald-700">{progressPercentage}%</div>
                  <div className="text-[11px] text-[#8c887f]">{completedStepsCount} van {totalSteps} stappen voltooid</div>
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-600 to-teal-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mandatory Onboarding & Psychological Testing Alert Banner */}
          <div className={`rounded-2xl border p-4 shadow-xs transition-all ${
            onboarding.completed
              ? "border-emerald-300 bg-emerald-50/70"
              : "border-amber-300 bg-amber-50/80"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  onboarding.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {onboarding.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <BrainCircuit className="h-5 w-5 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#141413]">
                      {onboarding.completed
                        ? "Verplichte Onboarding & Welzijnstest: Voltooid"
                        : "Verplichte Onboarding & Welzijnstest Vereist"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      onboarding.completed ? "bg-emerald-200 text-emerald-800" : "bg-amber-200 text-amber-900"
                    }`}>
                      {onboarding.completed ? "Geverifieerd" : "Verplicht"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3d3d3a] mt-0.5">
                    {onboarding.completed
                      ? "Jouw intake-vragenlijst en psychologische test zijn afgerond. Dossier is goedgekeurd voor briefadreskoppeling."
                      : "Alle immigranten moeten verplicht de onboarding en psychologische test afronden voor definitieve toewijzing."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("subscription")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#a9583e] transition-colors"
              >
                <span>{onboarding.completed ? "Bekijk Onboarding" : "Start Onboarding"}</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Subscription & Urgentie Card */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#141413]">Abonnement & Urgentieregeling</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      Eerste 2 mnd Gratis
                    </span>
                    <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                      Urgentie v.a. € 500,-/mnd
                    </span>
                  </div>
                  <p className="text-xs text-[#6c6a64] mt-1 max-w-2xl leading-relaxed">
                    Standaard integratie: eerste 2 maanden kosteloos (€ 0,-), daarna € 300,- / maand voor een jaar.
                    Heb je spoed? Met de <strong>Zakelijke Urgentie Regeling</strong> (vanaf € 500,- / mnd) gaat het bedrag in je account om <strong>brieven te schrijven en belletjes te doen</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("subscription")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Bekijk Prijzen & Urgentie</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Potjes & Subsidies Wijzer Card */}
          <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50/70 via-teal-50/40 to-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#141413]">Potjes & Subsidies Wijzer voor Immigranten</span>
                    <span className="rounded-full bg-emerald-200 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                      10+ Regelingen Actief
                    </span>
                  </div>
                  <p className="text-xs text-[#3d3d3a] mt-1 max-w-2xl leading-relaxed">
                    Als immigrant heb je vaak recht op overheidssubsidies: <strong>Zorg- & huurtoeslag</strong>, <strong>Stichting Leergeld</strong> (€ 300 - € 900/kind voor school & laptop), <strong>100% vergoede IDW diplomawaardering</strong>, <strong>IND legesvrijstelling</strong> en <strong>gesubsidieerde rechtshulp</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("potjes")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Coins className="h-4 w-4" />
                <span>Open Potjes Radar</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Core Action Cards Grid: Postadres & Next Action */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Postal Address Card */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#141413]">Jouw Officiële Postadres</h3>
                    <p className="text-[11px] text-[#6c6a64]">Voor Gemeente, IND & Bankzaken</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-semibold text-[#141413] hover:bg-[#efe9de] transition-colors"
                >
                  {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAddress ? "Gekopieerd!" : "Kopieer Adres"}
                </button>
              </div>

              {/* Formatted Address Box */}
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5 font-mono text-xs text-[#141413] leading-relaxed select-all">
                <div>{member.name}</div>
                <div className="text-[#6c6a64]">t.a.v. Postadres Immigratiepunt</div>
                <div>{helperStreet}</div>
                <div>{helperPostalCity}</div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#6c6a64]">
                <span>Helper: <strong className="text-[#141413]">{helperName}</strong></span>
                <button
                  type="button"
                  onClick={() => setActiveTab("postadres")}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Bekijk poststukken ({letters.length}) <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Next Urgent Step Card */}
            <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#141413]">Volgende Geplande Stap</h3>
                  <p className="text-[11px] text-[#6c6a64]">Gemeente Amsterdam Burgerzaken</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-[#141413]">
                  Afspraak BSN & Registratie aan de Balie
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6c6a64]">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  <span>Datum: <strong>24 oktober 2026 om 10:30 uur</strong></span>
                </div>
                <p className="text-xs text-[#3d3d3a] leading-relaxed">
                  Locatie: Stadsloket Centrum, Amstel 1. Neem je geldige paspoort en de ondertekende briefadresverklaring mee.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("integratie")}
                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                >
                  Voorbereiding & Documenten <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("adviseur")}
                  className="text-xs font-medium text-[#6c6a64] hover:text-[#141413]"
                >
                  Hulp van adviseur nodig?
                </button>
              </div>
            </div>
          </div>

          {/* Integration Roadmap Checklist */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#f0eae1] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Jouw 6 Integratie Mijlpalen</h3>
                <p className="text-xs text-[#6c6a64]">
                  Van aanmelding en BSN tot bank, woning en werk. Klik om een stap af te vinken.
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                {completedStepsCount} van {totalSteps} gereed
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                {
                  title: "1. Aanmelding & Intake Immigratiepunt",
                  desc: "Persoonlijk dossier aangemaakt en wensen geregistreerd.",
                  tab: "overview",
                },
                {
                  title: "2. Postadres-helper toegewezen",
                  desc: "Gekoppeld aan Jan de Vries in Amsterdam voor officiële post.",
                  tab: "postadres",
                },
                {
                  title: "3. Briefadresverklaring getekend & gedownload",
                  desc: "Officieel formulier voor gemeentelijke BSN aanvraag.",
                  tab: "integratie",
                },
                {
                  title: "4. Afspraak Gemeente & BSN afgifte",
                  desc: "Inschrijving in de BRP en toekenning BurgerServiceNummer.",
                  tab: "integratie",
                },
                {
                  title: "5. Nederlandse Bankrekening (Xabi World)",
                  desc: "IBAN binnen 48 uur na BSN, iDEAL & mobiel bankieren.",
                  tab: "integratie",
                },
                {
                  title: "6. Huisvesting zoeken (WoningVry)",
                  desc: "Kamer of appartement met contractscreening tegen scams.",
                  tab: "integratie",
                },
                {
                  title: "7. Werk & Sollicitatie (Djobba)",
                  desc: "Nederlands CV, jobmatching en coaching voor gesprekken.",
                  tab: "integratie",
                },
              ].map((step, idx) => {
                const isDone = checkedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistStep(idx)}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                      isDone
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-[#e6dfd8] bg-[#faf9f5] hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                        isDone ? "bg-emerald-600 text-white" : "border border-[#c8c4bc] bg-white"
                      }`}
                    >
                      {isDone && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div className="grow">
                      <div className={`text-xs font-bold ${isDone ? "text-emerald-950 line-through" : "text-[#141413]"}`}>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-[#6c6a64] mt-0.5 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div
              onClick={() => setActiveTab("postadres")}
              className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#6c6a64]">
                <span>Brievenbus</span>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-[#141413] mt-2">{letters.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium">Alle post up-to-date</div>
            </div>

            <div
              onClick={() => setActiveTab("documenten")}
              className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#6c6a64]">
                <span>Documentenkluis</span>
                <FolderOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-[#141413] mt-2">{documents.length}</div>
              <div className="text-[11px] text-[#6c6a64]">Geverifieerde bestanden</div>
            </div>

            <div
              onClick={() => setActiveTab("adviseur")}
              className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#6c6a64]">
                <span>Adviseur Berichten</span>
                <HelpCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-[#141413] mt-2">{supportMessages.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium">Binnen 2-4u antwoord</div>
            </div>

            <div
              onClick={() => setActiveTab("integratie")}
              className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#6c6a64]">
                <span>Partners Actief</span>
                <ShieldCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-[#141413] mt-2">3</div>
              <div className="text-[11px] text-[#6c6a64]">Xabi, WoningVry, Djobba</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MIJN POSTADRES & BRIEVENBUS                                 */}
      {/* ============================================================== */}
      {activeTab === "postadres" && (
        <div className="space-y-6">
          {/* Postadres Card & Usage Instructions */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#141413]">Jouw Postadres in Nederland</h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Actief & Goedgekeurd
                    </span>
                  </div>
                  <p className="text-xs text-[#6c6a64]">
                    Beheerd door postadres-helper: <strong className="text-[#141413]">{helperName}</strong> • Amsterdam
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e] transition-colors"
              >
                {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedAddress ? "Adres Gekopieerd!" : "Kopieer voor formulieren"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 text-xs">
                <div className="font-bold text-[#141413] mb-1">Gebruik dit adres exact als volgt:</div>
                <div className="font-mono bg-white p-3 rounded-lg border border-[#e6dfd8] leading-relaxed select-all">
                  <div>{member.name}</div>
                  <div className="text-[#6c6a64]">t.a.v. Postadres Immigratiepunt</div>
                  <div>{helperStreet}</div>
                  <div>{helperPostalCity}</div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 text-xs text-[#3d3d3a] space-y-2">
                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-700" />
                  Juridische bescherming briefadres
                </div>
                <p className="leading-relaxed">
                  Dit adres is uitsluitend geregistreerd voor correspondentie met officiële instanties (Gemeente, IND, Belastingdienst, Zorgverzekering en Bank). Je woont er niet fysiek.
                </p>
                <div className="text-[11px] text-blue-900 font-medium">
                  Zodra een brief binnenkomt, registreert de helper deze binnen 24 uur in jouw dashboard.
                </div>
              </div>
            </div>
          </div>

          {/* Letter Inbox Feed */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eae1] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Ontvangen Poststukken ({letters.length})
                </h3>
                <p className="text-xs text-[#6c6a64]">
                  Overzicht van alle brieven die door de helper op jouw naam zijn ontvangen
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-800 border border-emerald-200 font-medium">
                  Status: Realtime gesynchroniseerd
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {letters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Nog geen poststukken ontvangen. Zodra de Belastingdienst of Gemeente een brief stuurt, verschijnt deze hier.
                </div>
              ) : (
                letters.map((l, idx) => (
                  <div
                    key={l.id || idx}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e6dfd8] text-primary shadow-xs">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#141413]">{l.sender}</span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              l.status === "binnengekomen"
                                ? "bg-amber-100 text-amber-800"
                                : l.status === "doorgestuurd"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {l.status || "binnengekomen"}
                          </span>
                        </div>
                        <div className="text-xs text-[#3d3d3a] mt-1 font-medium">
                          {l.notes || "Officiële correspondentie"}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#8c887f] mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Ontvangen op: {l.dateReceived}
                          </span>
                          <span>•</span>
                          <span>Geadresseerd aan: {l.recipientName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLetter(l)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs font-semibold text-[#141413] hover:bg-[#efe9de]"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#6c6a64]" />
                        Bekijk Details
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMsgSubject(`Hulp bij brief: ${l.sender}`);
                          setMsgContent(`Beste adviseur, ik heb een brief ontvangen van ${l.sender} (${l.dateReceived}). Zouden jullie mij kunnen uitleggen wat hierin staat en wat ik moet doen?`);
                          setActiveTab("adviseur");
                        }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        Vraag Adviseur
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Letter Detail Modal */}
          {selectedLetter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base text-[#141413]">
                      Poststuk Details
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLetter(null)}
                    className="rounded-lg p-1 text-[#6c6a64] hover:bg-[#f0eae1]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 bg-[#faf9f5] p-3 rounded-xl border border-[#e6dfd8]">
                    <div>
                      <div className="text-[11px] text-[#6c6a64]">Afzender:</div>
                      <div className="font-semibold text-[#141413]">{selectedLetter.sender}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#6c6a64]">Ontvangstdatum:</div>
                      <div className="font-semibold text-[#141413]">{selectedLetter.dateReceived}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#6c6a64]">Geadresseerde:</div>
                      <div className="font-semibold text-[#141413]">{selectedLetter.recipientName}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#6c6a64]">Huidige Status:</div>
                      <div className="font-semibold text-emerald-700 capitalize">{selectedLetter.status || "binnengekomen"}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-[#141413] mb-1">Omschrijving & Inhoud:</div>
                    <div className="rounded-xl border border-[#e6dfd8] bg-white p-3.5 leading-relaxed text-[#3d3d3a]">
                      {selectedLetter.notes}
                      <p className="mt-2 text-[11px] text-[#8c887f] italic">
                        Tip: Neem voor brieven van de Gemeente of IND contact op met je adviseur om eventuele deadlines (bezwaartermijnen of afspraakdata) te waarborgen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#f0eae1]">
                  <span className="text-[11px] text-[#8c887f]">Veilig bewaard in archief</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLetter(null)}
                      className="h-8 rounded-lg border border-[#e6dfd8] px-4 font-semibold text-[#6c6a64] hover:bg-[#efe9de]"
                    >
                      Sluiten
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateLetterStatus(selectedLetter.id || "", "opgehaald");
                        setLetters((prev) =>
                          prev.map((l) => (l.id === selectedLetter.id ? { ...l, status: "opgehaald" } : l))
                        );
                        setSelectedLetter(null);
                      }}
                      className="h-8 rounded-lg bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700"
                    >
                      Markeer als Opgehaald
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. INTEGRATIE & DIENSTEN (4 PILLARS)                           */}
      {/* ============================================================== */}
      {activeTab === "integratie" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[#141413]">
              De 4 Pijlers van Jouw Integratie
            </h2>
            <p className="text-xs text-[#6c6a64] mt-1 max-w-2xl">
              Immigratiepunt combineert postadresbegeleiding met gespecialiseerde ondersteuning voor BSN, bankzaken (Xabi World), huisvesting (WoningVry) en werk (Djobba).
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 1. BSN & GEMEENTE */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#141413]">1. BSN & Gemeente Inschrijving</h3>
                    <p className="text-[11px] text-[#6c6a64]">Burgerzaken Amsterdam</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {integrationProfile.bsnStatus === "gepland" ? "Afspraak Gepland" : "In Behandeling"}
                </span>
              </div>

              <div className="text-xs text-[#3d3d3a] space-y-2">
                <p className="leading-relaxed">
                  Met het getekende briefadresformulier van je helper kun je je officieel laten registreren in de Basisregistratie Personen (BRP).
                </p>

                {/* Formulier download */}
                <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-[#141413]">Toestemmingsverklaring_Briefadres.pdf</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Het document 'Toestemmingsverklaring_Briefadres.pdf' wordt gedownload.")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>

                {/* Checklist mee te nemen */}
                <div className="pt-1">
                  <div className="font-bold text-[#141413] mb-1">Mee te nemen naar de balie:</div>
                  <ul className="space-y-1 text-[11px] text-[#6c6a64] list-disc list-inside">
                    <li>Geldig nationaal paspoort of ID-kaart</li>
                    <li>Geprinte briefadresverklaring van Jan de Vries</li>
                    <li>Kopie identiteitsbewijs van de helper</li>
                    <li>Gelegaliseerde geboorteakte (indien van toepassing)</li>
                  </ul>
                </div>
              </div>

              {/* Date Update Form */}
              <form onSubmit={handleSaveBsn} className="border-t border-[#f0eae1] pt-3 text-xs space-y-2">
                <label className="block font-semibold text-[#141413]">Jouw Afspraakdatum bij Gemeente:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={bsnDate}
                    onChange={(e) => setBsnDate(e.target.value)}
                    className="h-9 grow rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="h-9 rounded-lg bg-primary px-3 font-semibold text-white hover:bg-[#a9583e]"
                  >
                    {bsnSaved ? "Opgeslagen!" : "Opslaan"}
                  </button>
                </div>
              </form>
            </div>

            {/* 2. BANKZAKEN VIA XABI WORLD */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#141413]">2. Nederlandse Bankrekening</h3>
                    <p className="text-[11px] text-blue-700 font-medium">Partner: Xabi World</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  IBAN in 48 uur
                </span>
              </div>

              <div className="text-xs text-[#3d3d3a] space-y-2.5">
                <p className="leading-relaxed">
                  Zodra je BSN is toegekend bij de gemeente, activeert Xabi World binnen 48 uur een officiële Nederlandse IBAN betaalrekening met volledige iDEAL en mobiel bankieren.
                </p>

                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3 space-y-1">
                  <div className="font-bold text-blue-900">Wat is inbegrepen?</div>
                  <div className="text-[11px] text-blue-800 leading-relaxed">
                    • Nederlandse IBAN voor salarisontvangst en toeslagen<br />
                    • Contactloze Debit Card voor supermarkten en openbaar vervoer<br />
                    • Mobiele app beschikbaar in meerdere talen
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://xabiworld.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary font-semibold text-white hover:bg-[#a9583e]"
                  >
                    Open Xabi World Portaal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. HUISVESTING VIA WONINGVRY */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#141413]">3. Huisvestingsondersteuning</h3>
                    <p className="text-[11px] text-emerald-700 font-medium">Partner: WoningVry</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  100% Huurbescherming
                </span>
              </div>

              <div className="text-xs text-[#3d3d3a] space-y-2">
                <p className="leading-relaxed">
                  Begeleiding bij het vinden van geverifieerde woonruimte en juridische screening van huurovereenkomsten ter voorkoming van oplichting.
                </p>

                <form onSubmit={handleSaveHousing} className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#141413] mb-1">Voorkeursregio:</label>
                    <input
                      type="text"
                      value={housingCity}
                      onChange={(e) => setHousingCity(e.target.value)}
                      placeholder="bijv. Amsterdam, Utrecht"
                      className="h-8 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#141413] mb-1">Budgetindicatie:</label>
                    <input
                      type="text"
                      value={housingBudget}
                      onChange={(e) => setHousingBudget(e.target.value)}
                      placeholder="bijv. € 900 - € 1.300 / maand"
                      className="h-8 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="h-8 rounded-lg bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700 text-xs"
                    >
                      {housingSaved ? "Opgeslagen!" : "Voorkeuren Opslaan"}
                    </button>
                    <a
                      href="https://woningvry.nl"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e6dfd8] bg-white px-3 font-medium text-[#141413] hover:bg-[#efe9de] text-xs"
                    >
                      WoningVry.nl <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* 4. WERK VIA DJOBBA */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#141413]">4. Werkgelegenheidsondersteuning</h3>
                    <p className="text-[11px] text-purple-700 font-medium">Partner: Djobba</p>
                  </div>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                  92% op gesprek in 30d
                </span>
              </div>

              <div className="text-xs text-[#3d3d3a] space-y-2">
                <p className="leading-relaxed">
                  CV optimalisatie naar Nederlandse maatstaven, directe matching met erkende werkgevers en coaching voor sollicitatiegesprekken.
                </p>

                <form onSubmit={handleSaveWork} className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#141413] mb-1">Gewenste sector:</label>
                    <select
                      value={workSector}
                      onChange={(e) => setWorkSector(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-2 outline-none focus:border-primary text-xs"
                    >
                      <option value="Administratie & Klantenservice">Administratie & Klantenservice</option>
                      <option value="Logistiek & Transport">Logistiek & Transport</option>
                      <option value="IT, Tech & Ontwikkeling">IT, Tech & Ontwikkeling</option>
                      <option value="Horeca & Evenementen">Horeca & Evenementen</option>
                      <option value="Bouw & Techniek">Bouw & Techniek</option>
                      <option value="Zorg & Welzijn">Zorg & Welzijn</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="h-8 rounded-lg bg-purple-700 px-4 font-semibold text-white hover:bg-purple-800 text-xs"
                    >
                      {workSaved ? "Sector Opgeslagen!" : "Voorkeur Opslaan"}
                    </button>
                    <a
                      href="https://djobba.nl"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e6dfd8] bg-white px-3 font-medium text-[#141413] hover:bg-[#efe9de] text-xs"
                    >
                      Djobba.nl <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Integration Potjes & Grants Section */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 mb-2">
                  <Coins className="h-3.5 w-3.5 text-emerald-700" />
                  Financiële Steun & Vergoedingen
                </div>
                <h3 className="text-base font-bold text-[#141413]">
                  Overheidspotjes & Subsidies per Integratiestap
                </h3>
                <p className="text-xs text-[#6c6a64] mt-0.5 max-w-2xl">
                  Voor elk van de vier pijlers zijn er specifieke fondsen, toeslagen en kwijtscheldingen beschikbaar vanuit de overheid, gemeente en stichtingen.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("potjes")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Coins className="h-4 w-4" />
                <span>Bekijk Alle Potjes & Subsidies</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141413] mb-1">
                  <Calendar className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>BSN & Verblijf</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 mb-1">IND Legesvrijstelling</div>
                <p className="text-[11px] text-[#6c6a64] leading-relaxed">
                  Tot € 1.200,- kwijtschelding van IND-leges bij minimuminkomen of asielachtergrond.
                </p>
              </div>

              <div className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141413] mb-1">
                  <Landmark className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Bank & Financiën</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 mb-1">Zorg- & Huurtoeslag</div>
                <p className="text-[11px] text-[#6c6a64] leading-relaxed">
                  Maandelijkse overheidstoeslagen tot € 540,- per maand voor zorgverzekering en huurlasten.
                </p>
              </div>

              <div className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141413] mb-1">
                  <Home className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Huisvesting</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 mb-1">Woonlastentoeslag</div>
                <p className="text-[11px] text-[#6c6a64] leading-relaxed">
                  Gemeentelijke bijzondere bijstand voor eerste inrichtingskosten en borgsommen.
                </p>
              </div>

              <div className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141413] mb-1">
                  <Briefcase className="h-4 w-4 text-purple-700 shrink-0" />
                  <span>Werk & Opleiding</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 mb-1">IDW Diplomawaardering</div>
                <p className="text-[11px] text-[#6c6a64] leading-relaxed">
                  100% vergoeding door Nuffic/SBB voor de officiële erkenning van je buitenlandse diploma.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. DOCUMENTENKLUIS                                             */}
      {/* ============================================================== */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eae1] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Veilige Documentenkluis ({documents.length})
                </h3>
                <p className="text-xs text-[#6c6a64]">
                  Beheer officiële aktes, paspoortkopieën en IND formulieren voor je aanvragen
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
              >
                <Plus className="h-4 w-4" />
                + Document Toevoegen
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Nog geen documenten geüpload. Voeg je paspoort of briefadresformulier toe.
                </div>
              ) : (
                documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5 text-xs transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#141413]">{d.title}</div>
                        <div className="text-[11px] text-[#6c6a64]">
                          Categorie: <span className="font-semibold">{d.category}</span> {d.fileSize ? `• ${d.fileSize}` : ""}
                        </div>
                        <div className="text-[10px] text-[#8c887f]">Toegevoegd op: {d.uploadedAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          d.status === "goedgekeurd"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.status === "in_behandeling"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {d.status.replace("_", " ")}
                      </span>

                      <button
                        type="button"
                        onClick={() => alert(`Document '${d.title}' wordt veilig geopend.`)}
                        className="p-1.5 rounded-lg border border-[#e6dfd8] bg-white text-[#6c6a64] hover:text-[#141413]"
                        title="Download of bekijk"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(d.id)}
                        className="p-1.5 rounded-lg border border-[#e6dfd8] bg-white text-[#6c6a64] hover:text-red-600"
                        title="Verwijder document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Doc Modal */}
          {showDocModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs space-y-4">
                <h3 className="font-bold text-sm text-[#141413]">Document toevoegen aan dossier</h3>
                <p className="text-[#6c6a64]">
                  Selecteer een documenttype voor controle door je Immigratiepunt adviseur.
                </p>
                <form onSubmit={handleAddDocument} className="space-y-3">
                  <div>
                    <label className="block font-medium text-[#141413] mb-1">Documentnaam</label>
                    <input
                      type="text"
                      placeholder="bijv. Afspraakbevestiging BSN Gemeente"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      required
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#141413] mb-1">Categorie</label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value as UserDocument["category"])}
                      className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                    >
                      <option value="Identiteit & Paspoort">Identiteit & Paspoort</option>
                      <option value="Gemeente & BSN">Gemeente & BSN</option>
                      <option value="IND & Verblijf">IND & Verblijf</option>
                      <option value="Huisvesting & Contract">Huisvesting & Contract</option>
                      <option value="Overig">Overig</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDocModal(false)}
                      className="h-9 rounded-lg border border-[#e6dfd8] px-4 font-medium text-[#6c6a64]"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="h-9 rounded-lg bg-primary px-4 font-semibold text-white hover:bg-[#a9583e]"
                    >
                      Toevoegen
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MIJN ADVISEUR & BERICHTEN                                   */}
      {/* ============================================================== */}
      {activeTab === "adviseur" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141413]">
                    Jouw Persoonlijke Begeleider
                  </h3>
                  <p className="text-xs text-[#6c6a64]">
                    Beheerder Immigratiepunt • Reactietijd gemiddeld 2-4 uur op werkdagen
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#6c6a64]">
                E-mail: <strong className="text-[#141413]">info@immigratiepunt.nl</strong>
              </div>
            </div>

            {msgSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Je bericht is verzonden! Een adviseur reageert binnen enkele uren.</span>
              </div>
            )}

            {/* Send Question Form */}
            <form onSubmit={handleSendMessage} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Onderwerp:</label>
                <input
                  type="text"
                  placeholder="bijv. Hulp bij vertaling brief Gemeente Amsterdam"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  required
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141413] mb-1">Jouw Vraag of Bericht:</label>
                <textarea
                  rows={4}
                  placeholder="Beschrijf je situatie, geef aan welke hulp je nodig hebt of plak eventuele tekst uit een ontvangen brief..."
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#a9583e]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Verstuur naar Adviseur
                </button>
              </div>
            </form>
          </div>

          {/* Conversation History */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h4 className="font-bold text-sm text-[#141413] mb-3">
              Eerdere Berichten & Antwoorden ({supportMessages.length})
            </h4>

            <div className="space-y-3">
              {supportMessages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Nog geen berichten verzonden. Stel gerust een vraag aan je adviseur.
                </div>
              ) : (
                supportMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#141413]">{msg.subject}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            msg.status === "beantwoord"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8c887f]">
                        {new Date(msg.createdAt).toLocaleDateString("nl-NL")}
                      </span>
                    </div>

                    <div className="rounded-lg bg-white p-3 border border-[#e6dfd8] text-[#3d3d3a] leading-relaxed">
                      {msg.message}
                    </div>

                    {msg.reply && (
                      <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-1">
                        <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Antwoord van Adviseur (Immigratiepunt):
                        </div>
                        <p className="text-emerald-900 leading-relaxed pl-5">{msg.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. PROFIEL & INSTELLINGEN                                       */}
      {/* ============================================================== */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs max-w-2xl space-y-6">
          <div className="border-b border-[#f0eae1] pb-3">
            <h3 className="text-base font-bold text-[#141413]">
              Mijn Profiel & Account Instellingen
            </h3>
            <p className="text-xs text-[#6c6a64]">
              Beheer je persoonlijke contactgegevens en voorkeuren voor communicatie
            </p>
          </div>

          {profileSaved && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Profielgegevens succesvol bijgewerkt!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Volledige Naam</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141413] mb-1">E-mailadres</label>
                <input
                  type="email"
                  disabled
                  value={member.email}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-gray-100 px-3 text-[#6c6a64] outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Telefoonnummer</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141413] mb-1">Land van Herkomst</label>
                <input
                  type="text"
                  disabled
                  value={member.countryOrCity || "Syria"}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-gray-100 px-3 text-[#6c6a64] outline-none"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="border-t border-[#f0eae1] pt-4 space-y-3">
              <h4 className="font-bold text-[#141413] flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-primary" /> Meldingen & Updates
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="h-4 w-4 rounded border-[#c8c4bc] text-primary focus:ring-primary"
                  />
                  <span>Ontvang direct een e-mail zodra een poststuk wordt geregistreerd</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    className="h-4 w-4 rounded border-[#c8c4bc] text-primary focus:ring-primary"
                  />
                  <span>SMS-herinnering 24 uur voor een gemeentelijke BSN afspraak</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="h-9 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#a9583e]"
              >
                Gegevens Opslaan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
