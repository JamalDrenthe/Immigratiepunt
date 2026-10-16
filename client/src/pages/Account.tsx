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
  Check,
  RefreshCw,
  ExternalLink,
  Download,
  Bell,
  Send,
  Trash2,
  SlidersHorizontal,
  CreditCard,
  Building,
  HelpCircle,
  FolderOpen,
  CheckCheck,
} from "lucide-react";
import { getMember, signOut, signInAsDemo, MemberRole, isEmailAdmin } from "@/lib/auth";
import {
  fetchAllRegistrations,
  fetchAllHelpers,
  updateRegistrationStatusInDb,
  logLetter,
  fetchLettersForHelper,
  updateLetterStatus,
  fetchDocumentsForUser,
  saveUserDocument,
  deleteUserDocument,
  fetchSupportMessages,
  sendSupportMessage,
  replySupportMessage,
  fetchHelperSettings,
  saveHelperSettings,
  matchNewcomerToHelper,
  fetchNotificationsForRole,
  markNotificationRead,
  exportRegistrationsToCsv,
  RegistrationDoc,
  HelperDoc,
  LetterLogDoc,
  UserDocument,
  SupportMessage,
  HelperSettings,
  InAppNotification,
} from "@/lib/firebase";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const member = getMember();

  // Navigation tab state per role
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Notifications state
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Admin state
  const [registrations, setRegistrations] = useState<RegistrationDoc[]>([]);
  const [helpers, setHelpers] = useState<HelperDoc[]>([]);
  const [adminSubTab, setAdminSubTab] = useState<"registrations" | "helpers">("registrations");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Admin Match Modal state
  const [selectedRegToMatch, setSelectedRegToMatch] = useState<RegistrationDoc | null>(null);
  const [selectedHelperForMatch, setSelectedHelperForMatch] = useState<string>("");

  // Admin Reply modal state
  const [selectedMsgToReply, setSelectedMsgToReply] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");

  // Helper letter logging state
  const [letters, setLetters] = useState<LetterLogDoc[]>([]);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [newLetterSender, setNewLetterSender] = useState("");
  const [newLetterRecipient, setNewLetterRecipient] = useState("");
  const [newLetterNotes, setNewLetterNotes] = useState("");
  const [letterCount, setLetterCount] = useState(7);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Helper settings state
  const [helperSettings, setHelperSettings] = useState<HelperSettings>({
    email: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    maxCapacity: 2,
    isAvailable: true,
    iban: "",
    accountHolder: "",
  });
  const [helperSettingsSaved, setHelperSettingsSaved] = useState(false);

  // Immigrant Documents state
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<UserDocument["category"]>("Identiteit & Paspoort");
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);

  // Immigrant Support Message state
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [newMsgSubject, setNewMsgSubject] = useState("");
  const [newMsgContent, setNewMsgContent] = useState("");
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

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

    const isAdminRole = member.role === "admin" || isEmailAdmin(member.email);

    // Load notifications
    const notifs = fetchNotificationsForRole(isAdminRole ? "admin" : member.role);
    setNotifications(notifs);

    if (isAdminRole) {
      loadAdminData();
    } else if (member.role === "helper") {
      const helperLetters = fetchLettersForHelper(member.email);
      setLetters(helperLetters);
      setLetterCount(Math.max(helperLetters.length, 7));
      const settings = fetchHelperSettings(member.email);
      setHelperSettings(settings);
    } else {
      // Newcomer
      const docs = fetchDocumentsForUser(member.email);
      setUserDocuments(docs);
      const msgs = fetchSupportMessages(member.email);
      setSupportMessages(msgs);
    }
  }, [member, navigate]);

  if (!member) return null;

  const isAdminRole = member.role === "admin" || isEmailAdmin(member.email);
  const isHelperRole = member.role === "helper";
  const isNewcomerRole = !isAdminRole && !isHelperRole;

  const loadAdminData = async () => {
    setIsLoadingAdmin(true);
    try {
      const [regs, hlps] = await Promise.all([fetchAllRegistrations(), fetchAllHelpers()]);
      setRegistrations(regs);
      setHelpers(hlps);
      const allMsgs = fetchSupportMessages();
      setSupportMessages(allMsgs);
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

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegToMatch || !selectedHelperForMatch) return;

    const chosenHelper = helpers.find((h) => h.email === selectedHelperForMatch);
    if (!chosenHelper) return;

    await matchNewcomerToHelper(
      selectedRegToMatch.id || "",
      chosenHelper.email,
      `${chosenHelper.firstName} ${chosenHelper.lastName}`,
      `${selectedRegToMatch.firstName} ${selectedRegToMatch.lastName}`
    );

    // Refresh local lists
    await loadAdminData();
    setSelectedRegToMatch(null);
    setSelectedHelperForMatch("");
  };

  const handleAdminReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsgToReply || !replyText.trim()) return;

    replySupportMessage(selectedMsgToReply.id, replyText.trim());
    setSupportMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMsgToReply.id
          ? { ...m, status: "beantwoord", reply: replyText.trim() }
          : m
      )
    );
    setSelectedMsgToReply(null);
    setReplyText("");
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

  const handleUpdateLetterStatus = (letterId: string, status: "binnengekomen" | "doorgestuurd" | "opgehaald") => {
    updateLetterStatus(letterId, status);
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, status } : l))
    );
  };

  const handleSaveHelperSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveHelperSettings(helperSettings);
    setHelperSettingsSaved(true);
    setTimeout(() => setHelperSettingsSaved(false), 3000);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const doc = saveUserDocument({
      userEmail: member.email,
      title: newDocTitle.trim(),
      category: newDocCategory,
      status: "in_behandeling",
      fileSize: "1.2 MB",
    });

    setUserDocuments((prev) => [doc, ...prev]);
    setNewDocTitle("");
    setShowDocUploadModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    deleteUserDocument(id);
    setUserDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgSubject.trim() || !newMsgContent.trim()) return;

    const msg = sendSupportMessage({
      fromEmail: member.email,
      fromName: member.name,
      subject: newMsgSubject.trim(),
      message: newMsgContent.trim(),
    });

    setSupportMessages((prev) => [msg, ...prev]);
    setNewMsgSubject("");
    setNewMsgContent("");
    setMsgSentSuccess(true);
    setTimeout(() => setMsgSentSuccess(false), 4000);
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRoleSwitch = (role: MemberRole) => {
    signInAsDemo(role);
    window.location.reload();
  };

  // Helper financial calculations
  const letterRate = letterCount >= 8 ? 4.0 : letterCount >= 4 ? 2.5 : 1.5;
  const grossCompensation = letterCount * letterRate;
  const monthlyDonation = 5.0;
  const netEarnings = Math.max(0, grossCompensation - monthlyDonation);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.countryOfOrigin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const partners = [
    { key: "djobba", icon: Briefcase, url: "https://djobba.nl" },
    { key: "woningvry", icon: Home, url: "https://woningvry.nl" },
    { key: "xabiworld", icon: Landmark, url: "https://xabiworld.com" },
  ];

  return (
    <>
      <Helmet>
        <title>{isAdminRole ? "Beheerdersportaal | Immigratiepunt" : t("account.meta.title")}</title>
        <meta name="description" content={t("account.meta.description")} />
      </Helmet>

      <section className="bg-[#faf9f5] py-8 md:py-12 min-h-screen">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Top User Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6dfd8] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-xs ${
                  isAdminRole
                    ? "bg-purple-100 text-purple-700"
                    : isHelperRole
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isAdminRole ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : isHelperRole ? (
                  <HeartHandshake className="h-6 w-6" />
                ) : (
                  <UserRound className="h-6 w-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl font-bold tracking-tight text-[#141413] md:text-2xl">
                    {member.name}
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isAdminRole
                        ? "bg-purple-100 text-purple-800"
                        : isHelperRole
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isAdminRole ? "Beheerder" : isHelperRole ? "Hulpverlener" : "Nieuwkomer"}
                  </span>
                </div>
                <p className="text-xs text-[#6c6a64]">{member.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* In-app Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-[#efe9de]"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-[#e6dfd8] bg-white p-3 shadow-lg">
                    <div className="mb-2 flex items-center justify-between border-b border-[#f0eae1] pb-2 text-xs font-semibold text-[#141413]">
                      <span>Meldingen</span>
                      <span className="text-[11px] text-[#6c6a64]">{notifications.length} updates</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            );
                          }}
                          className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                            n.read ? "bg-white text-[#6c6a64]" : "bg-emerald-50/60 text-[#141413] font-medium"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-primary">{n.title}</span>
                            <span className="text-[#8c887f]">{n.date}</span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Switcher */}
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-1 text-xs">
                <span className="px-1 text-[11px] text-[#8c887f]">Demo:</span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    isAdminRole ? "bg-purple-100 text-purple-800" : "text-[#6c6a64]"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("helper")}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    isHelperRole ? "bg-blue-100 text-blue-800" : "text-[#6c6a64]"
                  }`}
                >
                  Helper
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("newcomer")}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    isNewcomerRole ? "bg-emerald-100 text-emerald-800" : "text-[#6c6a64]"
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
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-medium text-[#3d3d3a] hover:bg-[#efe9de]"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("account.signOut")}
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mb-6 flex border-b border-[#e6dfd8] gap-2 overflow-x-auto text-sm">
            {isAdminRole && (
              <>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Dossiers & Aanmeldingen
                </button>
                <button
                  onClick={() => setActiveTab("support_inbox")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "support_inbox"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  Vragen & Berichten ({supportMessages.filter((m) => m.status === "open").length})
                </button>
                <button
                  onClick={() => setActiveTab("system")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors ${
                    activeTab === "system"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Systeem & Export
                </button>
              </>
            )}

            {isHelperRole && (
              <>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Vergoedingen & Postoverzicht
                </button>
                <button
                  onClick={() => setActiveTab("letters")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "letters"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Brievenarchief ({letters.length})
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "settings"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Mijn Postadres & Uitbetaling
                </button>
              </>
            )}

            {isNewcomerRole && (
              <>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Mijn Traject & Stappenplan
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "documents"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  Mijn Documenten ({userDocuments.length})
                </button>
                <button
                  onClick={() => setActiveTab("ask_help")}
                  className={`border-b-2 px-4 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "ask_help"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  Vraag aan Adviseur
                </button>
              </>
            )}
          </div>

          {/* ============================================================== */}
          {/* ADMIN PORTAL CONTENT                                           */}
          {/* ============================================================== */}
          {isAdminRole && (
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                  {/* Search, Filter & Tabs */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setAdminSubTab("registrations")}
                          className={`rounded px-3 py-1.5 font-semibold transition-colors ${
                            adminSubTab === "registrations" ? "bg-white text-[#141413] shadow-xs" : "text-[#6c6a64]"
                          }`}
                        >
                          Nieuwkomers ({registrations.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSubTab("helpers")}
                          className={`rounded px-3 py-1.5 font-semibold transition-colors ${
                            adminSubTab === "helpers" ? "bg-white text-[#141413] shadow-xs" : "text-[#6c6a64]"
                          }`}
                        >
                          Postadres-Helpers ({helpers.length})
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={loadAdminData}
                        disabled={isLoadingAdmin}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoadingAdmin ? "animate-spin" : ""}`} />
                        Vernieuwen
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Zoek op naam, e-mail of herkomst..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-60 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                      />

                      <button
                        type="button"
                        onClick={() => exportRegistrationsToCsv(registrations)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-semibold text-[#141413] hover:bg-[#efe9de]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        CSV Export
                      </button>
                    </div>
                  </div>

                  {/* Status Pills */}
                  {adminSubTab === "registrations" && (
                    <div className="mb-4 flex flex-wrap gap-1.5 text-xs">
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
                  )}

                  {/* Registrations List */}
                  {adminSubTab === "registrations" ? (
                    <div className="space-y-3">
                      {filteredRegistrations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#e6dfd8] p-8 text-center text-xs text-[#6c6a64]">
                          Geen aanmeldingen gevonden voor deze selectie.
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
                                    BSN & Administratie
                                  </span>
                                )}
                              </div>

                              {reg.notes && (
                                <p className="pt-1 text-[11px] italic text-[#6c6a64]">
                                  Dossier: {reg.notes}
                                </p>
                              )}
                            </div>

                            {/* Actions & Status */}
                            <div className="flex items-center gap-2">
                              {/* Koppel knop */}
                              {reg.status !== "gekoppeld" && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedRegToMatch(reg)}
                                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  <HeartHandshake className="h-3.5 w-3.5" />
                                  Koppel aan Helper
                                </button>
                              )}

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

                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#3d3d3a]">
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
              )}

              {/* Admin Match Maker Modal */}
              {selectedRegToMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-md rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl">
                    <h3 className="font-bold text-base text-[#141413] mb-1">
                      Koppel nieuwkomer aan een postadres-helper
                    </h3>
                    <p className="text-xs text-[#6c6a64] mb-4">
                      Selecteer een geregistreerde vrijwilliger om te koppelen aan{" "}
                      <span className="font-semibold text-[#141413]">
                        {selectedRegToMatch.firstName} {selectedRegToMatch.lastName}
                      </span>.
                    </p>

                    <form onSubmit={handleMatchSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                          Beschikbare Hulpverlener
                        </label>
                        <select
                          value={selectedHelperForMatch}
                          onChange={(e) => setSelectedHelperForMatch(e.target.value)}
                          required
                          className="h-10 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs outline-none focus:border-primary"
                        >
                          <option value="">-- Kies een postadres-helper --</option>
                          {helpers.map((h) => (
                            <option key={h.email} value={h.email}>
                              {h.firstName} {h.lastName} ({h.city}) - {h.matchedNewcomer ? "Reeds 1 match" : "Beschikbaar"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRegToMatch(null)}
                          className="h-9 rounded-lg border border-[#e6dfd8] px-4 text-xs font-medium text-[#6c6a64] hover:bg-[#efe9de]"
                        >
                          Annuleren
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedHelperForMatch}
                          className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e] disabled:opacity-50"
                        >
                          Bevestig Koppeling
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Admin Support Inbox Tab */}
              {activeTab === "support_inbox" && (
                <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-[#141413]">
                      Binnengekomen Vragen van Nieuwkomers
                    </h2>
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
                            <span className="text-[#8c887f] text-[11px]">
                              {new Date(msg.createdAt).toLocaleDateString("nl-NL")}
                            </span>
                          </div>

                          <div className="font-semibold text-[#141413]">{msg.subject}</div>
                          <p className="text-[#3d3d3a] leading-relaxed bg-white p-3 rounded-lg border border-[#e6dfd8]">
                            {msg.message}
                          </p>

                          {msg.reply && (
                            <div className="mt-2 rounded-lg bg-emerald-50/60 border border-emerald-200 p-3">
                              <div className="font-semibold text-emerald-900 mb-0.5">Jouw antwoord:</div>
                              <p className="text-emerald-800">{msg.reply}</p>
                            </div>
                          )}

                          {msg.status === "open" && (
                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setSelectedMsgToReply(msg)}
                                className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                              >
                                Antwoorden
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Modal */}
                  {selectedMsgToReply && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                      <div className="w-full max-w-lg rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl">
                        <h3 className="font-bold text-base text-[#141413] mb-2">
                          Antwoord op vraag van {selectedMsgToReply.fromName}
                        </h3>
                        <p className="text-xs text-[#6c6a64] mb-3 italic">
                          "{selectedMsgToReply.subject}": {selectedMsgToReply.message}
                        </p>
                        <form onSubmit={handleAdminReplySubmit} className="space-y-3">
                          <textarea
                            rows={4}
                            required
                            placeholder="Typ jouw antwoord en instructies..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs outline-none focus:border-primary"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedMsgToReply(null)}
                              className="h-9 rounded-lg border border-[#e6dfd8] px-4 text-xs font-medium text-[#6c6a64]"
                            >
                              Annuleren
                            </button>
                            <button
                              type="submit"
                              className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
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

              {/* System & Export Tab */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                    <h2 className="text-base font-bold text-[#141413] mb-4">
                      Platform Prestaties & Export
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-4 mb-6">
                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs text-[#6c6a64]">Totaal Nieuwkomers</div>
                        <div className="text-2xl font-bold text-[#141413] mt-1">{registrations.length}</div>
                      </div>
                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs text-[#6c6a64]">Postadres Helpers</div>
                        <div className="text-2xl font-bold text-[#141413] mt-1">{helpers.length}</div>
                      </div>
                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs text-[#6c6a64]">Verwerkte Brieven</div>
                        <div className="text-2xl font-bold text-[#141413] mt-1">74</div>
                      </div>
                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs text-[#6c6a64]">Uitbetaalde Vergoedingen</div>
                        <div className="text-2xl font-bold text-emerald-700 mt-1">€ 185,00</div>
                      </div>
                    </div>

                    <div className="border-t border-[#f0eae1] pt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => exportRegistrationsToCsv(registrations)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-[#a9583e]"
                      >
                        <Download className="h-4 w-4" />
                        Download Volledige CSV Rapportage
                      </button>
                      <a
                        href="https://console.firebase.google.com/project/immigratiepunt-dev/overview"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6dfd8] bg-white px-4 text-xs font-medium text-[#141413] hover:bg-[#efe9de]"
                      >
                        <ExternalLink className="h-4 w-4 text-[#6c6a64]" />
                        Firebase Console Openen
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* HULPVERLENER PORTAL CONTENT                                    */}
          {/* ============================================================== */}
          {isHelperRole && (
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Financial Overview Card */}
                  <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <Coins className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#141413]">
                            Jouw Postvergoeding & Uitbetaling
                          </h2>
                          <p className="text-xs text-[#6c6a64]">
                            Adres: {helperSettings.street ? `${helperSettings.street} ${helperSettings.houseNumber}, ${helperSettings.city}` : "Hoofdstraat 42, Amsterdam"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowLetterModal(true)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                        >
                          <Plus className="h-4 w-4" />
                          + Brief registreren
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayoutRequested(true)}
                          disabled={payoutRequested || netEarnings <= 0}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-white px-3.5 text-xs font-semibold text-[#141413] hover:bg-[#efe9de] disabled:opacity-50"
                        >
                          <CreditCard className="h-4 w-4 text-[#6c6a64]" />
                          {payoutRequested ? "Uitbetaling Aangevraagd" : "Uitbetaling Aanvragen"}
                        </button>
                      </div>
                    </div>

                    {payoutRequested && (
                      <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          Uitbetalingsverzoek van €{netEarnings.toFixed(2)} ontvangen! Dit wordt automatisch overgemaakt naar {helperSettings.iban || "je geregistreerde IBAN"}.
                        </span>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs font-medium text-[#6c6a64]">Brieven deze maand</div>
                        <div className="mt-1 text-2xl font-bold text-[#141413]">{letterCount}</div>
                        <div className="text-[11px] text-emerald-600 font-medium">Tarief: €{letterRate.toFixed(2)} / brief</div>
                      </div>

                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs font-medium text-[#6c6a64]">Bruto opbrengst</div>
                        <div className="mt-1 text-2xl font-bold text-emerald-700">€ {grossCompensation.toFixed(2)}</div>
                        <div className="text-[11px] text-[#6c6a64]">{letterCount} x €{letterRate.toFixed(2)}</div>
                      </div>

                      <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4">
                        <div className="text-xs font-medium text-[#6c6a64]">Maandelijkse donatie</div>
                        <div className="mt-1 text-2xl font-bold text-[#6c6a64]">- € 5,00</div>
                        <div className="text-[11px] text-[#6c6a64]">Vast steunbedrag</div>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                        <div className="text-xs font-medium text-emerald-800">Netto te ontvangen</div>
                        <div className="mt-1 text-2xl font-bold text-primary">+ € {netEarnings.toFixed(2)}</div>
                        <div className="text-[11px] text-primary font-medium">Uitbetaald per maand</div>
                      </div>
                    </div>
                  </div>

                  {/* Matched Immigrant Overview */}
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                    <h3 className="font-bold text-sm text-[#141413] mb-3">
                      Aan jouw adres gekoppelde nieuwkomer
                    </h3>
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-sm">
                          FA
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#141413]">Fatima Al-Mansoor</div>
                          <div className="text-xs text-[#6c6a64]">
                            Doel: BSN inschrijving bij Gemeente Amsterdam & Verblijfsvergunning
                          </div>
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        Postadres Actief
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Helper Letters Archive Tab */}
              {activeTab === "letters" && (
                <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#141413]">
                        Geregistreerde Poststukken ({letters.length})
                      </h3>
                      <p className="text-xs text-[#6c6a64]">
                        Houd de status bij van binnengekomen, doorgestuurde of opgehaalde brieven
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLetterModal(true)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-[#a9583e]"
                    >
                      <Plus className="h-4 w-4" />
                      + Brief registreren
                    </button>
                  </div>

                  <div className="space-y-3">
                    {letters.map((l, i) => (
                      <div
                        key={l.id || i}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#141413]">{l.sender}</div>
                            <div className="text-[#6c6a64]">
                              Voor: {l.recipientName} {l.notes ? `• ${l.notes}` : ""}
                            </div>
                            <div className="text-[11px] text-[#8c887f] mt-0.5">
                              Ontvangen op: {l.dateReceived}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={l.status || "binnengekomen"}
                            onChange={(e) =>
                              handleUpdateLetterStatus(
                                l.id || "",
                                e.target.value as "binnengekomen" | "doorgestuurd" | "opgehaald"
                              )
                            }
                            className="h-8 rounded-lg border border-[#e6dfd8] bg-white px-2.5 text-xs text-[#141413] outline-none"
                          >
                            <option value="binnengekomen">Binnengekomen</option>
                            <option value="doorgestuurd">Doorgestuurd</option>
                            <option value="opgehaald">Opgehaald</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helper Settings & Payout Tab */}
              {activeTab === "settings" && (
                <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs max-w-2xl">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-[#141413]">
                      Mijn Postadres & Uitbetalingsinstellingen
                    </h3>
                    <p className="text-xs text-[#6c6a64]">
                      Beheer je adresgegevens en het rekeningnummer voor je maandelijkse postvergoeding
                    </p>
                  </div>

                  {helperSettingsSaved && (
                    <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Gegevens succesvol opgeslagen!
                    </div>
                  )}

                  <form onSubmit={handleSaveHelperSettings} className="space-y-4 text-xs">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block font-medium text-[#141413] mb-1">Straatnaam</label>
                        <input
                          type="text"
                          value={helperSettings.street}
                          onChange={(e) => setHelperSettings({ ...helperSettings, street: e.target.value })}
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Huisnummer</label>
                        <input
                          type="text"
                          value={helperSettings.houseNumber}
                          onChange={(e) => setHelperSettings({ ...helperSettings, houseNumber: e.target.value })}
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Postcode</label>
                        <input
                          type="text"
                          value={helperSettings.postalCode}
                          onChange={(e) => setHelperSettings({ ...helperSettings, postalCode: e.target.value })}
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Woonplaats</label>
                        <input
                          type="text"
                          value={helperSettings.city}
                          onChange={(e) => setHelperSettings({ ...helperSettings, city: e.target.value })}
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#f0eae1] pt-4">
                      <h4 className="font-bold text-[#141413] mb-3">Uitbetalingsrekening (IBAN)</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-medium text-[#141413] mb-1">IBAN Rekeningnummer</label>
                          <input
                            type="text"
                            placeholder="NL91 ABNA 0412 3456 78"
                            value={helperSettings.iban}
                            onChange={(e) => setHelperSettings({ ...helperSettings, iban: e.target.value })}
                            className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-[#141413] mb-1">Tenaamstelling</label>
                          <input
                            type="text"
                            placeholder="bijv. J. de Vries"
                            value={helperSettings.accountHolder}
                            onChange={(e) => setHelperSettings({ ...helperSettings, accountHolder: e.target.value })}
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

              {/* Letter modal */}
              {showLetterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-md rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs">
                    <h3 className="font-bold text-sm text-[#141413] mb-1">Nieuw poststuk registreren</h3>
                    <p className="text-[#6c6a64] mb-3">
                      Voeg een ontvangen brief toe om direct jouw vergoeding op te hogen.
                    </p>
                    <form onSubmit={handleAddLetter} className="space-y-3">
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Afzender</label>
                        <input
                          type="text"
                          placeholder="bijv. Gemeente Amsterdam"
                          value={newLetterSender}
                          onChange={(e) => setNewLetterSender(e.target.value)}
                          required
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Geadresseerde nieuwkomer</label>
                        <input
                          type="text"
                          placeholder="bijv. Fatima Al-Mansoor"
                          value={newLetterRecipient}
                          onChange={(e) => setNewLetterRecipient(e.target.value)}
                          required
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Notitie (optioneel)</label>
                        <input
                          type="text"
                          placeholder="bijv. Afspraakbevestiging balie"
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
                          Registreren
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* IMMIGRANT / NEWCOMER PORTAL CONTENT                            */}
          {/* ============================================================== */}
          {isNewcomerRole && (
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Matching & Address Banner */}
                  <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#141413]">
                            Jouw Toegewezen Postadres & Begeleider
                          </h2>
                          <p className="text-xs text-[#6c6a64]">
                            Postadres-helper: <span className="font-semibold text-[#141413]">Jan de Vries</span> • Hoofdstraat 42, Amsterdam
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                        Actief Gekoppeld
                      </span>
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-[#141413]">
                        Jouw Integratie Stappenplan
                      </h3>
                      <p className="text-xs text-[#6c6a64]">
                        Klik op een stap om hem af te vinken zodra hij is afgerond
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: "Aanmelding bij Immigratiepunt ontvangen", desc: "Jouw profiel en voorkeuren zijn vastgelegd." },
                        { title: "Postadres-helper toegewezen", desc: "Gekoppeld aan Jan de Vries om officiële brieven te ontvangen." },
                        { title: "Afspraak Gemeente Amsterdam voor BSN inschrijving", desc: "Neem je paspoort en de ondertekende briefadresverklaring mee." },
                        { title: "Nederlandse bankrekening openen via Xabi World", desc: "Zodra je BSN binnen is, open je direct je betaalrekening." },
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

              {/* Immigrant Documents Tab */}
              {activeTab === "documents" && (
                <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#141413]">
                        Mijn Dossier & Documenten
                      </h3>
                      <p className="text-xs text-[#6c6a64]">
                        Beheer hier veilige kopieën van je officiële documenten en formulieren
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDocUploadModal(true)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white hover:bg-[#a9583e]"
                    >
                      <Plus className="h-4 w-4" />
                      + Document Toevoegen
                    </button>
                  </div>

                  <div className="space-y-3">
                    {userDocuments.map((d) => (
                      <div
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece6de] bg-[#faf9f5] p-3.5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#141413]">{d.title}</div>
                            <div className="text-[#6c6a64]">
                              Categorie: {d.category} {d.fileSize ? `• ${d.fileSize}` : ""}
                            </div>
                            <div className="text-[11px] text-[#8c887f]">Toegevoegd op: {d.uploadedAt}</div>
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
                            {d.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(d.id)}
                            className="p-1.5 text-[#6c6a64] hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Document Modal */}
                  {showDocUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                      <div className="w-full max-w-md rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xl text-xs">
                        <h3 className="font-bold text-sm text-[#141413] mb-1">Document toevoegen aan dossier</h3>
                        <p className="text-[#6c6a64] mb-3">
                          Upload of registreer een document voor je gemeente- of IND-aanvraag.
                        </p>
                        <form onSubmit={handleAddDocument} className="space-y-3">
                          <div>
                            <label className="block font-medium text-[#141413] mb-1">Documentnaam</label>
                            <input
                              type="text"
                              placeholder="bijv. Afspraakbevestiging Gemeente"
                              value={newDocTitle}
                              onChange={(e) => setNewDocTitle(e.target.value)}
                              required
                              className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block font-medium text-[#141413] mb-1">Categorie</label>
                            <select
                              value={newDocCategory}
                              onChange={(e) => setNewDocCategory(e.target.value as UserDocument["category"])}
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
                              onClick={() => setShowDocUploadModal(false)}
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

              {/* Immigrant Support Questions Tab */}
              {activeTab === "ask_help" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs max-w-2xl">
                    <h3 className="font-bold text-base text-[#141413] mb-1">
                      Stel een Vraag aan Jouw Adviseur
                    </h3>
                    <p className="text-xs text-[#6c6a64] mb-4">
                      Begrijp je een ontvangen brief niet of heb je hulp nodig bij een afspraak? Stuur ons direct een bericht.
                    </p>

                    {msgSentSuccess && (
                      <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Je vraag is verzonden! Een adviseur reageert binnen 24 uur.
                      </div>
                    )}

                    <form onSubmit={handleSendSupportMessage} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Onderwerp</label>
                        <input
                          type="text"
                          placeholder="bijv. Hulp bij vertaling brief Gemeente"
                          value={newMsgSubject}
                          onChange={(e) => setNewMsgSubject(e.target.value)}
                          required
                          className="h-9 w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#141413] mb-1">Jouw Vraag</label>
                        <textarea
                          rows={4}
                          placeholder="Beschrijf je vraag of kopieer de tekst van de brief..."
                          value={newMsgContent}
                          onChange={(e) => setNewMsgContent(e.target.value)}
                          required
                          className="w-full rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#a9583e]"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Verstuur Vraag
                      </button>
                    </form>
                  </div>

                  {/* Previous Questions & Answers */}
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs max-w-2xl">
                    <h4 className="font-bold text-sm text-[#141413] mb-3">
                      Eerdere Vragen & Antwoorden
                    </h4>
                    <div className="space-y-3">
                      {supportMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="rounded-xl border border-[#ece6de] bg-[#faf9f5] p-4 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#141413]">{msg.subject}</span>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                msg.status === "beantwoord" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </div>
                          <p className="text-[#3d3d3a]">{msg.message}</p>
                          {msg.reply && (
                            <div className="mt-2 rounded-lg bg-white border border-[#e6dfd8] p-3">
                              <span className="font-semibold text-primary block mb-0.5">Antwoord van Immigratiepunt:</span>
                              <p className="text-[#141413]">{msg.reply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Integration Services Section (Available to all) */}
          <div className="mt-12">
            <div className="mb-4">
              <h2 className="font-display text-2xl tracking-tight text-[#141413]">
                {t("account.servicesTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-xs md:text-sm leading-6 text-[#6c6a64]">
                {t("account.servicesSubtitle")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {partners.map(({ key, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-[#e6dfd8] bg-white p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe9de] transition-colors group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#6c6a64] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">
                    {t(`account.partners.${key}.label`)}
                  </div>
                  <h3 className="font-display mb-1.5 text-lg tracking-tight text-[#141413]">
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
