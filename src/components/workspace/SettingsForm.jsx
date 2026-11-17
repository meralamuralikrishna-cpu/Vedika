import { useState } from "react";
import "./workspace.css";

export const LANGUAGES = [{ code: "en", label: "English" }, { code: "te", label: "తెలుగు (Telugu)" }];

export default function SettingsForm({ profile, onSave }) {
  const [form, setForm] = useState({ name: "", email: "", city: "", organisation: "", language: "en", ...profile });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setForm((f) => ({ ...f, [k]: e.target.value })); };
  const dirty = JSON.stringify(form) !== JSON.stringify({ name: "", email: "", city: "", organisation: "", language: "en", ...profile });
  return (
    <section className="ws">
      <header className="ws-head"><h2>Settings</h2></header>
      <form className="ws-form ws-panel" onSubmit={(e) => { e.preventDefault(); onSave(form); setSaved(true); }}>
        <label>Name<input value={form.name} onChange={set("name")} autoComplete="name" /></label>
        <label>Email<input type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
        <label>City<input value={form.city} onChange={set("city")} autoComplete="address-level2" /></label>
        <label>Organisation<input value={form.organisation} onChange={set("organisation")} placeholder="Studio or company (optional)" /></label>
        <label>Language<select value={form.language} onChange={set("language")}>{LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}</select></label>
        <div className="ws-actions"><button className="ws-btn is-primary" type="submit" disabled={!dirty}>Save changes</button>{saved && <span className="ws-muted" role="status">Saved</span>}</div>
      </form>
    </section>
  );
}
