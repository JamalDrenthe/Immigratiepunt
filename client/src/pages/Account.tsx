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
  CreditCard,
  Building,
  HelpCircle,
  FolderOpen,
  LayoutDashboard,
  Inbox,
  Compass,
  FileCheck,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { getMember, signOut, signInAsDemo, MemberRole, isEmailAdmin } from "@/lib/auth";
import {
  fetchAllRegistrations,
  fetchAllHelpers,
  fetchLettersForHelper,
  fetchLettersForNewcomer,
  fetchDocumentsForUser,
  fetchSupportMessages,
  fetchHelperSettings,
  fetchPayoutsForHelper,
  fetchIntegrationProfile,
  fetchNotificationsForRole,
  markNotificationRead,
  RegistrationDoc,
  HelperDoc,
  LetterLogDoc,
  UserDocument,
  SupportMessage,
  HelperSettings,
  PayoutRecord,
  IntegrationProfile,
  InAppNotification,
} from "@/lib/firebase";

import NewcomerPortal from "./account/NewcomerPortal";
import HelperPortal from "./account/HelperPortal";
import AdminPortal from "./account/AdminPortal";
import SubscriptionPage from "./account/SubscriptionPage";
import PotjesRadar from "./account/PotjesRadar";
import { LogoMark } from "@/components/Logo";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const member = getMember();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // In-app notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Shared Data States
  const [registrations, setRegistrations] = useState<RegistrationDoc[]>([]);
  const [helpers, setHelpers] = useState<HelperDoc[]>([]);
  const [letters, setLetters] = useState<LetterLogDoc[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
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
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [integrationProfile, setIntegrationProfile] = useState<IntegrationProfile>({
    userEmail: "",
    bsnStatus: "gepland",
    bankAccountStatus: "in_afwachting",
    housingStatus: "begeleiding_actief",
    workStatus: "cv_voorbereiding",
  });

  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  useEffect(() => {
    if (!member) {
      navigate("/inloggen");
      return;
    }

    const isAdminRole = member.role === "admin" || isEmailAdmin(member.email);
    const notifs = fetchNotificationsForRole(isAdminRole ? "admin" : member.role);
    setNotifications(notifs);

    if (isAdminRole) {
      loadAdminData();
    } else if (member.role === "helper") {
      const helperLetters = fetchLettersForHelper(member.email);
      setLetters(helperLetters);
      const settings = fetchHelperSettings(member.email);
      setHelperSettings(settings);
      const helperPayouts = fetchPayoutsForHelper(member.email);
      setPayouts(helperPayouts);
    } else {
      // Newcomer
      const newcomerLetters = fetchLettersForNewcomer(member.name);
      setLetters(newcomerLetters);
      const docs = fetchDocumentsForUser(member.email);
      setDocuments(docs);
      const msgs = fetchSupportMessages(member.email);
      setSupportMessages(msgs);
      const profile = fetchIntegrationProfile(member.email);
      setIntegrationProfile(profile);
    }

    // Check URL path for direct subscription or potjes navigation
    if (
      window.location.pathname.includes("abonnement") ||
      window.location.pathname.includes("prijzen") ||
      window.location.search.includes("tab=subscription")
    ) {
      setActiveTab("subscription");
    } else if (
      window.location.pathname.includes("potjes") ||
      window.location.pathname.includes("subsidie") ||
      window.location.search.includes("tab=potjes")
    ) {
      setActiveTab("potjes");
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

  const handleRoleSwitch = (role: MemberRole) => {
    signInAsDemo(role);
    window.location.reload();
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Sidebar Menu Definition based on Role
  const newcomerMenuItems = [
    { id: "overview", label: "Overzicht & Voortgang", icon: LayoutDashboard },
    { id: "postadres", label: "Mijn Postadres & Brieven", icon: Inbox, badge: letters.length },
    { id: "subscription", label: "Abonnement & Prijzen", icon: CreditCard },
    { id: "potjes", label: "Potjes & Subsidies", icon: Coins, badge: "10+" },
    { id: "integratie", label: "Integratie & Diensten", icon: Compass },
    { id: "documents", label: "Documentenkluis", icon: FolderOpen, badge: documents.length },
    { id: "adviseur", label: "Mijn Adviseur", icon: HelpCircle, badge: supportMessages.filter((m) => m.status === "open").length },
    { id: "settings", label: "Profiel & Instellingen", icon: Settings },
  ];

  const helperMenuItems = [
    { id: "overview", label: "Overzicht & Vergoeding", icon: LayoutDashboard },
    { id: "post", label: "Post Registratie & Archief", icon: Inbox, badge: letters.length },
    { id: "subscription", label: "Abonnement & Gift", icon: CreditCard },
    { id: "financien", label: "Vergoedingen & Uitbetaling", icon: Coins },
    { id: "nieuwkomers", label: "Gekoppelde Nieuwkomers", icon: Users, badge: 1 },
    { id: "settings", label: "Adres & Beschikbaarheid", icon: Settings },
  ];

  const adminMenuItems = [
    { id: "overview", label: "Systeemprestaties", icon: LayoutDashboard },
    { id: "subscription", label: "Tarieven & Urgentie Regeling", icon: CreditCard },
    { id: "matchmaker", label: "Matchmaker Engine", icon: HeartHandshake, badge: registrations.filter((r) => r.status === "nieuw").length },
    { id: "dossiers", label: "Nieuwkomers Dossiers", icon: FileCheck, badge: registrations.length },
    { id: "helpers", label: "Postadres-Helpers", icon: Users, badge: helpers.length },
    { id: "helpdesk", label: "Helpdesk & Vragen", icon: HelpCircle, badge: supportMessages.filter((m) => m.status === "open").length },
  ];

  const currentMenuItems = isAdminRole
    ? adminMenuItems
    : isHelperRole
    ? helperMenuItems
    : newcomerMenuItems;

  const partners = [
    { key: "djobba", icon: Briefcase, url: "https://djobba.nl" },
    { key: "woningvry", icon: Home, url: "https://woningvry.nl" },
    { key: "xabiworld", icon: Landmark, url: "https://xabiworld.com" },
  ];

  return (
    <>
      <Helmet>
        <title>
          {isAdminRole
            ? "Beheerdersportaal | Immigratiepunt"
            : isHelperRole
            ? "Postadres-Helper Portaal | Immigratiepunt"
            : t("account.meta.title")}
        </title>
        <meta name="description" content={t("account.meta.description")} />
      </Helmet>

      <section className="bg-[#faf9f5] py-6 md:py-10 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Top User Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6dfd8] bg-white p-4 md:p-5 shadow-xs">
            <div className="flex items-center gap-3.5">
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
                  <h1 className="font-display text-lg font-bold tracking-tight text-[#141413] md:text-xl">
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
                    {isAdminRole ? "Beheerder" : isHelperRole ? "Postadres-Helper" : "Nieuwkomer"}
                  </span>
                </div>
                <p className="text-xs text-[#6c6a64]">{member.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* In-app Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-[#efe9de] transition-colors"
                  aria-label="Meldingen"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-[#e6dfd8] bg-white p-3.5 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#f0eae1] pb-2 text-xs font-semibold text-[#141413]">
                      <span>Meldingen & Updates</span>
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
                            n.read ? "bg-white text-[#6c6a64]" : "bg-emerald-50/70 text-[#141413] font-medium"
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

              {/* Demo Account Switcher */}
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-1 text-xs">
                <span className="px-1 text-[11px] text-[#8c887f]">Demo Rol:</span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("newcomer")}
                  className={`rounded px-2.5 py-1 font-medium transition-colors ${
                    isNewcomerRole ? "bg-emerald-100 text-emerald-800 font-semibold shadow-xs" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Nieuwkomer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("helper")}
                  className={`rounded px-2.5 py-1 font-medium transition-colors ${
                    isHelperRole ? "bg-blue-100 text-blue-800 font-semibold shadow-xs" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Helper
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`rounded px-2.5 py-1 font-medium transition-colors ${
                    isAdminRole ? "bg-purple-100 text-purple-800 font-semibold shadow-xs" : "text-[#6c6a64] hover:text-[#141413]"
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 text-xs font-semibold text-[#3d3d3a] hover:bg-[#efe9de] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("account.signOut")}
              </button>
            </div>
          </div>

          {/* Main Layout: Responsive Sidebar Navigation + Content Area */}
          <div className="grid gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-[#e6dfd8] bg-white p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#f0eae1] mb-1">
                  <div className="flex items-center gap-2">
                    <LogoMark className="h-4 w-4" />
                    <span className="font-semibold text-xs text-[#141413]">Immigratiepunt</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c887f]">
                    {isAdminRole ? "Beheer" : isHelperRole ? "Helper" : "Portaal"}
                  </span>
                </div>

                <nav className="space-y-1">
                  {currentMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-xs"
                            : "text-[#3d3d3a] hover:bg-[#faf9f5] hover:text-[#141413]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#6c6a64]"}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (typeof item.badge === "number" ? item.badge > 0 : Boolean(item.badge)) && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive ? "bg-white/20 text-white" : "bg-[#f0eae1] text-[#3d3d3a]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Direct contact hint */}
                <div className="mt-4 border-t border-[#f0eae1] pt-3 px-3">
                  <div className="text-[11px] text-[#6c6a64]">Hulp of vragen?</div>
                  <div className="font-semibold text-xs text-[#141413] mt-0.5">info@immigratiepunt.nl</div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3 xl:col-span-4">
              {activeTab === "subscription" ? (
                <SubscriptionPage
                  member={member}
                  role={isAdminRole ? "admin" : isHelperRole ? "helper" : "newcomer"}
                />
              ) : activeTab === "potjes" ? (
                <PotjesRadar
                  member={member}
                  onOpenUrgentie={() => setActiveTab("subscription")}
                />
              ) : (
                <>
                  {isAdminRole && (
                    <AdminPortal
                      member={member}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      registrations={registrations}
                      setRegistrations={setRegistrations}
                      helpers={helpers}
                      setHelpers={setHelpers}
                      supportMessages={supportMessages}
                      setSupportMessages={setSupportMessages}
                      letters={letters}
                      loadAdminData={loadAdminData}
                      isLoadingAdmin={isLoadingAdmin}
                    />
                  )}

                  {isHelperRole && (
                    <HelperPortal
                      member={member}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      letters={letters}
                      setLetters={setLetters}
                      helperSettings={helperSettings}
                      setHelperSettings={setHelperSettings}
                      payouts={payouts}
                      setPayouts={setPayouts}
                    />
                  )}

                  {isNewcomerRole && (
                    <NewcomerPortal
                      member={member}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      letters={letters}
                      setLetters={setLetters}
                      documents={documents}
                      setDocuments={setDocuments}
                      supportMessages={supportMessages}
                      setSupportMessages={setSupportMessages}
                      integrationProfile={integrationProfile}
                      setIntegrationProfile={setIntegrationProfile}
                    />
                  )}
                </>
              )}

              {/* Integration Services Section (Available at bottom of portal) */}
              <div className="mt-12 rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
                <div className="mb-4">
                  <h3 className="font-display text-xl tracking-tight text-[#141413]">
                    {t("account.servicesTitle")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-xs md:text-sm text-[#6c6a64]">
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
                      className="group rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-5 shadow-xs transition-all hover:border-primary/40 hover:bg-white hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#e6dfd8] transition-colors group-hover:bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#6c6a64] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64]">
                        {t(`account.partners.${key}.label`)}
                      </div>
                      <h4 className="font-bold text-sm tracking-tight text-[#141413] mb-1">
                        {t(`account.partners.${key}.title`)}
                      </h4>
                      <p className="text-xs leading-relaxed text-[#3d3d3a]">
                        {t(`account.partners.${key}.text`)}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
