import { useState } from "react";
import {
  Coins,
  Plus,
  CreditCard,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Users,
  Settings,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Check,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Member } from "@/lib/auth";
import {
  LetterLogDoc,
  HelperSettings,
  PayoutRecord,
  logLetter,
  updateLetterStatus,
  saveHelperSettings,
  requestPayout,
} from "@/lib/firebase";

interface HelperPortalProps {
  member: Member;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  letters: LetterLogDoc[];
  setLetters: React.Dispatch<React.SetStateAction<LetterLogDoc[]>>;
  helperSettings: HelperSettings;
  setHelperSettings: React.Dispatch<React.SetStateAction<HelperSettings>>;
  payouts: PayoutRecord[];
  setPayouts: React.Dispatch<React.SetStateAction<PayoutRecord[]>>;
}

export default function HelperPortal({
  member,
  activeTab,
  setActiveTab,
  letters,
  setLetters,
  helperSettings,
  setHelperSettings,
  payouts,
  setPayouts,
}: HelperPortalProps) {
  // Modal state for logging new letter
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [newLetterSender, setNewLetterSender] = useState("");
  const [newLetterRecipient, setNewLetterRecipient] = useState("Fatima Al-Mansoor");
  const [newLetterNotes, setNewLetterNotes] = useState("");

  // Payout action state
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search & filter state
  const [searchLetter, setSearchLetter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculator slider state
  const [calcLetters, setCalcLetters] = useState<number>(10);

  // Helper settings form state
  const [street, setStreet] = useState(helperSettings.street || "Hoofdstraat");
  const [houseNumber, setHouseNumber] = useState(helperSettings.houseNumber || "42");
  const [postalCode, setPostalCode] = useState(helperSettings.postalCode || "1011 AA");
  const [city, setCity] = useState(helperSettings.city || "Amsterdam");
  const [maxCapacity, setMaxCapacity] = useState(helperSettings.maxCapacity || 2);
  const [isAvailable, setIsAvailable] = useState(helperSettings.isAvailable ?? true);
  const [iban, setIban] = useState(helperSettings.iban || "NL91 ABNA 0412 3456 78");
  const [accountHolder, setAccountHolder] = useState(helperSettings.accountHolder || "J. de Vries");

  // Calculations for current month
  const letterCount = Math.max(letters.length, 7);
  const letterRate = letterCount >= 8 ? 4.0 : letterCount >= 4 ? 2.5 : 1.5;
  const grossCompensation = letterCount * letterRate;
  const monthlyDonation = 5.0;
  const netEarnings = Math.max(0, grossCompensation - monthlyDonation);

  // Calculator dynamic earnings
  const calcRate = calcLetters >= 8 ? 4.0 : calcLetters >= 4 ? 2.5 : 1.5;
  const calcGross = calcLetters * calcRate;
  const calcNet = Math.max(0, calcGross - 5.0);

  const handleAddLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetterSender.trim() || !newLetterRecipient.trim()) return;

    const saved = await logLetter(
      member.email,
      newLetterSender.trim(),
      newLetterRecipient.trim(),
      newLetterNotes.trim() || undefined
    );

    setLetters((prev) => [saved, ...prev]);
    setNewLetterSender("");
    setNewLetterNotes("");
    setShowLetterModal(false);
  };

  const handleStatusChange = (letterId: string, status: "binnengekomen" | "doorgestuurd" | "opgehaald") => {
    updateLetterStatus(letterId, status);
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, status } : l))
    );
  };

  const handleRequestPayout = () => {
    if (netEarnings <= 0) return;
    const rec = requestPayout(member.email, netEarnings, letterCount, iban);
    setPayouts((prev) => [rec, ...prev]);
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 4500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HelperSettings = {
      email: member.email,
      street,
      houseNumber,
      postalCode,
      city,
      maxCapacity,
      isAvailable,
      iban,
      accountHolder,
    };
    saveHelperSettings(updated);
    setHelperSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filteredLetters = letters.filter((l) => {
    const matchesFilter = statusFilter === "all" || (l.status || "binnengekomen") === statusFilter;
    const matchesSearch =
      searchLetter === "" ||
      l.sender.toLowerCase().includes(searchLetter.toLowerCase()) ||
      l.recipientName.toLowerCase().includes(searchLetter.toLowerCase()) ||
      (l.notes && l.notes.toLowerCase().includes(searchLetter.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. OVERZICHT (DASHBOARD)                                       */}
      {/* ============================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Financial Highlight Card */}
          <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50/60 via-white to-emerald-50/20 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <Coins className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#141413]">
                      Jouw Postvergoeding & Uitbetaling
                    </h2>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Tier 2 Helper
                    </span>
                  </div>
                  <p className="text-xs text-[#6c6a64]">
                    Geregistreerd briefadres: <strong className="text-[#141413]">{street} {houseNumber}, {city}</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                >
                  <Plus className="h-4 w-4" />
                  + Brief Registreren
                </button>
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={netEarnings <= 0}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3.5 text-xs font-semibold text-[#141413] hover:bg-[#efe9de] disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4 text-[#6c6a64]" />
                  Nu Uitbetalen
                </button>
              </div>
            </div>

            {payoutSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Uitbetalingsverzoek van <strong>€ {netEarnings.toFixed(2)}</strong> succesvol ingediend! Het bedrag wordt binnen 2 werkdagen overgemaakt naar {iban}.
                </span>
              </div>
            )}

            {/* 4 Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                <div className="text-xs font-medium text-[#6c6a64]">Verwerkt Deze Maand</div>
                <div className="mt-1 text-2xl font-bold text-[#141413]">{letterCount}</div>
                <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                  Tarief: €{letterRate.toFixed(2)} / poststuk
                </div>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                <div className="text-xs font-medium text-[#6c6a64]">Bruto Vergoeding</div>
                <div className="mt-1 text-2xl font-bold text-emerald-700">€ {grossCompensation.toFixed(2)}</div>
                <div className="text-[11px] text-[#6c6a64] mt-0.5">{letterCount} brieven × €{letterRate.toFixed(2)}</div>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                <div className="text-xs font-medium text-[#6c6a64]">Maandelijkse Donatie</div>
                <div className="mt-1 text-2xl font-bold text-[#6c6a64]">- € 5,00</div>
                <div className="text-[11px] text-[#8c887f] mt-0.5">Vast steunbedrag programma</div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                <div className="text-xs font-medium text-emerald-900">Netto Te Ontvangen</div>
                <div className="mt-1 text-2xl font-bold text-primary">+ € {netEarnings.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-800 font-medium mt-0.5">Direct overdraagbaar</div>
              </div>
            </div>
          </div>

          {/* Capacity & Matched Newcomer Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Capacity Card */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-700" />
                  <h3 className="font-bold text-sm text-[#141413]">Capaciteit & Beschikbaarheid</h3>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"}`}>
                  {isAvailable ? "Actief Open" : "Gepauzeerd"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#3d3d3a]">
                  <span>Plaatsen in gebruik:</span>
                  <strong className="text-[#141413]">1 van de {maxCapacity} plaatsen bezet (50%)</strong>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: "50%" }} />
                </div>
                <p className="text-xs text-[#6c6a64] leading-relaxed pt-1">
                  Je kunt maximaal {maxCapacity} nieuwkomers tegelijk aan je postadres koppelen. Dit zorgt ervoor dat je postvolume beheersbaar blijft.
                </p>
              </div>

              <div className="pt-2 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Wijzig adres of capaciteit <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Matched Newcomer Card */}
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-bold text-sm text-[#141413]">Gekoppelde Nieuwkomer</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Postadres Actief
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-900 text-sm">
                  FA
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-[#141413]">Fatima Al-Mansoor</div>
                  <div className="text-xs text-[#6c6a64]">Herkomst: Syrië • Doel: BSN Gemeente Amsterdam</div>
                  <div className="text-[11px] text-[#8c887f]">Gekoppeld sinds 3 weken • 7 poststukken verwerkt</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("nieuwkomers")}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Bekijk volledig dossier <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLetterModal(true)}
                  className="rounded-lg bg-[#faf9f5] border border-[#e6dfd8] px-2.5 py-1 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                >
                  + Poststuk voor Fatima
                </button>
              </div>
            </div>
          </div>

          {/* Helper Subscription & Platform Gift Card */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#141413]">Abonnement & Platformgift</span>
                    <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                      € 5,- / maand
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      Terugverdiend via postvergoeding
                    </span>
                  </div>
                  <p className="text-xs text-[#6c6a64] mt-1 max-w-2xl leading-relaxed">
                    Jouw maandelijkse gift van € 5,- financiert de screening, juridische validatie en veilige postlogging. Met de vergoeding van € 0,50 tot € 5,- per ontvangen brief verdien je deze gift met 2 à 3 brieven al volledig terug!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("subscription")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Bekijk Abonnement & Gift</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Letters Preview */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#141413]">Laatst Ontvangen Poststukken</h3>
                <p className="text-xs text-[#6c6a64]">Recente correspondentie die op jouw adres is binnengekomen</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("post")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Volledig postarchief ({letters.length}) <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {letters.slice(0, 3).map((l, i) => (
                <div
                  key={l.id || i}
                  className="flex items-center justify-between rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-[#141413]">{l.sender}</div>
                      <div className="text-[11px] text-[#6c6a64]">Voor: {l.recipientName} • {l.dateReceived}</div>
                    </div>
                  </div>
                  <span className="rounded bg-white border border-[#e6dfd8] px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                    {l.status || "binnengekomen"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. POST REGISTRATIE & BEHEER                                   */}
      {/* ============================================================== */}
      {activeTab === "post" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Poststukken Beheer & Archief ({letters.length})
                </h3>
                <p className="text-xs text-[#6c6a64]">
                  Registreer elk binnengekomen poststuk direct om je maandelijkse vergoeding te verhogen
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLetterModal(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
              >
                <Plus className="h-4 w-4" />
                + Brief Registreren
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Zoek op afzender, nieuwkomer of notitie..."
                  value={searchLetter}
                  onChange={(e) => setSearchLetter(e.target.value)}
                  className="h-8 w-64 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-1.5 text-xs">
                {["all", "binnengekomen", "doorgestuurd", "opgehaald"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      statusFilter === st
                        ? "bg-[#141413] text-white"
                        : "border border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:bg-[#efe9de]"
                    }`}
                  >
                    {st === "all" ? "Alle statussen" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Letters List */}
            <div className="space-y-3">
              {filteredLetters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Geen poststukken gevonden voor deze zoekopdracht.
                </div>
              ) : (
                filteredLetters.map((l, i) => (
                  <div
                    key={l.id || i}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5 text-xs transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#141413]">{l.sender}</div>
                        <div className="text-[11px] text-[#6c6a64]">
                          Voor: <strong className="text-[#141413]">{l.recipientName}</strong> {l.notes ? `• ${l.notes}` : ""}
                        </div>
                        <div className="text-[10px] text-[#8c887f]">Ontvangen op: {l.dateReceived}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={l.status || "binnengekomen"}
                        onChange={(e) =>
                          handleStatusChange(
                            l.id || "",
                            e.target.value as "binnengekomen" | "doorgestuurd" | "opgehaald"
                          )
                        }
                        className="h-8 rounded-lg border border-[#e6dfd8] bg-white px-2.5 text-xs text-[#141413] outline-none font-medium"
                      >
                        <option value="binnengekomen">Binnengekomen</option>
                        <option value="doorgestuurd">Doorgestuurd</option>
                        <option value="opgehaald">Opgehaald</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. VERGOEDINGEN & UITBETALINGEN                                */}
      {/* ============================================================== */}
      {activeTab === "financien" && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#141413] mb-1">
              Hoe Werkt de Postvergoeding?
            </h3>
            <p className="text-xs text-[#6c6a64] max-w-2xl leading-relaxed mb-4">
              Als postadres-helper ontvang je een eerlijke beloning voor het ontvangen en veilig bewaren van officiële brieven. De vergoeding groeit naarmate je meer post verwerkt.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5 text-xs">
                <div className="font-bold text-blue-900">Tier 1 (1 - 3 brieven)</div>
                <div className="text-xl font-bold text-[#141413] my-1">€ 1,50 <span className="text-xs font-normal text-[#6c6a64]">/ brief</span></div>
                <div className="text-[11px] text-[#6c6a64]">Ideaal voor een rustige start</div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs">
                <div className="font-bold text-blue-900">Tier 2 (4 - 7 brieven)</div>
                <div className="text-xl font-bold text-blue-800 my-1">€ 2,50 <span className="text-xs font-normal text-[#6c6a64]">/ brief</span></div>
                <div className="text-[11px] text-blue-700 font-medium">Jouw huidige niveau!</div>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5 text-xs">
                <div className="font-bold text-emerald-900">Tier 3 (8+ brieven)</div>
                <div className="text-xl font-bold text-emerald-700 my-1">€ 4,00 - € 5,00</div>
                <div className="text-[11px] text-[#6c6a64]">Maximale vergoeding per stuk</div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h4 className="font-bold text-sm text-[#141413] mb-2">
              Bereken Jouw Maandopbrengst
            </h4>
            <div className="space-y-4 max-w-xl">
              <div>
                <div className="flex justify-between text-xs text-[#3d3d3a] mb-1">
                  <span>Aantal verwachte poststukken per maand:</span>
                  <strong className="text-base text-primary">{calcLetters} brieven</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={calcLetters}
                  onChange={(e) => setCalcLetters(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 text-xs grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[#6c6a64]">Bruto opbrengst</div>
                  <div className="text-base font-bold text-[#141413] mt-1">€ {calcGross.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[#6c6a64]">Programma donatie</div>
                  <div className="text-base font-bold text-[#6c6a64] mt-1">- € 5,00</div>
                </div>
                <div className="border-l border-[#e6dfd8]">
                  <div className="text-emerald-800 font-semibold">Netto op je rekening</div>
                  <div className="text-base font-bold text-emerald-700 mt-1">+ € {calcNet.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout History */}
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h4 className="font-bold text-sm text-[#141413] mb-3">
              Historie van Uitbetalingen ({payouts.length})
            </h4>

            <div className="space-y-2.5">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-[#141413]">€ {p.amount.toFixed(2)}</div>
                      <div className="text-[11px] text-[#6c6a64]">
                        {p.letterCount} brieven • Rekening: {p.iban}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#8c887f]">{p.date}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        p.status === "uitbetaald" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. GEKOPPELDE NIEUWKOMERS                                      */}
      {/* ============================================================== */}
      {activeTab === "nieuwkomers" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#141413] mb-1">
              Gekoppelde Nieuwkomers aan Jouw Adres
            </h3>
            <p className="text-xs text-[#6c6a64] mb-4">
              Overzicht van nieuwkomers die jouw adres momenteel als officieel correspondentieadres gebruiken.
            </p>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-900">
                    FA
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#141413]">Fatima Al-Mansoor</h4>
                    <p className="text-xs text-[#6c6a64]">Herkomst: Syrië • Leeftijd: 28 • Doel: BSN & Werk</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Actief Gekoppeld
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
                <div className="rounded-lg bg-white p-3 border border-[#e6dfd8]">
                  <div className="text-[11px] text-[#6c6a64]">Ontvangen brieven:</div>
                  <div className="font-bold text-[#141413] text-sm mt-0.5">{letters.length} poststukken</div>
                </div>
                <div className="rounded-lg bg-white p-3 border border-[#e6dfd8]">
                  <div className="text-[11px] text-[#6c6a64]">BSN Afspraak:</div>
                  <div className="font-bold text-[#141413] text-sm mt-0.5">24 okt 2026 (Stadsloket)</div>
                </div>
                <div className="rounded-lg bg-white p-3 border border-[#e6dfd8]">
                  <div className="text-[11px] text-[#6c6a64]">E-mailadres:</div>
                  <div className="font-semibold text-primary text-sm mt-0.5">fatima.almansoor@demo.nl</div>
                </div>
              </div>

              {/* Privacy guidelines */}
              <div className="border-t border-emerald-200/80 pt-3 text-[11px] text-[#3d3d3a] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacygarantie:</strong> Als postadres-helper open je nooit brieven van de nieuwkomer. Je registreert alleen de officiële afzender (zoals Gemeente of IND) zodat de nieuwkomer direct een melding ontvangt.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. ADRES & BESCHIKBAARHEID INSTELLINGEN                        */}
      {/* ============================================================== */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs max-w-2xl space-y-6">
          <div className="border-b border-[#f0eae1] pb-3">
            <h3 className="text-base font-bold text-[#141413]">
              Postadres, Capaciteit & Uitbetalingsrekening
            </h3>
            <p className="text-xs text-[#6c6a64]">
              Beheer je postadres en je IBAN rekeningnummer voor de maandelijkse overboeking
            </p>
          </div>

          {settingsSaved && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Instellingen succesvol opgeslagen!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#141413] mb-1">Straatnaam</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Huisnummer</label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Postcode</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#141413] mb-1">Woonplaats</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Capacity Slider & Availability */}
            <div className="border-t border-[#f0eae1] pt-4 space-y-3">
              <h4 className="font-bold text-[#141413]">Capaciteit & Beschikbaarheid</h4>

              <div>
                <div className="flex justify-between text-xs text-[#3d3d3a] mb-1">
                  <span>Maximale nieuwkomers tegelijk:</span>
                  <strong className="text-primary">{maxCapacity} personen</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="h-4 w-4 rounded border-[#c8c4bc] text-primary focus:ring-primary"
                />
                <span className="font-medium text-[#141413]">
                  Mijn adres is beschikbaar voor nieuwe matches (zet uit tijdens bijv. vakantie)
                </span>
              </label>
            </div>

            {/* Banking IBAN */}
            <div className="border-t border-[#f0eae1] pt-4 space-y-3">
              <h4 className="font-bold text-[#141413]">Uitbetalingsrekening (IBAN)</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">IBAN Rekeningnummer</label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#141413] mb-1">Tenaamstelling</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="h-9 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#a9583e]"
              >
                Instellingen Opslaan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-[#141413]">Nieuw Poststuk Registreren</h3>
            <p className="text-[#6c6a64]">
              Voer de afzender in om het poststuk direct aan het dossier van de nieuwkomer te koppelen.
            </p>
            <form onSubmit={handleAddLetter} className="space-y-3">
              <div>
                <label className="block font-medium text-[#141413] mb-1">Afzender</label>
                <input
                  type="text"
                  placeholder="bijv. Gemeente Amsterdam of Belastingdienst"
                  value={newLetterSender}
                  onChange={(e) => setNewLetterSender(e.target.value)}
                  required
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-[#141413] mb-1">Geadresseerde Nieuwkomer</label>
                <input
                  type="text"
                  value={newLetterRecipient}
                  onChange={(e) => setNewLetterRecipient(e.target.value)}
                  required
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-[#141413] mb-1">Notitie of Kenmerk (optioneel)</label>
                <input
                  type="text"
                  placeholder="bijv. Bevestiging Burgerzaken afspraak"
                  value={newLetterNotes}
                  onChange={(e) => setNewLetterNotes(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="h-9 rounded-lg border border-[#e6dfd8] px-4 font-medium text-[#6c6a64]"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-primary px-4 font-semibold text-white hover:bg-[#a9583e]"
                >
                  Registreren (+ €{letterRate.toFixed(2)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
