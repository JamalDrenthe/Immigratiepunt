import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import {
  ArrowUpRight,
  Briefcase,
  Home,
  Landmark,
  LogOut,
  UserRound,
  ShieldCheck,
  CheckCircle2,
  Mail,
  HeartHandshake,
  UserCheck,
  Coins,
  FileText,
  Users,
  Plus,
  Phone,
  MapPin,
  Clock,
  Circle,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { getMember, signOut, signInAsDemo, MemberRole } from "@/lib/auth";
import {
  fetchAllRegistrations,
  fetchAllHelpers,
  updateRegistrationStatusInDb,
  logLetter,
  fetchLettersForHelper,
  RegistrationDoc,
  HelperDoc,
  LetterLogDoc,
} from "@/lib/firebase";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const member = getMember();

  // Admin state
  const [registrations, setRegistrations] = useState<RegistrationDoc[]>([]);
  const [helpers, setHelpers] = useState<HelperDoc[]>([]);
  const [adminTab, setAdminTab] = useState<"registrations" | "helpers">("registrations");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Helper letter logging state
  const [letters, setLetters] = useState<LetterLogDoc[]>([]);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [newLetterSender, setNewLetterSender] = useState("");
  const [newLetterRecipient, setNewLetterRecipient] = useState("");
  const [newLetterNotes, setNewLetterNotes] = useState("");
  const [letterCount, setLetterCount] = useState(7);

  // Immigrant checklist state
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    0: true, // Inschrijving voltooid
    1: true, // Postadres toegewezen
    2: false, // Afspraak gemeente
    3: false, // BSN & Bankrekening
    4: false, // Huisvesting
    5: false, // Werk
  });

  useEffect(() => {
    if (!member) {
      navigate("/inloggen");
      return;
    }

    const isAdminRole = member.role === "admin" || member.email.toLowerCase() === "info@jamaldrenthe.com";

    if (isAdminRole) {
      loadAdminData();
    } else if (member.role === "helper") {
      const helperLetters = fetchLettersForHelper(member.email);
      setLetters(helperLetters);
      setLetterCount(Math.max(helperLetters.length, 7));
    }
  }, [member, navigate]);

  if (!member) return null;

  const isAdminRole = member.role === "admin" || member.email.toLowerCase() === "info@jamaldrenthe.com";
  const isHelperRole = member.role === "helper";
  const isNewcomerRole = !isAdminRole && !isHelperRole;

  const loadAdminData = async () => {
    setIsLoadingAdmin(true);
    try {
      const [regs, hlps] = await Promise.all([fetchAllRegistrations(), fetchAllHelpers()]);
      setRegistrations(regs);
      setHelpers(hlps);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: RegistrationDoc["status"]) => {
    await updateRegistrationStatusInDb(id, newStatus);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

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
    setLetterCount((prev) => prev + 1);
    setNewLetterSender("");
    setNewLetterRecipient("");
    setNewLetterNotes("");
    setShowLetterModal(false);
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const partners = [
    { key: "djobba", icon: Briefcase, url: "https://djobba.nl" },
    { key: "woningvry", icon: Home, url: "https://woningvry.nl" },
    { key: "xabiworld", icon: Landmark, url: "https://xabiworld.com" },
  ];

  const handleRoleSwitch = (role: MemberRole) => {
    signInAsDemo(role);
    window.location.reload();
  };

  // Helper calculation
  const letterRate = letterCount >= 8 ? 4.0 : letterCount >= 4 ? 2.5 : 1.5;
  const grossCompensation = letterCount * letterRate;
  const monthlyDonation = 5.0;
  const netEarnings = Math.max(0, grossCompensation - monthlyDonation);

  const filteredRegistrations = statusFilter === "all"
    ? registrations
    : registrations.filter((r) => r.status === statusFilter);

  return (
    <>
      <Helmet>
        <title>{isAdminRole ? "Beheerderspaneel | Immigratiepunt" : t("account.meta.title")}</title>
        <meta name="description" content={t("account.meta.description")} />
      </Helmet>

      <section className="bg-[#faf9f5] py-10 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header Bar */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-[#e6dfd8] pb-6">
            <div className="flex items-center gap-4 md:gap-5">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                  isAdminRole
                    ? "bg-purple-100 text-purple-700"
                    : isHelperRole
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isAdminRole ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : isHelperRole ? (
                  <HeartHandshake className="h-7 w-7" />
                ) : (
                  <UserRound className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="section-kicker">{t("account.kicker")}</span>
                  {isAdminRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                      <ShieldCheck className="h-3 w-3" />
                      Beheerder
                    </span>
                  )}
                  {isHelperRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      <HeartHandshake className="h-3 w-3" />
                      Hulpverlener
                    </span>
                  )}
                  {isNewcomerRole && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <UserCheck className="h-3 w-3" />
                      Nieuwkomer
                    </span>
                  )}
                </div>
                <h1 className="font-display text-2xl tracking-tight text-[#141413] md:text-4xl">
                  {t("account.title", { name: member.name })}
                </h1>
                <p className="mt-1 text-xs text-[#6c6a64] md:text-sm">{member.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Demo Account Quick Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-[#e6dfd8] bg-white p-1 text-xs">
                <span className="px-1.5 text-[11px] text-[#8c887f]">Demo wissel:</span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isAdminRole ? "bg-purple-100 text-purple-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("helper")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isHelperRole ? "bg-blue-100 text-blue-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Helper
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("newcomer")}
                  className={`rounded px-2 py-1 font-medium transition-colors ${
                    isNewcomerRole ? "bg-emerald-100 text-emerald-800" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Immigrant
                </button>
              </div>

              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6dfd8] bg-white px-3.5 text-xs font-medium text-[#3d3d3a] transition-colors hover:bg-[#efe9de]"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("account.signOut")}
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* ADMIN VIEW                                                     */}
          {/* ============================================================== */}
          {isAdminRole && (
            <div className="space-y-8">
              {/* Infrastructure Card */}
              <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#141413]">
                        Systeem- & Toegangsbeheer
                      </h2>
                      <p className="text-xs text-[#6c6a64]">
                        Status van gekoppelde platforms en beveiliging
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Alles Operationeel
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5">
                    <div className="text-xs font-medium text-[#6c6a64]">Firebase Koppeling</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      immigratiepunt-dev
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#6c6a64]">
                      Geauthenticeerd via Google
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5">
                    <div className="text-xs font-medium text-[#6c6a64]">Firestore Rules</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      isAdmin() Beveiligd
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#6c6a64]">
                      Alleen admin leest/bewerkt inbox
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-3.5">
                    <div className="text-xs font-medium text-[#6c6a64]">Vercel & Git Sync</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#141413]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Auto-deploy Actief
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#6c6a64]">
                      Live op immigratiepunt.nl
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5 border-t border-[#f0eae1] pt-3 text-xs">
                  <a
                    href="https://console.firebase.google.com/project/immigratiepunt-dev/overview"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3 py-1.5 text-[#141413] hover:bg-[#efe9de]"
                  >
                    <ExternalLink className="h-3 w-3 text-[#6c6a64]" />
                    Firebase Console
                  </a>
                  <a
                    href="https://github.com/JamalDrenthe/Immigratiepunt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3 py-1.5 text-[#141413] hover:bg-[#efe9de]"
                  >
                    <ExternalLink className="h-3 w-3 text-[#6c6a64]" />
                    GitHub Repository
                  </a>
                </div>
              </div>

              {/* Realtime Admin Inbox */}
              <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#141413]">
                      Aanmeldingen & Inbox
                    </h2>
                    <p className="text-xs text-[#6c6a64]">
                      Direct gekoppeld aan Firestore database
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadAdminData}
                      disabled={isLoadingAdmin}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoadingAdmin ? "animate-spin" : ""}`} />
                      Vernieuwen
                    </button>

                    <div className="flex rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setAdminTab("registrations")}
                        className={`rounded-md px-3 py-1 font-medium transition-colors ${
                          adminTab === "registrations" ? "bg-white text-[#141413] shadow-xs" : "text-[#6c6a64]"
                        }`}
                      >
                        Nieuwkomers ({registrations.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminTab("helpers")}
                        className={`rounded-md px-3 py-1 font-medium transition-colors ${
                          adminTab === "helpers" ? "bg-white text-[#141413] shadow-xs" : "text-[#6c6a64]"
                        }`}
                      >
                        Helpers ({helpers.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status filter for registrations */}
                {adminTab === "registrations" && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {["all", "nieuw", "in_behandeling", "gekoppeld", "afgerond"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          statusFilter === st
                            ? "bg-[#141413] text-white"
                            : "bg-[#faf9f5] text-[#6c6a64] border border-[#e6dfd8] hover:bg-[#efe9de]"
                        }`}
                      >
                        {st === "all" ? "Alle statussen" : st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}

                {/* Registrations List */}
                {adminTab === "registrations" ? (
                  <div className="space-y-3">
                    {filteredRegistrations.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                        Geen aanmeldingen gevonden voor deze status.
                      </div>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <div
                          key={reg.id || reg.email}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 transition-colors hover:border-primary/40"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#141413]">
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
                                <Mail className="h-3.5 w-3.5" />
                                {reg.email}
                              </a>
                              <a href={`tel:${reg.phone}`} className="flex items-center gap-1 hover:text-primary">
                                <Phone className="h-3.5 w-3.5" />
                                {reg.phone}
                              </a>
                              <span className="flex items-center gap-1 text-[11px] text-[#8c887f]">
                                <Clock className="h-3 w-3" />
                                {new Date(reg.createdAt).toLocaleDateString("nl-NL")}
                              </span>
                            </div>

                            {/* Service Badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {reg.bankingAssistance && (
                                <span className="rounded bg-white px-2 py-0.5 text-[11px] text-[#3d3d3a] border border-[#e6dfd8]">
                                  Bankzaken
                                </span>
                              )}
                              {reg.housingSupport && (
                                <span className="rounded bg-white px-2 py-0.5 text-[11px] text-[#3d3d3a] border border-[#e6dfd8]">
                                  Huisvesting
                                </span>
                              )}
                              {reg.employmentAssistance && (
                                <span className="rounded bg-white px-2 py-0.5 text-[11px] text-[#3d3d3a] border border-[#e6dfd8]">
                                  Werkgelegenheid
                                </span>
                              )}
                              {reg.administrativeSupport && (
                                <span className="rounded bg-white px-2 py-0.5 text-[11px] text-[#3d3d3a] border border-[#e6dfd8]">
                                  Administratie & BSN
                                </span>
                              )}
                            </div>

                            {reg.notes && (
                              <p className="pt-1 text-[11px] italic text-[#6c6a64]">
                                Notitie: {reg.notes}
                              </p>
                            )}
                          </div>

                          {/* Quick Status Changer */}
                          <div className="flex items-center gap-2">
                            <select
                              value={reg.status}
                              onChange={(e) =>
                                handleStatusChange(reg.id || "", e.target.value as RegistrationDoc["status"])
                              }
                              className="h-8 rounded-lg border border-[#e6dfd8] bg-white px-2 text-xs text-[#141413] outline-none"
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
                ) : (
                  /* Helpers List */
                  <div className="space-y-3">
                    {helpers.map((hlp) => (
                      <div
                        key={hlp.id || hlp.email}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#141413]">
                              {hlp.firstName} {hlp.lastName}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[#6c6a64]">
                              <MapPin className="h-3 w-3" />
                              {hlp.city}
                            </span>
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 uppercase">
                              {hlp.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6c6a64]">
                            <a href={`mailto:${hlp.email}`} className="flex items-center gap-1 hover:text-primary">
                              <Mail className="h-3.5 w-3.5" />
                              {hlp.email}
                            </a>
                            <a href={`tel:${hlp.phone}`} className="flex items-center gap-1 hover:text-primary">
                              <Phone className="h-3.5 w-3.5" />
                              {hlp.phone}
                            </a>
                          </div>

                          <div className="flex items-center gap-2 pt-1 text-xs text-[#3d3d3a]">
                            <span className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#e6dfd8]">
                              Poststukken: {hlp.registeredLettersCount || 0}
                            </span>
                            {hlp.monthlyDonation && (
                              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 border border-emerald-200">
                                €5 Donatie actief
                              </span>
                            )}
                            {hlp.matchedNewcomer && (
                              <span className="text-[11px] text-[#6c6a64]">
                                Gekoppeld aan: <span className="font-medium text-[#141413]">{hlp.matchedNewcomer}</span>
                              </span>
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

          {/* ============================================================== */}
          {/* HULPVERLENER VIEW                                              */}
          {/* ============================================================== */}
          {isHelperRole && (
            <div className="space-y-8">
              {/* Postal Address Overview & Live Earnings */}
              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#141413]">
                        Jouw Aangeboden Postadres
                      </h2>
                      <p className="text-xs text-[#6c6a64]">
                        Geregistreerd adres in {member.countryOrCity || "Amsterdam"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLetterModal(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                  >
                    <Plus className="h-4 w-4" />
                    + Brief registreren
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Post deze maand</div>
                    <div className="mt-1 text-2xl font-bold text-[#141413]">
                      {letterCount} brieven
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      Tarief: €{letterRate.toFixed(2)} per brief
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Bruto vergoeding</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">
                      € {grossCompensation.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-[#6c6a64]">
                      {letterCount} x €{letterRate.toFixed(2)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                    <div className="text-xs font-medium text-[#6c6a64]">Maandelijkse steun</div>
                    <div className="mt-1 text-2xl font-bold text-[#6c6a64]">
                      - € 5,00
                    </div>
                    <div className="text-[11px] text-[#6c6a64]">
                      Donatie voor het programma
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="text-xs font-medium text-emerald-800">Netto verdienste</div>
                    <div className="mt-1 text-2xl font-bold text-primary">
                      + € {netEarnings.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-primary font-medium">
                      En je helpt iemand aan een BSN!
                    </div>
                  </div>
                </div>

                {/* Letter Registration Modal / Drawer */}
                {showLetterModal && (
                  <div className="mt-5 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-5">
                    <h3 className="mb-2 text-sm font-bold text-[#141413]">
                      Nieuw poststuk registreren
                    </h3>
                    <p className="mb-4 text-xs text-[#6c6a64]">
                      Registreer een binnengekomen brief voor jouw gekoppelde nieuwkomer om je vergoeding bij te werken.
                    </p>
                    <form onSubmit={handleAddLetter} className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-[#141413]">
                            Afzender (Gemeente, IND, Belastingdienst)
                          </label>
                          <input
                            type="text"
                            placeholder="bijv. Gemeente Amsterdam"
                            value={newLetterSender}
                            onChange={(e) => setNewLetterSender(e.target.value)}
                            required
                            className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-[#141413]">
                            Geadresseerde (Nieuwkomer)
                          </label>
                          <input
                            type="text"
                            placeholder="bijv. Fatima Al-Mansoor"
                            value={newLetterRecipient}
                            onChange={(e) => setNewLetterRecipient(e.target.value)}
                            required
                            className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#141413]">
                          Notitie / Type post (optioneel)
                        </label>
                        <input
                          type="text"
                          placeholder="bijv. Afspraakbevestiging BSN balie"
                          value={newLetterNotes}
                          onChange={(e) => setNewLetterNotes(e.target.value)}
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-white px-3 text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowLetterModal(false)}
                          className="h-9 rounded-lg border border-[#e6dfd8] bg-white px-4 text-xs font-medium text-[#6c6a64]"
                        >
                          Annuleren
                        </button>
                        <button
                          type="submit"
                          className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
                        >
                          Opslaan & Berekening bijwerken
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Letters Log List */}
              <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#141413]">
                    Geregistreerde poststukken ({letters.length})
                  </h3>
                  <span className="text-xs text-[#6c6a64]">
                    Gekoppeld aan: <span className="font-semibold text-[#141413]">Fatima Al-Mansoor</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {letters.map((l, i) => (
                    <div
                      key={l.id || i}
                      className="flex items-center justify-between rounded-lg border border-[#ece6de] bg-[#faf9f5] p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#141413]">{l.sender}</div>
                          <div className="text-[#6c6a64]">
                            Voor: {l.recipientName} {l.notes ? `• ${l.notes}` : ""}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#8c887f]">{l.dateReceived}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* IMMIGRANT / NEWCOMER VIEW                                      */}
          {/* ============================================================== */}
          {isNewcomerRole && (
            <div className="space-y-8">
              {/* Status Header Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#141413]">
                        Jouw Vestigings- & BSN Begeleiding
                      </h2>
                      <p className="text-xs text-[#6c6a64]">
                        Postadres gekoppeld via partnerhelper Jan de Vries (Amsterdam)
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                    Postadres Actief
                  </span>
                </div>
              </div>

              {/* Interactive Integration Checklist */}
              <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#141413]">
                    Jouw Integratie Stappenplan
                  </h3>
                  <p className="text-xs text-[#6c6a64]">
                    Volg je voortgang van aankomst tot zelfstandig wonen en werken in Nederland
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Aanmelding bij Immigratiepunt ontvangen", desc: "Jouw profiel en voorkeuren zijn vastgelegd." },
                    { title: "Postadres-helper toegewezen", desc: "Gekoppeld aan Jan de Vries om officiële post te ontvangen." },
                    { title: "Afspraak Gemeente Amsterdam voor BSN inschrijving", desc: "Neem paspoort en huur/postadres verklaring mee." },
                    { title: "Nederlandse bankrekening openen via Xabi World", desc: "Zodra je BSN binnen is, activeer je direct je IBAN." },
                    { title: "Huisvesting zoeken via partner WoningVry", desc: "Begeleiding naar een eigen kamer of huurwoning." },
                    { title: "Passend werk vinden via partner Djobba", desc: "CV vertaling, matching en sollicitatiegesprekken." },
                  ].map((step, idx) => {
                    const isDone = checkedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          isDone
                            ? "border-emerald-200 bg-emerald-50/40"
                            : "border-[#e6dfd8] bg-[#faf9f5] hover:border-primary/40"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                            isDone ? "bg-emerald-600 text-white" : "border border-[#c8c4bc] bg-white"
                          }`}
                        >
                          {isDone && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${isDone ? "text-emerald-900" : "text-[#141413]"}`}>
                            {step.title}
                          </div>
                          <div className="text-xs text-[#6c6a64] mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PARTNER INTEGRATIONS SECTION (AVAILABLE TO ALL)                 */}
          {/* ============================================================== */}
          <div className="mt-10">
            <div className="mb-4">
              <h2 className="font-display text-2xl tracking-tight text-[#141413]">
                {t("account.servicesTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6c6a64]">
                {t("account.servicesSubtitle")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {partners.map(({ key, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-[#e6dfd8] bg-white p-7 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#efe9de] transition-colors group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[#6c6a64] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                    {t(`account.partners.${key}.label`)}
                  </div>
                  <h3 className="font-display mb-2 text-xl tracking-tight text-[#141413]">
                    {t(`account.partners.${key}.title`)}
                  </h3>
                  <p className="text-xs leading-5 text-[#3d3d3a]">
                    {t(`account.partners.${key}.text`)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
