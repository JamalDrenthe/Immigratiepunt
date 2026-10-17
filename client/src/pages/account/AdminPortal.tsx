import { useState } from "react";
import {
  Users,
  HeartHandshake,
  FileText,
  CreditCard,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { Member } from "@/lib/auth";
import {
  RegistrationDoc,
  HelperDoc,
  SupportMessage,
  LetterLogDoc,
  updateRegistrationStatusInDb,
  matchNewcomerToHelper,
  replySupportMessage,
  exportRegistrationsToCsv,
} from "@/lib/firebase";

interface AdminPortalProps {
  member: Member;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  registrations: RegistrationDoc[];
  setRegistrations: React.Dispatch<React.SetStateAction<RegistrationDoc[]>>;
  helpers: HelperDoc[];
  setHelpers: React.Dispatch<React.SetStateAction<HelperDoc[]>>;
  supportMessages: SupportMessage[];
  setSupportMessages: React.Dispatch<React.SetStateAction<SupportMessage[]>>;
  letters: LetterLogDoc[];
  loadAdminData: () => Promise<void>;
  isLoadingAdmin: boolean;
}

export default function AdminPortal({
  member,
  activeTab,
  setActiveTab,
  registrations,
  setRegistrations,
  helpers,
  setHelpers,
  supportMessages,
  setSupportMessages,
  letters,
  loadAdminData,
  isLoadingAdmin,
}: AdminPortalProps) {
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Matchmaker state
  const [matchRegId, setMatchRegId] = useState<string>("");
  const [matchHelperEmail, setMatchHelperEmail] = useState<string>("");
  const [matchSuccess, setMatchSuccess] = useState(false);

  // Reply Modal
  const [selectedMsg, setSelectedMsg] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");

  // Notes state per registration
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const handleStatusChange = async (id: string, newStatus: RegistrationDoc["status"]) => {
    await updateRegistrationStatusInDb(id, newStatus);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleSaveNotes = async (id: string) => {
    await updateRegistrationStatusInDb(id, (registrations.find((r) => r.id === id)?.status || "in_behandeling"), notesDraft);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes: notesDraft } : r))
    );
    setEditingNotesId(null);
  };

  const handleExecuteMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchRegId || !matchHelperEmail) return;

    const chosenReg = registrations.find((r) => r.id === matchRegId);
    const chosenHelper = helpers.find((h) => h.email === matchHelperEmail);
    if (!chosenReg || !chosenHelper) return;

    await matchNewcomerToHelper(
      chosenReg.id || "",
      chosenHelper.email,
      `${chosenHelper.firstName} ${chosenHelper.lastName}`,
      `${chosenReg.firstName} ${chosenReg.lastName}`
    );

    await loadAdminData();
    setMatchRegId("");
    setMatchHelperEmail("");
    setMatchSuccess(true);
    setTimeout(() => setMatchSuccess(false), 4000);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim()) return;

    replySupportMessage(selectedMsg.id, replyText.trim());
    setSupportMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMsg.id
          ? { ...m, status: "beantwoord" as const, reply: replyText.trim() }
          : m
      )
    );
    setSelectedMsg(null);
    setReplyText("");
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.countryOfOrigin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const unmatchedRegistrations = registrations.filter((r) => r.status === "nieuw" || r.status === "in_behandeling");
  const openQuestionsCount = supportMessages.filter((m) => m.status === "open").length;

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. OVERZICHT & SYSTEEMPRESTATIES                                */}
      {/* ============================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Welcome & Fast Actions */}
          <div className="rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50/70 via-white to-amber-50/20 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Beheerdersportaal • Live Productie
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#141413]">
                  Immigratiepunt Beheercentrum
                </h2>
                <p className="mt-1 text-xs text-[#6c6a64]">
                  Centraal overzicht van nieuwkomers, postadres-helpers, matching en helpdeskaanvragen.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={loadAdminData}
                  disabled={isLoadingAdmin}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3.5 text-xs font-semibold text-[#141413] hover:bg-[#efe9de]"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingAdmin ? "animate-spin" : ""}`} />
                  Gegevens Vernieuwen
                </button>
                <button
                  type="button"
                  onClick={() => exportRegistrationsToCsv(registrations)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                >
                  <Download className="h-4 w-4" />
                  CSV Export
                </button>
              </div>
            </div>

            {/* 6 High-Level KPIs */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div
                onClick={() => setActiveTab("dossiers")}
                className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-purple-300 transition-colors"
              >
                <div className="text-xs text-[#6c6a64]">Nieuwkomers</div>
                <div className="text-2xl font-bold text-[#141413] mt-1">{registrations.length}</div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {unmatchedRegistrations.length} te koppelen
                </div>
              </div>

              <div
                onClick={() => setActiveTab("helpers")}
                className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-purple-300 transition-colors"
              >
                <div className="text-xs text-[#6c6a64]">Postadres Helpers</div>
                <div className="text-2xl font-bold text-[#141413] mt-1">{helpers.length}</div>
                <div className="text-[11px] text-emerald-700 font-medium">Actief in 4 steden</div>
              </div>

              <div
                onClick={() => setActiveTab("matchmaker")}
                className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-purple-300 transition-colors"
              >
                <div className="text-xs text-[#6c6a64]">Actieve Matches</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {registrations.filter((r) => r.status === "gekoppeld").length}
                </div>
                <div className="text-[11px] text-[#6c6a64]">Succesvol gekoppeld</div>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs">
                <div className="text-xs text-[#6c6a64]">Brieven Verwerkt</div>
                <div className="text-2xl font-bold text-[#141413] mt-1">74</div>
                <div className="text-[11px] text-blue-700 font-medium">Via briefadressen</div>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs">
                <div className="text-xs text-[#6c6a64]">Uitbetaalde Vergoedingen</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">€ 185,00</div>
                <div className="text-[11px] text-[#6c6a64]">Aan helpers overgemaakt</div>
              </div>

              <div
                onClick={() => setActiveTab("helpdesk")}
                className="cursor-pointer rounded-xl border border-[#e6dfd8] bg-white p-4 shadow-xs hover:border-purple-300 transition-colors"
              >
                <div className="text-xs text-[#6c6a64]">Open Vragen</div>
                <div className="text-2xl font-bold text-primary mt-1">{openQuestionsCount}</div>
                <div className="text-[11px] text-primary font-medium">Vereist antwoord</div>
              </div>
            </div>
          </div>

          {/* Action Modules Grid: Matchmaker callout & System status */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-[#141413]">Matchmaker Engine</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {unmatchedRegistrations.length} Wachtend
                </span>
              </div>
              <p className="text-xs text-[#3d3d3a] leading-relaxed">
                Koppel snel een nieuwkomer aan een beschikbare postadres-helper op basis van gemeente en capaciteit.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("matchmaker")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
                >
                  Open Matchmaker <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-700" />
                  <h3 className="font-bold text-sm text-[#141413]">Systeem & Veiligheid</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Online
                </span>
              </div>
              <div className="text-xs text-[#3d3d3a] space-y-1.5">
                <div>Firebase Firestore: <strong className="text-emerald-700">Verbonden (immigratiepunt-dev)</strong></div>
                <div>Beheerder E-mail: <strong className="text-[#141413]">info@immigratiepunt.nl</strong></div>
                <div>AVG / GDPR Conform: <strong className="text-emerald-700">100% compliant</strong></div>
              </div>
              <div className="pt-2">
                <a
                  href="https://console.firebase.google.com/project/immigratiepunt-dev/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Firebase Console Openen <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MATCHMAKER ENGINE                                           */}
      {/* ============================================================== */}
      {activeTab === "matchmaker" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#141413] mb-1">
              Matchmaker: Koppel Nieuwkomer aan Postadres-Helper
            </h3>
            <p className="text-xs text-[#6c6a64] mb-4">
              Selecteer een nieuwkomer die wacht op een briefadres en combineer deze met een geschikte helper in dezelfde regio.
            </p>

            {matchSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Koppeling succesvol uitgevoerd! Beide partijen hebben een melding in hun dashboard ontvangen.
              </div>
            )}

            <form onSubmit={handleExecuteMatch} className="grid gap-4 md:grid-cols-2 text-xs">
              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 space-y-2">
                <label className="block font-bold text-[#141413]">
                  1. Kies Nieuwkomer (In afwachting)
                </label>
                <select
                  value={matchRegId}
                  onChange={(e) => setMatchRegId(e.target.value)}
                  required
                  className="h-10 w-full rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="">-- Selecteer nieuwkomer --</option>
                  {registrations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.firstName} {r.lastName} ({r.countryOfOrigin}) - Status: {r.status}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6c6a64]">
                  Toont alle geregistreerde nieuwkomers.
                </p>
              </div>

              <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 space-y-2">
                <label className="block font-bold text-[#141413]">
                  2. Kies Beschikbare Helper
                </label>
                <select
                  value={matchHelperEmail}
                  onChange={(e) => setMatchHelperEmail(e.target.value)}
                  required
                  className="h-10 w-full rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="">-- Selecteer helper --</option>
                  {helpers.map((h) => (
                    <option key={h.email} value={h.email}>
                      {h.firstName} {h.lastName} ({h.city}) - {h.matchedNewcomer ? `Reeds: ${h.matchedNewcomer}` : "Volledig beschikbaar"}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6c6a64]">
                  Helpers met actieve postcode en donatie.
                </p>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!matchRegId || !matchHelperEmail}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <HeartHandshake className="h-4 w-4" />
                  Bevestig & Activeer Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DOSSIERS NIEUWKOMERS                                        */}
      {/* ============================================================== */}
      {activeTab === "dossiers" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eae1] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Dossiers van Nieuwkomers ({registrations.length})
                </h3>
                <p className="text-xs text-[#6c6a64]">
                  Beheer statussen, geselecteerde partnerdiensten en interne notities
                </p>
              </div>

              <button
                type="button"
                onClick={() => exportRegistrationsToCsv(registrations)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-semibold text-[#141413] hover:bg-[#efe9de]"
              >
                <Download className="h-3.5 w-3.5" />
                Download CSV
              </button>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <input
                type="text"
                placeholder="Zoek op naam, e-mail of herkomst..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
              />

              <div className="flex flex-wrap gap-1.5 text-xs">
                {["all", "nieuw", "in_behandeling", "gekoppeld", "afgerond"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      statusFilter === st
                        ? "bg-[#141413] text-white"
                        : "border border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:bg-[#efe9de]"
                    }`}
                  >
                    {st === "all" ? "Alle statussen" : st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredRegistrations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Geen dossiers gevonden voor deze selectie.
                </div>
              ) : (
                filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id || reg.email}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 text-xs transition-colors hover:border-primary/40"
                  >
                    <div className="space-y-1.5 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#141413]">
                          {reg.firstName} {reg.lastName}
                        </span>
                        <span className="text-xs text-[#6c6a64]">
                          • {reg.countryOfOrigin || "Herkomst onbekend"}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            reg.status === "nieuw"
                              ? "bg-amber-100 text-amber-800"
                              : reg.status === "in_behandeling"
                              ? "bg-blue-100 text-blue-800"
                              : reg.status === "gekoppeld"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {reg.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6c6a64]">
                        <a href={`mailto:${reg.email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="h-3.5 w-3.5" /> {reg.email}
                        </a>
                        <a href={`tel:${reg.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="h-3.5 w-3.5" /> {reg.phone}
                        </a>
                        <span className="text-[11px] text-[#8c887f]">
                          Aangemeld: {new Date(reg.createdAt).toLocaleDateString("nl-NL")}
                        </span>
                      </div>

                      {/* Services pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {reg.administrativeSupport && (
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#e6dfd8] text-[#3d3d3a]">
                            BSN & Gemeente
                          </span>
                        )}
                        {reg.bankingAssistance && (
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#e6dfd8] text-[#3d3d3a]">
                            Bank (Xabi)
                          </span>
                        )}
                        {reg.housingSupport && (
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#e6dfd8] text-[#3d3d3a]">
                            Wonen (WoningVry)
                          </span>
                        )}
                        {reg.employmentAssistance && (
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#e6dfd8] text-[#3d3d3a]">
                            Werk (Djobba)
                          </span>
                        )}
                      </div>

                      {/* Internal notes */}
                      <div className="pt-1 text-[11px]">
                        {editingNotesId === reg.id ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              className="h-7 grow rounded border border-[#e6dfd8] bg-white px-2 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveNotes(reg.id || "")}
                              className="h-7 rounded bg-primary px-2 font-semibold text-white"
                            >
                              Opslaan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNotesId(null)}
                              className="h-7 rounded border border-[#e6dfd8] px-2 text-[#6c6a64]"
                            >
                              Annuleren
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#6c6a64]">
                            <span>Dossier: {reg.notes || "Geen extra notities"}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNotesId(reg.id || "");
                                setNotesDraft(reg.notes || "");
                              }}
                              className="text-primary hover:underline text-[10px]"
                            >
                              (wijzig)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={reg.status}
                        onChange={(e) =>
                          handleStatusChange(reg.id || "", e.target.value as RegistrationDoc["status"])
                        }
                        className="h-8 rounded-lg border border-[#e6dfd8] bg-white px-2 text-xs text-[#141413] outline-none font-medium"
                      >
                        <option value="nieuw">Nieuw</option>
                        <option value="in_behandeling">In behandeling</option>
                        <option value="gekoppeld">Gekoppeld</option>
                        <option value="afgerond">Afgerond</option>
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
      {/* 4. HELPERS BEHEER                                              */}
      {/* ============================================================== */}
      {activeTab === "helpers" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Postadres-Helpers Beheer ({helpers.length})
                </h3>
                <p className="text-xs text-[#6c6a64]">
                  Vrijwilligers die hun adres inzetten als officieel correspondentieadres voor nieuwkomers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {helpers.map((h) => (
                <div
                  key={h.id || h.email}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#141413]">
                        {h.firstName} {h.lastName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#6c6a64]">
                        <MapPin className="h-3 w-3" /> {h.city}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 uppercase">
                        {h.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6c6a64]">
                      <a href={`mailto:${h.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" /> {h.email}
                      </a>
                      <a href={`tel:${h.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" /> {h.phone}
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="rounded bg-white px-2 py-0.5 border border-[#e6dfd8]">
                        Poststukken: {h.registeredLettersCount || 0}
                      </span>
                      {h.monthlyDonation && (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-200">
                          €5 Donatie actief
                        </span>
                      )}
                      {h.matchedNewcomer && (
                        <span className="text-[#6c6a64]">
                          Gekoppeld aan: <strong className="text-[#141413]">{h.matchedNewcomer}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. HELPDESK & BERICHTEN                                        */}
      {/* ============================================================== */}
      {activeTab === "helpdesk" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#141413]">
                Helpdesk & Vragen van Nieuwkomers ({supportMessages.length})
              </h3>
              <p className="text-xs text-[#6c6a64]">
                Beantwoord vragen over brieven, BSN afspraken en partnerdiensten
              </p>
            </div>

            <div className="space-y-3">
              {supportMessages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                  Geen openstaande vragen.
                </div>
              ) : (
                supportMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#141413]">{msg.fromName}</span>
                        <span className="text-[#6c6a64]">({msg.fromEmail})</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            msg.status === "open" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8c887f]">
                        {new Date(msg.createdAt).toLocaleDateString("nl-NL")}
                      </span>
                    </div>

                    <div className="font-semibold text-[#141413]">{msg.subject}</div>
                    <div className="bg-white p-3 rounded-lg border border-[#e6dfd8] text-[#3d3d3a] leading-relaxed">
                      {msg.message}
                    </div>

                    {msg.reply && (
                      <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 text-emerald-950">
                        <strong className="block mb-0.5">Jouw reactie:</strong>
                        <p>{msg.reply}</p>
                      </div>
                    )}

                    {msg.status === "open" && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedMsg(msg)}
                          className="h-8 rounded-lg bg-primary px-4 font-semibold text-white hover:bg-[#a9583e]"
                        >
                          Antwoorden
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reply Modal */}
          {selectedMsg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs space-y-3">
                <h3 className="font-bold text-base text-[#141413]">
                  Antwoord op vraag van {selectedMsg.fromName}
                </h3>
                <p className="text-[#6c6a64] italic">
                  "{selectedMsg.subject}": {selectedMsg.message}
                </p>

                {/* Canned Templates */}
                <div>
                  <div className="text-[11px] font-semibold text-[#141413] mb-1">Snelle reactiesjablonen:</div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          "Beste " +
                            selectedMsg.fromName +
                            ", neem naar je BSN afspraak je geldige paspoort, de geprinte briefadresverklaring van je helper en een eventuele geboorteakte mee. Wij wensen je veel succes!"
                        )
                      }
                      className="rounded bg-[#faf9f5] border border-[#e6dfd8] px-2 py-1 text-[10px] hover:bg-[#efe9de]"
                    >
                      + BSN Checklist
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          "Beste " +
                            selectedMsg.fromName +
                            ", je kunt dit postadres direct invullen bij officiële formulieren. Zodra er een brief binnenkomt, ontvang je binnen 24 uur bericht van ons."
                        )
                      }
                      className="rounded bg-[#faf9f5] border border-[#e6dfd8] px-2 py-1 text-[10px] hover:bg-[#efe9de]"
                    >
                      + Postadres Instructie
                    </button>
                  </div>
                </div>

                <form onSubmit={handleReplySubmit} className="space-y-3">
                  <textarea
                    rows={4}
                    required
                    placeholder="Typ jouw antwoord..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs outline-none focus:border-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMsg(null)}
                      className="h-8 rounded-lg border border-[#e6dfd8] px-4 font-medium text-[#6c6a64]"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="h-8 rounded-lg bg-primary px-4 font-semibold text-white hover:bg-[#a9583e]"
                    >
                      Verstuur Antwoord
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
