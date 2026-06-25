"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { Locale, tr } from "@/lib/i18n";
import TodayScreen from "./TodayScreen";
import CalendarScreen from "./CalendarScreen";
import EarningsScreen from "./EarningsScreen";
import SettingsScreen from "./SettingsScreen";

type Tab = "today" | "calendar" | "earnings" | "settings";

export default function AppShell() {
  const { entries, settings, companies, loading, error, saveEntry, deleteEntry, saveSettings, saveCompany, deleteCompany } = useData();
  const [tab, setTab] = useState<Tab>("today");
  const locale = settings.locale as Locale;
  const L = (k: Parameters<typeof tr>[0]) => tr(k, locale);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)" }}>
        …
      </div>
    );
  }

  return (
    <>
    {error && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#b91c1c", color: "#fff", padding: "10px 16px", fontSize: 13, zIndex: 999, fontFamily: "monospace" }}>
        {error}
      </div>
    )}
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", position: "relative" }}>
      {tab === "today" && <TodayScreen entries={entries} settings={settings} companies={companies} onSave={saveEntry} onDelete={deleteEntry} />}
      {tab === "calendar" && <CalendarScreen entries={entries} settings={settings} companies={companies} onSave={saveEntry} onDelete={deleteEntry} />}
      {tab === "earnings" && <EarningsScreen entries={entries} settings={settings} companies={companies} />}
      {tab === "settings" && <SettingsScreen entries={entries} settings={settings} companies={companies} onSave={saveSettings} onSaveCompany={saveCompany} onDeleteCompany={deleteCompany} />}

      <nav style={navBar}>
        <TabBtn active={tab === "today"} onClick={() => setTab("today")} label={L("today")} icon={<ClockIcon />} />
        <TabBtn active={tab === "calendar"} onClick={() => setTab("calendar")} label={L("calendar")} icon={<CalIcon />} />
        <TabBtn active={tab === "earnings"} onClick={() => setTab("earnings")} label={L("earnings")} icon={<CoinIcon />} />
        <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} label={L("settings")} icon={<GearIcon />} />
      </nav>
    </div>
    </>
  );
}

function TabBtn({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, border: "none", background: "transparent",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      padding: "8px 0", color: active ? "var(--ink)" : "var(--text-faint)",
      fontSize: 11, fontWeight: 600,
    }}>
      {icon}
      {label}
    </button>
  );
}

const navBar: React.CSSProperties = {
  position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
  display: "flex", background: "var(--surface)", borderTop: "1px solid var(--line)",
  paddingBottom: "env(safe-area-inset-bottom)",
};

function ClockIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/></svg>; }
function CalIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round"/></svg>; }
function CoinIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.7-1.5-3-1.5-1.6 0-3 .9-3 2s1.4 2 3 2 3 .9 3 2-1.4 2-3 2c-1.3 0-2.5-.5-3-1.5M12 6.5v11" strokeLinecap="round"/></svg>; }
function GearIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" strokeLinecap="round"/></svg>; }
