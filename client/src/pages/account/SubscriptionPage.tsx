import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  PhoneCall,
  FileText,
  Building,
  HeartHandshake,
  Coins,
  ArrowRight,
  AlertTriangle,
  Wallet,
  Plus,
  Info,
  Check,
  Briefcase,
  Home,
  Landmark,
  UserCheck,
  BrainCircuit,
  Smile,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { Member } from "@/lib/auth";
import {
  AccountSubscription,
  UrgentieServiceRequest,
  OnboardingData,
  fetchSubscriptionForUser,
  saveSubscription,
  fetchUrgentieRequests,
  createUrgentieRequest,
  topUpWallet,
  fetchOnboardingData,
  saveOnboardingData,
} from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubscriptionPageProps {
  member: Member;
  role: "admin" | "helper" | "newcomer";
}

export default function SubscriptionPage({ member, role }: SubscriptionPageProps) {
  const { t } = useTranslation();

  // Tab: newcomer, helper, zakelijk
  const [selectedPlanTab, setSelectedPlanTab] = useState<"newcomer" | "helper" | "zakelijk">(
    role === "helper" ? "helper" : "newcomer"
  );

  // Subscription data
  const [subscription, setSubscription] = useState<AccountSubscription>(() =>
    fetchSubscriptionForUser(member.email, role)
  );

  // Urgentie requests
  const [urgentieRequests, setUrgentieRequests] = useState<UrgentieServiceRequest[]>(() =>
    fetchUrgentieRequests(role === "admin" ? undefined : member.email)
  );

  // Onboarding data
  const [onboarding, setOnboarding] = useState<OnboardingData>(() =>
    fetchOnboardingData(member.email)
  );

  // Wallet top-up state
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // New Urgentie Request Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setReqType] = useState<UrgentieServiceRequest["type"]>("brief_schrijven");
  const [reqTitle, setReqTitle] = useState("");
  const [reqDescription, setReqDescription] = useState("");
  const [reqOrg, setReqOrg] = useState("Gemeente Amsterdam (Burgerzaken)");
  const [reqUrgency, setReqUrgency] = useState<UrgentieServiceRequest["urgency"]>("spoed");
  const [reqError, setReqError] = useState("");
  const [reqSuccess, setReqSuccess] = useState(false);

  // Onboarding Modal Wizard
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);
  const [onboardingForm, setOnboardingForm] = useState<OnboardingData>(onboarding);
  const [onboardingSaved, setOnboardingSaved] = useState(false);

  // Reload data
  const reloadData = () => {
    setSubscription(fetchSubscriptionForUser(member.email, role));
    setUrgentieRequests(fetchUrgentieRequests(role === "admin" ? undefined : member.email));
    setOnboarding(fetchOnboardingData(member.email));
  };

  // Cost map for services
  const costMap: Record<UrgentieServiceRequest["type"], number> = {
    brief_schrijven: 45,
    belletje_doen: 35,
    dossier_screening: 65,
    loket_begeleiding: 120,
    anders: 50,
  };

  const handleTopUp = () => {
    const updated = topUpWallet(member.email, topUpAmount);
    setSubscription(updated);
    setTopUpSuccess(true);
    setTimeout(() => {
      setTopUpSuccess(false);
      setShowTopUpModal(false);
    }, 1200);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReqError("");

    if (!reqTitle.trim() || !reqDescription.trim()) {
      setReqError("Vul alsjeblieft een duidelijke titel en omschrijving in.");
      return;
    }

    const cost = costMap[reqType] || 45;
    const result = createUrgentieRequest({
      userEmail: member.email,
      userName: member.name,
      type: reqType,
      title: reqTitle,
      description: reqDescription,
      targetOrganization: reqOrg,
      urgency: reqUrgency,
      cost,
      status: "in_behandeling",
    });

    if (result.error) {
      setReqError(result.error);
      return;
    }

    setReqSuccess(true);
    reloadData();
    setTimeout(() => {
      setReqSuccess(false);
      setShowRequestModal(false);
      setReqTitle("");
      setReqDescription("");
    }, 1200);
  };

  const handleSaveOnboarding = () => {
    const finished: OnboardingData = {
      ...onboardingForm,
      completed: true,
      completedAt: new Date().toLocaleDateString("nl-NL"),
    };
    saveOnboardingData(finished);
    setOnboarding(finished);
    setOnboardingSaved(true);
    setTimeout(() => {
      setOnboardingSaved(false);
      setShowOnboardingModal(false);
      setOnboardingStep(1);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Abonnementen & Platform Prijzen</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#141413] md:text-3xl">
              Transparante Tarieven & Urgentieregeling
            </h2>
            <p className="mt-1 max-w-2xl text-xs md:text-sm text-[#6c6a64] leading-relaxed">
              Bij Immigratiepunt werken we met een helder en solidair model: kosteloze instap voor nieuwkomers, een bescheiden gift voor helpers, en een complete zakelijke urgentie ontzorging met direct dienstentegoed.
            </p>
          </div>

          {/* Current Plan Badge */}
          <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3 text-right">
            <span className="text-[11px] font-medium text-[#8c887f] block">Jouw Actieve Status</span>
            <span className="font-bold text-sm text-[#141413]">
              {subscription.planType === "helper_gift"
                ? "Helper Gift (€ 5,- / mnd)"
                : subscription.planType === "zakelijke_urgentie"
                ? "Zakelijke Urgentie (€ 500,- / mnd)"
                : "Immigrant Standaard (2 mnd Gratis)"}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              {subscription.status === "proefperiode"
                ? "Proefperiode Actief"
                : "Actief Account"}
            </span>
          </div>
        </div>

        {/* Plan Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[#f0eae1] pt-4">
          <button
            type="button"
            onClick={() => setSelectedPlanTab("newcomer")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              selectedPlanTab === "newcomer"
                ? "bg-primary text-white shadow-xs"
                : "border border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-white"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Voor Immigranten / Nieuwkomers</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              2 Mnd Gratis
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlanTab("helper")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              selectedPlanTab === "helper"
                ? "bg-primary text-white shadow-xs"
                : "border border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-white"
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Voor Hulpverleners / Helpers</span>
            <span className="rounded-full bg-blue-500/20 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
              € 5,- gift
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlanTab("zakelijk")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              selectedPlanTab === "zakelijk"
                ? "bg-primary text-white shadow-xs"
                : "border border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-white"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Zakelijke Urgentie Regeling</span>
            <span className="rounded-full bg-amber-500/20 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
              Vanaf € 500,-
            </span>
          </button>
        </div>
      </div>

      {/* Mandatory Onboarding Alert Banner (Crucial for Immigrants) */}
      <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
        onboarding.completed
          ? "border-emerald-300 bg-emerald-50/70"
          : "border-amber-300 bg-amber-50/80"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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
                <span className="font-bold text-sm text-[#141413]">
                  {onboarding.completed
                    ? "Onboarding & Welzijnstest: Voltooid & Geverifieerd"
                    : "Verplichte Onboarding & Welzijnstest Vereist"}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  onboarding.completed ? "bg-emerald-200 text-emerald-800" : "bg-amber-200 text-amber-900"
                }`}>
                  {onboarding.completed ? "Voldaan" : "Verplicht voor Immigranten"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#3d3d3a] leading-relaxed max-w-2xl">
                {onboarding.completed
                  ? `Jouw intake-vragenlijst en psychologische welzijnstest zijn op ${onboarding.completedAt || "recent"} geregistreerd. Jouw dossier heeft de status "Geverifieerd" voor briefadrestoewijzing.`
                  : "Alle immigranten moeten verplicht de onboarding afronden. Dit omvat het invullen van de situatievragenlijsten en het doen van de psychologische welzijnstest om de juiste begeleiding te garanderen."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setOnboardingForm(onboarding);
              setShowOnboardingModal(true);
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all ${
              onboarding.completed
                ? "border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
                : "bg-primary text-white hover:bg-[#a9583e]"
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>{onboarding.completed ? "Bekijk / Pas Testen Aan" : "Start Onboarding & Testen"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: VOOR IMMIGRANTEN / NIEUW KOMERS                        */}
      {/* ------------------------------------------------------------- */}
      {selectedPlanTab === "newcomer" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Pricing Box */}
          <div className="lg:col-span-2 rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Standaard Immigranten Traject
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
                    Integratie & Briefadres Programma
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-primary">€ 0,-</span>
                    <span className="text-xs text-[#6c6a64] font-medium">/ 1e 2 maanden</span>
                  </div>
                  <span className="text-[11px] text-[#8c887f] block">Daarna € 300,- / mnd voor 1 jaar</span>
                </div>
              </div>

              {/* Formula & Explanation */}
              <div className="mt-5 rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Solidair & Laagdrempelig Model</span>
                </div>
                <p className="text-xs text-[#3d3d3a] leading-relaxed">
                  De eerste 2 maanden betaal je als nieuwkomer <strong>helemaal niets (€ 0,- gift)</strong>. Deze periode is bedoeld om rustig je briefadres te activeren, je BSN bij de gemeente op te halen en je bankrekening te openen. Pas vanaf maand 3 bedraagt de maandelijkse gift € 300,- per maand gedurende een jaar om de voortdurende juridische opvolging en platformdiensten te financieren.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6c6a64] mb-3">
                  Volledig Inbegrepen in het Immigranten Abonnement:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#3d3d3a]">
                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">Wettelijk Briefadres (Wet BRP)</strong>
                      <span className="text-[11px] text-[#6c6a64]">Officiële toestemmingsverklaring conform Art. 2.45 voor gemeentelijke inschrijving.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">BSN Afspraak Begeleiding</strong>
                      <span className="text-[11px] text-[#6c6a64]">Dossierklaarmaking en instructie voor de Burgerzaken balie bij jouw stadsloket.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">Bankrekening via Xabi World</strong>
                      <span className="text-[11px] text-[#6c6a64]">Nederlandse IBAN binnen 48 uur na BSN met iDEAL en bankpas.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">Huisvesting via WoningVry</strong>
                      <span className="text-[11px] text-[#6c6a64]">Gecontroleerde huurwoningen en kamers met screening tegen woekerprijzen.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">Werk & CV via Djobba</strong>
                      <span className="text-[11px] text-[#6c6a64]">Herschrijven van je cv naar Nederlandse normen en directe vacaturematching.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-3">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#141413]">Postregistratie & Digitale Kluis</strong>
                      <span className="text-[11px] text-[#6c6a64]">Meldingen bij binnenkomst van officiële brieven en veilige cloudopslag.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status strip */}
            <div className="mt-6 pt-4 border-t border-[#f0eae1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#6c6a64]">
                Huidige fase: <strong className="text-emerald-700">Gratis Proefperiode (Nog 48 dagen)</strong>
              </span>
              <span className="text-[11px] text-[#8c887f]">Geen automatische afschrijving vóór afloop proefperiode</span>
            </div>
          </div>

          {/* Side Info & Upgrade to Urgentie Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-300 bg-linear-to-br from-amber-50/70 via-white to-amber-100/30 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Met Spoed Ontzorgd Worden?</span>
              </div>
              <h4 className="font-bold text-base text-[#141413]">
                Zakelijke Urgentie Regeling
              </h4>
              <p className="mt-2 text-xs text-[#3d3d3a] leading-relaxed">
                Heb je directe haast met een woning, baan, bank of gemeente en wil je dat onze consulenten <strong>brieven schrijven en belletjes doen</strong> namens jou?
              </p>
              <div className="my-4 rounded-xl bg-white/90 border border-amber-200 p-3 text-xs text-[#141413]">
                <div className="flex justify-between font-semibold">
                  <span>Urgentie Tarief:</span>
                  <span className="text-primary font-bold">Vanaf € 500,- / mnd</span>
                </div>
                <p className="text-[11px] text-[#6c6a64] mt-1">
                  Dit bedrag gaat 100% in je account als <strong>dienstentegoed</strong> voor uithandenname.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlanTab("zakelijk")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <span>Bekijk Zakelijke Urgentie</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Legal Framework Card */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#141413] mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Juridisch Gewaarborgd</span>
              </div>
              <p className="text-xs text-[#6c6a64] leading-relaxed">
                Het Immigratiepunt-model is getoetst aan de Wet basisregistratie personen (Wet BRP). Zowel nieuwkomers als briefadresgevers genieten volledige wettelijke bescherming.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: VOOR HULPVERLENERS / POSTADRES-HELPERS                 */}
      {/* ------------------------------------------------------------- */}
      {selectedPlanTab === "helper" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Postadres-Helper Vrijwilligersprogramma
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
                    Bijdrage & Vergoedingenstructuur
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-blue-600">€ 5,-</span>
                    <span className="text-xs text-[#6c6a64] font-medium">/ maand</span>
                  </div>
                  <span className="text-[11px] text-[#8c887f] block">Vrijwillige Platformgift</span>
                </div>
              </div>

              {/* Explanation of the € 5 donation */}
              <div className="mt-5 rounded-xl bg-blue-50/70 border border-blue-200 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-1">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span>Waarom een maandelijkse gift van € 5,-?</span>
                </div>
                <p className="text-xs text-[#3d3d3a] leading-relaxed">
                  Als helper lever je een onbetaalbare maatschappelijke bijdrage door iemand aan een BSN te helpen. Met de maandelijkse gift van € 5,- ondersteun je de operationele kosten van ons platform, zoals screening, dossiercontrole en de beveiligde postinbox.
                </p>
              </div>

              {/* Recouping the gift through mail fees */}
              <div className="mt-6 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-[#141413]">
                    Het Terugverdienmodel: € 0,50 tot € 5,- per brief
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                    Netto Positief
                  </span>
                </div>
                <p className="text-xs text-[#6c6a64] leading-relaxed mb-4">
                  Voor elk officieel poststuk dat je registreert in het portaal, ontvang je een staffelvergoeding:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-white border border-[#e6dfd8] p-3 text-center">
                    <div className="text-lg font-bold text-primary">€ 0,50</div>
                    <div className="text-[11px] text-[#6c6a64]">Standaard brief</div>
                  </div>
                  <div className="rounded-lg bg-white border border-[#e6dfd8] p-3 text-center">
                    <div className="text-lg font-bold text-primary">€ 2,50</div>
                    <div className="text-[11px] text-[#6c6a64]">Aangetekend stuk</div>
                  </div>
                  <div className="rounded-lg bg-white border border-[#e6dfd8] p-3 text-center">
                    <div className="text-lg font-bold text-emerald-600">€ 5,00</div>
                    <div className="text-[11px] text-[#6c6a64]">Spoed/Pakketmelding</div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-emerald-100/60 p-3 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Voorbeeld:</strong> Met slechts 2 à 3 brieven per maand heb je de gift van € 5,- al volledig terugverdiend en hou je extra vergoeding over!
                  </span>
                </div>
              </div>
            </div>

            {/* Helper status */}
            <div className="mt-6 pt-4 border-t border-[#f0eae1] flex items-center justify-between text-xs">
              <span className="text-[#6c6a64]">
                Status bijdrage: <strong className="text-blue-700">Actief via SEPA (€ 5,- / mnd)</strong>
              </span>
              <span className="text-[11px] text-[#8c887f]">Maandelijks opzegbaar</span>
            </div>
          </div>

          {/* Legal guarantees for helpers */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#141413]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Veilig voor de Helper</span>
              </div>
              <ul className="space-y-3 text-xs text-[#3d3d3a]">
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Geen medebewoner:</strong> Een briefadres telt niet mee voor de afvalstoffenheffing of gemeentelijke belastingen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Geen invloed op toeslagen:</strong> Jouw huurtoeslag, zorgtoeslag of eventuele bijstandsuitkering blijven onaangeroerd.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Geen post openmaken:</strong> Je hoeft brieven nooit te openen, enkel afzender inloggen en klaar.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ZAKELIJKE URGENTIE REGELING (€ 500+/MND)               */}
      {/* ------------------------------------------------------------- */}
      {selectedPlanTab === "zakelijk" && (
        <div className="space-y-6">
          {/* Hero Banner for Urgentie Regeling */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-linear-to-r from-amber-50 via-white to-amber-100/40 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>Zakelijke Urgentie Regeling • Vanaf € 500,- per maand</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413]">
                  Volledig Uit Handen Nemen van Werk, Woning, Bank & BSN
                </h3>
                <p className="mt-2 text-xs md:text-sm text-[#3d3d3a] leading-relaxed">
                  Speciaal voor wie geen tijd heeft voor bureaucratische vertraging. Het abonnementsbedrag (vanaf € 500,- per maand) gaat rechtstreeks in je account als <strong>dienstentegoed</strong> en wordt ingezet om zaken direct uit handen te nemen: wij schrijven officiële brieven, doen telefoontjes namens jou en ontzorgen je compleet.
                </p>
              </div>

              {/* Wallet Summary Card */}
              <div className="rounded-2xl border border-amber-300 bg-white p-5 shadow-sm min-w-[260px]">
                <div className="flex items-center justify-between text-xs text-[#6c6a64] mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-[#141413]">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span>Dienstensaldo Wallet</span>
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    Direct Besteedbaar
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-[#141413] my-2">
                  € {subscription.walletBalance.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#8c887f] mb-3">
                  Totaal uitgegeven aan diensten: € {(subscription.spentOnServices || 0).toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Saldo Opwaarderen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-white transition-colors"
                  >
                    <Send className="h-3.5 w-3.5 text-primary" />
                    <span>Nieuwe Aanvraag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Urgentie Regeling */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#141413]">Werk via Djobba</h4>
              <p className="text-xs text-[#6c6a64] mt-1 leading-relaxed">
                Spoedmatching voor internationale talenten, CAO-advies en juridische arbeidscontractcontrole.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
                <Home className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#141413]">Huis via WoningVry</h4>
              <p className="text-xs text-[#6c6a64] mt-1 leading-relaxed">
                Prioritaire bezichtigingen, screening huurovereenkomsten en bescherming tegen malafide verhuurders.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-3">
                <Landmark className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#141413]">Bank via Xabi World</h4>
              <p className="text-xs text-[#6c6a64] mt-1 leading-relaxed">
                Spoed-IBAN binnen 24-48 uur met iDEAL en assistentie bij DigiD-koppeling.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-3">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#141413]">BSN & Gemeente</h4>
              <p className="text-xs text-[#6c6a64] mt-1 leading-relaxed">
                Wettelijk briefadres conform Art. 2.45 Wet BRP en versnelde afspraakplanning bij Burgerzaken.
              </p>
            </div>
          </div>

          {/* Services Available via Wallet */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="font-bold text-lg text-[#141413]">
                  Wat nemen wij direct voor jou uit handen?
                </h4>
                <p className="text-xs text-[#6c6a64]">
                  Besteed je accountsaldo aan gerichte acties van onze juridische en administratieve consulenten.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Dienst Aanvragen</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm text-primary">€ 45,-</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#141413]">Brieven Schrijven</h5>
                  <p className="text-[11px] text-[#6c6a64] mt-1 leading-relaxed">
                    Formele juridische brieven, bezwaarschriften of toelichtingen naar Gemeente, IND, Belastingdienst of verhuurder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReqType("brief_schrijven");
                    setShowRequestModal(true);
                  }}
                  className="mt-3 w-full rounded-lg bg-white border border-[#e6dfd8] py-1.5 text-xs font-semibold text-[#141413] hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  Brief Laten Opstellen
                </button>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <PhoneCall className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm text-emerald-700">€ 35,-</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#141413]">Belletjes Doen</h5>
                  <p className="text-[11px] text-[#6c6a64] mt-1 leading-relaxed">
                    Telefonische interventie namens jou met instanties, stadsloketten, werkgevers of makelaars in vloeiend Nederlands.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReqType("belletje_doen");
                    setShowRequestModal(true);
                  }}
                  className="mt-3 w-full rounded-lg bg-white border border-[#e6dfd8] py-1.5 text-xs font-semibold text-[#141413] hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
                >
                  Telefoontje Laten Plegen
                </button>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm text-blue-700">€ 65,-</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#141413]">Dossierscreening</h5>
                  <p className="text-[11px] text-[#6c6a64] mt-1 leading-relaxed">
                    Juridische screening van huurovereenkomsten op servicekosten en oneerlijke bedingen, of arbeidscontract controle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReqType("dossier_screening");
                    setShowRequestModal(true);
                  }}
                  className="mt-3 w-full rounded-lg bg-white border border-[#e6dfd8] py-1.5 text-xs font-semibold text-[#141413] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  Screening Aanvragen
                </button>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                      <Building className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm text-purple-700">€ 120,-</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#141413]">Loket Escort & Regeling</h5>
                  <p className="text-[11px] text-[#6c6a64] mt-1 leading-relaxed">
                    Directe afspraakplanning bij gemeente of IND, inclusief telefonische intakevoorbereiding en documentklaarmaking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReqType("loket_begeleiding");
                    setShowRequestModal(true);
                  }}
                  className="mt-3 w-full rounded-lg bg-white border border-[#e6dfd8] py-1.5 text-xs font-semibold text-[#141413] hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                  Afspraak Laten Regelen
                </button>
              </div>
            </div>
          </div>

          {/* Active Urgentie Requests History */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h4 className="font-bold text-base text-[#141413] mb-4">
              Jouw Aangevraagde Uithandename Taken ({urgentieRequests.length})
            </h4>

            {urgentieRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#8c887f]">
                Nog geen uithandename taken aangevraagd. Gebruik de knoppen hierboven om een brief of belletje in te dienen.
              </div>
            ) : (
              <div className="space-y-3">
                {urgentieRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 transition-all hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        req.type === "brief_schrijven"
                          ? "bg-primary/10 text-primary"
                          : req.type === "belletje_doen"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {req.type === "brief_schrijven" ? (
                          <FileText className="h-4 w-4" />
                        ) : req.type === "belletje_doen" ? (
                          <PhoneCall className="h-4 w-4" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#141413]">{req.title}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            req.status === "afgerond"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}>
                            {req.status === "afgerond" ? "Afgerond" : "In Behandeling"}
                          </span>
                        </div>
                        <p className="text-xs text-[#6c6a64] mt-0.5 max-w-xl leading-relaxed">
                          {req.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#8c887f]">
                          <span>Instantie: <strong className="text-[#3d3d3a]">{req.targetOrganization}</strong></span>
                          <span>Ingehouden: <strong className="text-primary font-bold">€ {req.cost},-</strong></span>
                          <span>Datum: {new Date(req.createdAt).toLocaleDateString("nl-NL")}</span>
                        </div>

                        {req.responseNotes && (
                          <div className="mt-2.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-900">
                            <strong>Terugkoppeling consulent:</strong> {req.responseNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: Saldo Opwaarderen (Wallet Top-Up)                     */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#141413]">
              <Wallet className="h-5 w-5 text-primary" />
              <span>Dienstensaldo Opwaarderen</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Voeg tegoed toe aan je account voor het uit handen nemen van brieven, belletjes en spoedafspraken.
            </DialogDescription>
          </DialogHeader>

          {topUpSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm">Saldo Succesvol Opgewaardeerd!</h4>
              <p className="text-xs mt-1">€ {topUpAmount},- is bijgeschreven op je dienstentegoed.</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      topUpAmount === amt
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:bg-white"
                    }`}
                  >
                    <div className="text-lg font-extrabold">€ {amt},-</div>
                    <div className="text-[10px] text-[#6c6a64]">
                      {amt === 500 ? "Standaard Urgentie" : amt === 1000 ? "Volledige Ontzorging" : "Basis Tegoed"}
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs text-[#3d3d3a]">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Geselecteerd bedrag:</span>
                  <span className="text-primary font-bold">€ {topUpAmount},-</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6c6a64]">
                  <span>Betaalmethode:</span>
                  <span>iDEAL / Zakelijke Overboeking</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTopUp}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Bevestig Opwaardering (€ {topUpAmount},-)</span>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: Nieuwe Urgentie Dienst Aanvragen                     */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#141413]">
              <Send className="h-5 w-5 text-primary" />
              <span>Dienst Uit Handen Laten Nemen</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Onze consulenten gaan direct namens jou aan de slag. Het tarief wordt automatisch ingehouden op je accountsaldo.
            </DialogDescription>
          </DialogHeader>

          {reqSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm">Aanvraag Succesvol Ingediend!</h4>
              <p className="text-xs mt-1">Een consulent neemt dit dossier binnen 2 uur in behandeling.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateRequest} className="space-y-4 py-2">
              {reqError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{reqError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141413] block mb-1.5">
                  Wat wil je laten doen?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReqType("brief_schrijven")}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      reqType === "brief_schrijven"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a]"
                    }`}
                  >
                    <div className="font-semibold">✍️ Brief Schrijven</div>
                    <div className="text-[11px] text-[#6c6a64]">€ 45,- van saldo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReqType("belletje_doen")}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      reqType === "belletje_doen"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a]"
                    }`}
                  >
                    <div className="font-semibold">📞 Belletje Doen</div>
                    <div className="text-[11px] text-[#6c6a64]">€ 35,- van saldo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReqType("dossier_screening")}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      reqType === "dossier_screening"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a]"
                    }`}
                  >
                    <div className="font-semibold">📋 Contractscreening</div>
                    <div className="text-[11px] text-[#6c6a64]">€ 65,- van saldo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReqType("loket_begeleiding")}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      reqType === "loket_begeleiding"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a]"
                    }`}
                  >
                    <div className="font-semibold">🏛️ Loket Escort</div>
                    <div className="text-[11px] text-[#6c6a64]">€ 120,- van saldo</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141413] block mb-1">
                  Betreffende Instantie / Organisatie
                </label>
                <select
                  value={reqOrg}
                  onChange={(e) => setReqOrg(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413] focus:bg-white focus:outline-none"
                >
                  <option value="Gemeente Amsterdam (Burgerzaken)">Gemeente Amsterdam (Burgerzaken)</option>
                  <option value="Gemeente Rotterdam">Gemeente Rotterdam</option>
                  <option value="Gemeente Utrecht">Gemeente Utrecht</option>
                  <option value="Gemeente Den Haag">Gemeente Den Haag</option>
                  <option value="Immigratie- en Naturalisatiedienst (IND)">Immigratie- en Naturalisatiedienst (IND)</option>
                  <option value="Belastingdienst">Belastingdienst</option>
                  <option value="Woningcorporatie / Particuliere Verhuurder">Woningcorporatie / Particuliere Verhuurder</option>
                  <option value="Werkgever / Recruitmentbureau">Werkgever / Recruitmentbureau</option>
                  <option value="Bank / Xabi World">Bank / Xabi World</option>
                  <option value="Anders">Anders</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141413] block mb-1">
                  Korte Titel
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bijv. Bezwaar leges of Nabellen IND status"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141413] block mb-1">
                  Gedetailleerde Instructie / Omschrijving
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wat moeten we precies vragen, schrijven of navragen? Vermeld eventuele dossier- of referentienummers..."
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs">
                <div>
                  <span className="text-[#6c6a64] block">Kosten van deze actie:</span>
                  <strong className="text-primary text-sm">€ {costMap[reqType]},-</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#6c6a64] block">Beschikbaar saldo:</span>
                  <strong className="text-emerald-700">€ {subscription.walletBalance.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Dienst Nu Indienen & Starten</span>
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: Verplichte Onboarding & Psychologische Welzijnstest   */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={showOnboardingModal} onOpenChange={setShowOnboardingModal}>
        <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#141413]">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span>Verplichte Immigranten Onboarding & Welzijnstest</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Conform het platformreglement van Immigratiepunt rondt elke nieuwkomer de situatie- en welzijnstest af om een verantwoorde koppeling te waarborgen.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Bar */}
          <div className="my-2 flex items-center justify-between border-b border-[#f0eae1] pb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setOnboardingStep(1)}
              className={`flex items-center gap-1.5 ${
                onboardingStep === 1 ? "text-primary font-bold" : "text-[#6c6a64]"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                onboardingStep === 1 ? "bg-primary text-white" : "bg-[#f0eae1] text-[#141413]"
              }`}>1</span>
              <span>Intake Vragenlijst</span>
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep(2)}
              className={`flex items-center gap-1.5 ${
                onboardingStep === 2 ? "text-primary font-bold" : "text-[#6c6a64]"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                onboardingStep === 2 ? "bg-primary text-white" : "bg-[#f0eae1] text-[#141413]"
              }`}>2</span>
              <span>Psychologische Test</span>
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep(3)}
              className={`flex items-center gap-1.5 ${
                onboardingStep === 3 ? "text-primary font-bold" : "text-[#6c6a64]"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                onboardingStep === 3 ? "bg-primary text-white" : "bg-[#f0eae1] text-[#141413]"
              }`}>3</span>
              <span>Afronding & Verificatie</span>
            </button>
          </div>

          {onboardingSaved ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900 my-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg">Onboarding Succesvol Voltooid!</h4>
              <p className="text-xs text-[#3d3d3a] mt-1 max-w-md mx-auto leading-relaxed">
                Bedankt voor het invullen van de vragenlijsten en welzijnstest. Jouw dossier is nu officieel vrijgegeven voor de toewijzing van een postadres-helper en de BSN-afspraak bij Burgerzaken.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* STAP 1: INTAKE VRAGENLIJST */}
              {onboardingStep === 1 && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#141413] block mb-1">
                        Land van herkomst
                      </label>
                      <input
                        type="text"
                        value={onboardingForm.originCountry}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, originCountry: e.target.value })}
                        className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#141413] block mb-1">
                        Voorkeurstaal voor begeleiding
                      </label>
                      <select
                        value={onboardingForm.preferredLanguage}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, preferredLanguage: e.target.value })}
                        className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                      >
                        <option value="Nederlands">Nederlands</option>
                        <option value="Engels">Engels</option>
                        <option value="Arabisch / Engels">Arabisch / Engels</option>
                        <option value="Oekraïens / Russisch">Oekraïens / Russisch</option>
                        <option value="Spaans">Spaans</option>
                        <option value="Turks">Turks</option>
                        <option value="Duits">Duits</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1">
                      Hoofddoel van je verblijf in Nederland
                    </label>
                    <select
                      value={onboardingForm.stayGoal}
                      onChange={(e) => setOnboardingForm({ ...onboardingForm, stayGoal: e.target.value })}
                      className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                    >
                      <option value="Arbeid & Vestiging">Arbeid & Professionele Vestiging</option>
                      <option value="Studie / Academisch">Studie / Academische Opleiding</option>
                      <option value="Gezinshereniging">Gezinshereniging</option>
                      <option value="Bescherming & Humanitair">Bescherming / Humanitaire Opvang</option>
                      <option value="Ondernemerschap / Startup">Ondernemerschap & Startup</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1">
                      Huidige Woonsituatie
                    </label>
                    <input
                      type="text"
                      value={onboardingForm.currentHousing}
                      onChange={(e) => setOnboardingForm({ ...onboardingForm, currentHousing: e.target.value })}
                      placeholder="Bijv. Tijdelijk bij vrienden, hotel, overbrugging..."
                      className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#141413] block mb-1">
                        Huidige BSN Status
                      </label>
                      <select
                        value={onboardingForm.bsnStatus}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, bsnStatus: e.target.value })}
                        className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                      >
                        <option value="Nog geen BSN afspraak">Nog geen BSN afspraak</option>
                        <option value="Afspraak ingepland bij Burgerzaken">Afspraak ingepland bij Burgerzaken</option>
                        <option value="Al in bezit van BSN">Al in bezit van BSN</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#141413] block mb-1">
                        Heb je al een Nederlandse betaalrekening?
                      </label>
                      <select
                        value={onboardingForm.hasDutchBank ? "ja" : "nee"}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, hasDutchBank: e.target.value === "ja" })}
                        className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                      >
                        <option value="nee">Nee, hulp nodig via Xabi World (48u IBAN)</option>
                        <option value="ja">Ja, reeds in bezit van een NL IBAN</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                    >
                      <span>Volgende: Psychologische Test</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAP 2: PSYCHOLOGISCHE & WELZIJNSTEST */}
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-purple-50/70 border border-purple-200 p-3.5 text-xs text-purple-900 leading-relaxed">
                    <strong>Welzijnscheck:</strong> Verhuizen naar een nieuw land kan gepaard gaan met stress, cultuurschok en administratieve druk. Deze vragen stellen ons in staat om de juiste consulent en het gewenste begeleidingstempo in te zetten.
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#141413] mb-1.5">
                      <span>Ervaren stress- en drukniveau rondom verhuizing & regels</span>
                      <span className="text-primary font-bold">{onboardingForm.stressLevel} / 5</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setOnboardingForm({ ...onboardingForm, stressLevel: lvl })}
                          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                            onboardingForm.stressLevel === lvl
                              ? "bg-primary text-white"
                              : "border border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:bg-white"
                          }`}
                        >
                          {lvl} {lvl === 1 ? "(Laag)" : lvl === 5 ? "(Hoog)" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#141413] mb-1.5">
                      <span>Aanpassingsvermogen & vertrouwen in de Nederlandse maatschappij</span>
                      <span className="text-emerald-700 font-bold">{onboardingForm.adaptationComfort} / 5</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setOnboardingForm({ ...onboardingForm, adaptationComfort: lvl })}
                          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                            onboardingForm.adaptationComfort === lvl
                              ? "bg-emerald-600 text-white"
                              : "border border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:bg-white"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1">
                      Gewenste Begeleidingsintensiteit
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "zelfstandig", label: "Zelfstandig", desc: "Enkel briefadres & online portal" },
                        { id: "lichte_coaching", label: "Lichte Coaching", desc: "Wekelijks contact met adviseur" },
                        { id: "intensieve_begeleiding", label: "Volledig Ontzorgd", desc: "Urgentie traject & bellen namens jou" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setOnboardingForm({
                            ...onboardingForm,
                            supportIntensity: item.id as OnboardingData["supportIntensity"]
                          })}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            onboardingForm.supportIntensity === item.id
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a]"
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-[10px] text-[#6c6a64] mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1">
                      Zijn er specifieke zorgen of persoonlijke omstandigheden waar we rekening mee moeten houden?
                    </label>
                    <textarea
                      rows={2}
                      value={onboardingForm.additionalNotes || ""}
                      onChange={(e) => setOnboardingForm({ ...onboardingForm, additionalNotes: e.target.value })}
                      placeholder="Optioneel: Gezinssituatie, medische behoeften, specifieke taalhulp..."
                      className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413]"
                    />
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(1)}
                      className="rounded-xl border border-[#e6dfd8] px-4 py-2 text-xs font-semibold text-[#3d3d3a]"
                    >
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(3)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                    >
                      <span>Volgende: Afronding</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAP 3: AFRONDING & CERTIFICERING */}
              {onboardingStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Klaar voor Definitieve Verificatie</span>
                    </div>
                    <p className="text-xs text-[#3d3d3a] leading-relaxed">
                      Hieronder zie je het overzicht van jouw intake en welzijnsmeting. Door op bevestigen te klikken wordt jouw onboarding formeel afgerond en vrijgegeven voor jouw consulent.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                      <span className="text-[#6c6a64]">Land van herkomst:</span>
                      <strong className="text-[#141413]">{onboardingForm.originCountry}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                      <span className="text-[#6c6a64]">Voorkeurstaal:</span>
                      <strong className="text-[#141413]">{onboardingForm.preferredLanguage}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                      <span className="text-[#6c6a64]">Hoofddoel:</span>
                      <strong className="text-[#141413]">{onboardingForm.stayGoal}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                      <span className="text-[#6c6a64]">Ervaren stressniveau:</span>
                      <strong className="text-primary">{onboardingForm.stressLevel} / 5</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6c6a64]">Begeleidingsintensiteit:</span>
                      <strong className="text-emerald-700 capitalize">{onboardingForm.supportIntensity.replace("_", " ")}</strong>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="rounded-xl border border-[#e6dfd8] px-4 py-2 text-xs font-semibold text-[#3d3d3a]"
                    >
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOnboarding}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      <span>Bevestig & Rond Onboarding Af</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
