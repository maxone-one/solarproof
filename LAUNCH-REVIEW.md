# LAUNCH-REVIEW — solarproof

> Pflicht-Dokument nach [Standard 013](https://github.com/maxone-one/maxone-standards/blob/main/standards/013-launch-gate-review.md).
> Checkliste: [`checklists/013-launch-gate.md`](https://github.com/maxone-one/maxone-standards/blob/main/checklists/013-launch-gate.md)

---

## Projekt-Kontext

- **Projekt:** solarproof
- **Domain(s):** solarproof.maxone.one (intern / Subdomain)
- **Stack:** Vite / React / Tailwind / Radix UI / Shadcn — SPA ohne Backend
- **Externe Dienste:** Hetzner (VPS, maxone-prod — statisches Hosting)
- **Datenkategorien:** keine personenbezogenen Daten (reines Frontend-Tool / Offline-fähige SPA)
- **Erwartete Nutzerzahl:** intern / ~10 Nutzer

---

## A. Code-Verständnis & Verantwortung

- [x] Black-Box-Anteil: ~20 % (KI-augmentiert, reviewed)
- [x] `npm audit --production`: Critical 0, High 0 (Datum: 2026-05-11)
- [x] Lockfile committed: ja
- [x] Review-Pass durch Max Karastelev

**Notizen:** Reine SPA — kein Backend, keine Datenhaltung server-seitig.

## B. Auth & Authorization

- [x] Auth: n/a (keine Auth — internes Tool, kein Anmeldezwang)
- [x] Bezahlfeatures: n/a

**Notizen:** Tool ist über Subdomain erreichbar, kein öffentlicher sensitiver Endpunkt.

## C. Datenbank-Sicherheit

- [x] Datenbank: n/a (keine DB — reines SPA)

**Notizen:** ...

## D. Datenschutz / DSGVO

- [x] Keine personenbezogenen Daten gesammelt
- [x] AVV: Hetzner ✅ (standard-terms — nur Hosting)
- [x] Standard 041: data_processors in registry/projects.yml vollständig
- [x] Google Fonts: lokal (oder nicht verwendet)
- [x] Externe Embeds: keine
- [x] Server-Region: EU (Hetzner Nürnberg)

**Notizen:** Internes Werkzeug ohne Nutzerdaten-Erfassung.

## E. Test/Prod-Trennung

- [x] Keine Prod-Credentials (kein Backend)
- [x] Build-Artefakt: statisches dist/ — kein Server-Side-Code

**Notizen:** ...

## F. Frontend-Secrets / Public Bundle

- [x] Bundle-Scan: kein API-Key, kein Token im Bundle
- [x] Source-Maps: deaktiviert (chunk-size-Warning ist bekannt, kein Security-Issue)

**Notizen:** ...

## G. Externe Integrationen

- [x] Keine externen API-Integrationen

**Notizen:** ...

## H. Infrastruktur

- [x] Standard 002 (no-build-on-prod): ✅
- [x] Standard 003 (secrets-store): n/a (keine Secrets)
- [x] Standard 004 (TLS DNS-01): ✅
- [x] Standard 005 (test-first): Smoke-Tests vorhanden
- [x] Standard 001 (blue-green): ✅

## I. Operations / Recovery

- [x] Restart-Policy: `unless-stopped`
- [x] HANDOFF.md: ✅
- [x] Monitoring: Uptime-Kuma

## J. Vibe-Coding-Lückenklassen

- [x] XSS: dangerouslySetInnerHTML — 0 ungesicherte Treffer
- [x] SSRF: n/a (kein Backend)
- [x] Standard 022 (gitleaks): 0 Findings
- [x] Plattform-Lock-in: ☑ Claude Code — kein Lovable/Bolt/v0

**Notizen:** Minimaler Security-Surface als statisches SPA.

---

## Sign-Off — 2026-04-27

- **Verantwortlich:** Max Karastelev (@karastoni)
- **Rolle:** Gründer / Lead Dev
- **Geprüft am:** 2026-04-27
- **Sektionen abgehakt:** A B C D E F G H I J
- **Black-Box-Anteil KI-generiert:** ~20 %
  - Tools verwendet: Claude Code
  - Reviewed durch: Max Karastelev
- **Bekannte Restrisiken:** keine (kein Backend, keine Nutzerdaten)
- **Nächstes Re-Review fällig:** 2027-04-27

---

> **Re-Review-Trigger:** Einführung von Backend/Auth, neues Tracking, oder spätestens nach 12 Monaten.
